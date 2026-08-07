import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Customer } from '../../types';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const snap = await getDocs(collection(db, 'customers'));
        setCustomers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Customer)));
      } catch (err) {
        console.error(err);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif font-extrabold text-2xl text-stone-100">Registered Customers</h1>
        <p className="text-xs text-stone-400 mt-1">Directory of registered devotees in Vijayawada.</p>
      </div>

      <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-stone-800 bg-stone-950/50 text-stone-400 font-bold uppercase">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Registered Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800">
            {customers.map((c) => (
              <tr key={c.id}>
                <td className="py-3 px-4 font-bold text-stone-100">{c.name}</td>
                <td className="py-3 px-4 text-stone-300">{c.email}</td>
                <td className="py-3 px-4 text-[#FF7A00] font-bold">{c.phone || 'N/A'}</td>
                <td className="py-3 px-4 text-stone-400">{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
