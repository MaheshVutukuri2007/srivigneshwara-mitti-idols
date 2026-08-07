import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, MapPin, ArrowRight, QrCode } from 'lucide-react';
import { addDoc, collection, doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LocationPickerMap from '../components/LocationPickerMap';
import UpiQrPaymentModal from '../components/UpiQrPaymentModal';
import { Order, OrderLocation, DeliveryAddress } from '../types';

export default function CheckoutPage() {
  const { user, customerProfile, loginWithEmail, signupWithEmail, loginWithGoogle } = useAuth();
  const { cartItems, subtotal, discountAmount, totalAmount, appliedCoupon, clearCart } = useCart();
  const navigate = useNavigate();

  // Login Form Toggle if guest
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [phoneAuthInput, setPhoneAuthInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Checkout Form State
  const [fullName, setFullName] = useState(customerProfile?.name || '');
  const [phone, setPhone] = useState(customerProfile?.phone || '');
  const [altPhone, setAltPhone] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('520002');
  const [notes, setNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'upi_qr' | 'cod'>('cod');
  const [upiId, setUpiId] = useState('');
  const [upiPayeeName, setUpiPayeeName] = useState('Sri Vigneshwara Mitti Idols');
  const [orderLocation, setOrderLocation] = useState<OrderLocation>({
    lat: 16.5062,
    lng: 80.648,
    googleMapsUrl: 'https://www.google.com/maps?q=16.5062,80.648',
  });

  const [placingOrder, setPlacingOrder] = useState(false);
  const [showUpiQrModal, setShowUpiQrModal] = useState(false);
  const [createdOrderObj, setCreatedOrderObj] = useState<Order | null>(null);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'store_settings')).then((snapshot) => {
      if (!snapshot.exists()) return;
      const settings = snapshot.data();
      setUpiId(settings.upiId || '');
      setUpiPayeeName(settings.upiPayeeName || 'Sri Vigneshwara Mitti Idols');
    }).catch((err) => console.error('Could not load UPI payment settings:', err));
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authMode === 'login') {
        await loginWithEmail(emailInput, passInput);
      } else {
        await signupWithEmail(emailInput, passInput, nameInput, phoneAuthInput);
      }
    } catch (err: any) {
      console.error('Auth error in checkout:', err);
      setAuthError(err.message || 'Authentication failed. Please check your details.');
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (cartItems.length === 0) return;

    setPlacingOrder(true);

    const orderNumber = `SVM-${Date.now().toString().slice(-6)}`;

    const deliveryAddress: DeliveryAddress = {
      fullName,
      phone,
      altPhone,
      street,
      landmark,
      area,
      pincode,
      city: 'Vijayawada',
      notes,
    };

    // Older products and carts can omit optional item details. Firestore rejects
    // `undefined` values, so copy only fields that are actually present.
    const orderItems = cartItems.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      ...(typeof item.originalPrice === 'number' ? { originalPrice: item.originalPrice } : {}),
      ...(typeof item.heightInInches === 'number' ? { heightInInches: item.heightInInches } : {}),
      ...(item.material ? { material: item.material } : {}),
    }));

    const newOrder: Omit<Order, 'id'> = {
      orderNumber,
      customerId: user.uid,
      customerEmail: user.email || '',
      customerName: fullName,
      phone,
      altPhone,
      deliveryAddress,
      location: orderLocation,
      items: orderItems,
      subtotal,
      discountAmount,
      totalAmount,
      ...(appliedCoupon?.code ? { couponCode: appliedCoupon.code } : {}),
      paymentMethod,
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      statusHistory: [
        {
          status: 'Pending',
          timestamp: new Date().toISOString(),
          note: 'Order placed by customer',
        },
      ],
      createdAt: new Date().toISOString(),
    };

    try {
      // Save order to Firestore
      const orderDocRef = await addDoc(collection(db, 'orders'), newOrder);
      const fullOrderObj: Order = { id: orderDocRef.id, ...newOrder };

      // Reduce product stock in Firestore
      for (const item of cartItems) {
        try {
          const prodRef = doc(db, 'products', item.productId);
          await updateDoc(prodRef, {
            stock: increment(-item.quantity),
          });
        } catch (err) {
          console.error(`Error updating stock for product ${item.productId}:`, err);
        }
      }

      if (paymentMethod === 'upi_qr') {
        setCreatedOrderObj(fullOrderObj);
        setShowUpiQrModal(true);
        setPlacingOrder(false);
      } else {
        // Cash on delivery
        clearCart();
        navigate(`/order-success/${orderDocRef.id}`);
      }
    } catch (err: any) {
      console.error('Error creating order:', err);
      alert(`Could not place order: ${err?.message || 'Please try again.'}`);
      setPlacingOrder(false);
    }
  };

  const handleUpiPaymentSubmitted = async (paymentReference: string) => {
    if (!createdOrderObj) return;

    try {
      // Customers can create payment requests but cannot update orders under the
      // Firestore rules. Store the submitted UPI reference in the payment queue,
      // where the admin can verify it against the personal UPI account.
      await addDoc(collection(db, 'payments'), {
        orderId: createdOrderObj.id,
        customerId: createdOrderObj.customerId,
        paymentReference,
        paymentMethod: 'upi_qr',
        amount: createdOrderObj.totalAmount,
        status: 'pending',
        date: new Date().toISOString(),
      });

      clearCart();
      setShowUpiQrModal(false);
      navigate(`/order-success/${createdOrderObj.id}`);
    } catch (err) {
      console.error('Error saving UPI payment request:', err);
      alert('We could not submit your payment reference. Please try again or contact the store before making another payment.');
    }
  };

  // If NOT Logged In: Show Auth Prompts
  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-[#FFFDF7] dark:bg-stone-900 p-8 rounded-3xl border border-amber-900/10 shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <span className="text-2xl">🪔</span>
            <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
              {authMode === 'login' ? 'Login to Complete Order' : 'Create Customer Account'}
            </h2>
            <p className="text-xs text-stone-500">
              Your details are required to coordinate doorstep delivery in Vijayawada.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loginWithGoogle()}
            className="w-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow hover:bg-stone-50"
          >
            <span>Continue with Google Login</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-stone-400">
            <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
            <span>or use email</span>
            <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs">
            {authMode === 'signup' && (
              <>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Full Name"
                  className="w-full p-3 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 outline-none"
                  required
                />
                <input
                  type="tel"
                  value={phoneAuthInput}
                  onChange={(e) => setPhoneAuthInput(e.target.value)}
                  placeholder="Mobile Phone Number"
                  className="w-full p-3 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 outline-none"
                  required
                />
              </>
            )}

            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Email Address"
              className="w-full p-3 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 outline-none"
              required
            />

            <input
              type="password"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              placeholder="Password"
              className="w-full p-3 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 outline-none"
              required
            />

            {authError && <p className="text-rose-600 font-bold text-xs">{authError}</p>}

            <button
              type="submit"
              className="w-full bg-[#FF7A00] text-white font-bold py-3.5 rounded-xl shadow text-xs"
            >
              {authMode === 'login' ? 'Sign In & Proceed' : 'Register & Proceed'}
            </button>
          </form>

          <div className="text-center text-xs text-stone-500">
            {authMode === 'login' ? (
              <button onClick={() => setAuthMode('signup')} className="text-[#FF7A00] font-bold hover:underline">
                Don't have an account? Register here
              </button>
            ) : (
              <button onClick={() => setAuthMode('login')} className="text-[#FF7A00] font-bold hover:underline">
                Already have an account? Login here
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="font-serif font-extrabold text-3xl text-stone-900 dark:text-stone-100">
          Checkout & Vijayawada Delivery
        </h1>

        <form onSubmit={handleCreateOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Delivery Form Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Details */}
            <div className="bg-[#FFFDF7] dark:bg-stone-900 p-6 rounded-2xl border border-amber-900/10 dark:border-stone-800 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#FF7A00]" /> 1. Customer & Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Receiver Name"
                    className="w-full p-3 mt-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300">Mobile Phone Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Primary Contact"
                    className="w-full p-3 mt-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300">Alternate Phone (Optional)</label>
                  <input
                    type="tel"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    placeholder="Secondary Number"
                    className="w-full p-3 mt-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300">City / District</label>
                  <input
                    type="text"
                    value="Vijayawada (Free Delivery)"
                    disabled
                    className="w-full p-3 mt-1 bg-amber-50 dark:bg-stone-800/80 rounded-xl border border-amber-300 text-[#FF7A00] font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Address Form */}
            <div className="bg-[#FFFDF7] dark:bg-stone-900 p-6 rounded-2xl border border-amber-900/10 dark:border-stone-800 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#FF7A00]" /> 2. Doorstep Address Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-bold text-stone-700 dark:text-stone-300">House No / Street / Apartment *</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. Door No 12-4-5, Sri Krishna Residency"
                    className="w-full p-3 mt-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300">Landmark *</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Opp Swarna Palace / Near Bus Stand"
                    className="w-full p-3 mt-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300">Area / Colony *</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Governorpet / Patamata / Benz Circle"
                    className="w-full p-3 mt-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300">Pincode *</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 520002"
                    className="w-full p-3 mt-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300">Special Delivery Notes</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Call before arrival"
                    className="w-full p-3 mt-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 outline-none"
                  />
                </div>
              </div>

              {/* Interactive Map Pin */}
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
                <LocationPickerMap
                  onLocationSelect={(loc) => setOrderLocation(loc)}
                  initialLat={16.5062}
                  initialLng={80.648}
                />
              </div>
            </div>

            {/* Payment Method Option */}
            <div className="bg-[#FFFDF7] dark:bg-stone-900 p-6 rounded-2xl border border-amber-900/10 dark:border-stone-800 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#FF7A00]" /> 3. Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  onClick={() => upiId && setPaymentMethod('upi_qr')}
                  className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                    !upiId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${
                    paymentMethod === 'upi_qr'
                      ? 'border-[#FF7A00] bg-amber-50/50 dark:bg-amber-950/40'
                      : 'border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <div>
                    <p className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-1"><QrCode className="w-3.5 h-3.5" /> Pay by UPI QR</p>
                    <p className="text-[10px] text-stone-500">Scan a QR code to pay the exact order amount</p>
                    {!upiId && <p className="text-[10px] text-rose-600 mt-1">UPI payment is not configured yet.</p>}
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'upi_qr' ? 'border-[#FF7A00] bg-[#FF7A00]' : 'border-stone-300'
                    }`}
                  >
                    {paymentMethod === 'upi_qr' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#FF7A00] bg-amber-50/50 dark:bg-amber-950/40'
                      : 'border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <div>
                    <p className="font-bold text-xs text-stone-900 dark:text-stone-100">Cash on Delivery (COD)</p>
                    <p className="text-[10px] text-stone-500">Pay cash upon Vijayawada doorstep arrival</p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'cod' ? 'border-[#FF7A00] bg-[#FF7A00]' : 'border-stone-300'
                    }`}
                  >
                    {paymentMethod === 'cod' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="space-y-6">
            <div className="bg-[#FFFDF7] dark:bg-stone-900 p-6 rounded-2xl border border-amber-900/10 dark:border-stone-800 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 border-b border-stone-200 pb-3">
                Order Review ({cartItems.length} Idols)
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-xs">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-stone-100" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-stone-900 dark:text-stone-100 truncate">{item.name}</p>
                      <p className="text-[10px] text-stone-500">Qty: {item.quantity} x ₹{item.price}</p>
                    </div>
                    <span className="font-extrabold text-[#FF7A00]">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-200 pt-3 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Savings:</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Vijayawada Doorstep Express:</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#FF7A00] border-t border-stone-200 pt-3">
                  <span>Total Payable:</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={placingOrder}
                className="w-full bg-[#FF7A00] hover:bg-amber-600 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm transition-transform active:scale-95 disabled:opacity-50"
              >
                <span>{paymentMethod === 'upi_qr' ? 'Show UPI QR & Place Order' : 'Confirm COD Order'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* UPI QR Modal */}
      {showUpiQrModal && createdOrderObj && (
        <UpiQrPaymentModal
          order={createdOrderObj}
          upiId={upiId}
          payeeName={upiPayeeName}
          onPaymentSubmitted={handleUpiPaymentSubmitted}
          onClose={() => setShowUpiQrModal(false)}
        />
      )}
    </div>
  );
}
