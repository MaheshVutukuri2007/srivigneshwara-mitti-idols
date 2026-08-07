import React, { useState, useEffect } from 'react';
import { Truck, MapPin } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Order } from '../../types';
import LocationPickerMap from '../../components/LocationPickerMap';

export default function AdminDelivery() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snap = await getDocs(collection(db, 'orders'));
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)));
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, []);

  const activeOrders = orders.filter((o) => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif font-extrabold text-2xl text-stone-100">Vijayawada Delivery Map Hub</h1>
        <p className="text-xs text-stone-400 mt-1">Coordinate doorstep dispatch drivers across Patamata, MG Road, Benz Circle, Governorpet, and Enikepadu.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active List */}
        <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 space-y-3 text-xs">
          <h3 className="font-serif font-bold text-sm text-stone-200">Active Delivery Queue ({activeOrders.length})</h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {activeOrders.map((o) => (
              <div key={o.id} className="p-3 bg-stone-800 rounded-xl space-y-1">
                <div className="flex justify-between font-mono text-[#FF7A00] font-bold">
                  <span>#{o.orderNumber}</span>
                  <span className="text-amber-400 font-sans">{o.orderStatus}</span>
                </div>
                <p className="font-bold text-stone-100">{o.customerName}</p>
                <p className="text-stone-400 text-[10px]">{o.deliveryAddress.street}, {o.deliveryAddress.area}</p>
                <a href={`tel:${o.phone}`} className="text-[#FF7A00] font-bold text-[10px] block">📞 {o.phone}</a>
              </div>
            ))}
          </div>
        </div>

        {/* Map View */}
        <div className="lg:col-span-2 bg-stone-900 p-6 rounded-2xl border border-stone-800 space-y-3">
          <h3 className="font-serif font-bold text-sm text-stone-200 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#FF7A00]" /> GPS Dispatch Control
          </h3>
          <LocationPickerMap onLocationSelect={() => {}} initialLat={16.5062} initialLng={80.648} />
        </div>
      </div>
    </div>
  );
}
