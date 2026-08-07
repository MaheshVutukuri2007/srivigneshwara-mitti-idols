import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, Tag, ShoppingBag, Truck, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    totalAmount,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
  } = useCart();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; message: string } | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await applyCouponCode(couponInput);
    setCouponMsg(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-[#FFFDF7] dark:bg-stone-900 p-8 rounded-3xl border border-amber-900/10 dark:border-stone-800 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-[#FF7A00] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-stone-900 dark:text-stone-100">
            Your Cart is Empty
          </h2>
          <p className="text-xs text-stone-500">
            You have not added any eco-friendly Ganesh idols to your cart yet.
          </p>
          <Link
            to="/products"
            className="bg-[#FF7A00] text-white font-bold text-xs px-6 py-3 rounded-xl shadow inline-block"
          >
            Explore Eco Idols
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="font-serif font-extrabold text-3xl text-stone-900 dark:text-stone-100">
          Shopping Cart ({cartItems.length} Idols)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="bg-[#FFFDF7] dark:bg-stone-900 p-4 sm:p-5 rounded-2xl border border-amber-900/10 dark:border-stone-800 shadow-sm flex items-center gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-stone-100"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Height: {item.heightInInches || 12}" • {item.material}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 text-xs font-bold">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-2.5 py-1 text-stone-600 dark:text-stone-300 hover:bg-stone-200"
                      >
                        -
                      </button>
                      <span className="px-3 py-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-2.5 py-1 text-stone-600 dark:text-stone-300 hover:bg-stone-200"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-[#FF7A00] text-sm">
                        ₹{item.price * item.quantity}
                      </span>
                      {item.quantity > 1 && (
                        <span className="block text-[10px] text-stone-400">₹{item.price} each</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-2 text-stone-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary & Coupon Column */}
          <div className="space-y-6">
            {/* Coupon Box */}
            <div className="bg-[#FFFDF7] dark:bg-stone-900 p-5 rounded-2xl border border-amber-900/10 dark:border-stone-800 shadow-sm space-y-3">
              <h3 className="font-serif font-bold text-sm flex items-center gap-1.5 text-stone-900 dark:text-stone-100">
                <Tag className="w-4 h-4 text-[#FF7A00]" /> Apply Promo Coupon
              </h3>

              {appliedCoupon ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-emerald-800 dark:text-emerald-300">
                      Code '{appliedCoupon.code}' Applied!
                    </p>
                    <p className="text-[10px] text-emerald-600">Saved {appliedCoupon.discountPercent}%</p>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="e.g. GANESH2026"
                    className="flex-1 text-xs p-2.5 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 outline-none uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-[#FF7A00] text-white text-xs font-bold px-4 rounded-xl shadow"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponMsg && (
                <p className={`text-xs font-bold ${couponMsg.success ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {couponMsg.message}
                </p>
              )}
            </div>

            {/* Summary */}
            <div className="bg-[#FFFDF7] dark:bg-stone-900 p-6 rounded-2xl border border-amber-900/10 dark:border-stone-800 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 border-b border-stone-200 pb-3">
                Order Summary
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Subtotal:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">₹{subtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount:</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Vijayawada Doorstep Delivery:</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-[#FF7A00] border-t border-stone-200 pt-3">
                  <span>Grand Total:</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#FF7A00] hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm transition-transform active:scale-95"
              >
                <span>Proceed To Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
