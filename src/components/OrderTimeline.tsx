import React from 'react';
import { Clock, CheckCircle2, PackageCheck, Truck, Home, XCircle, RefreshCw } from 'lucide-react';
import { OrderStatus } from '../types';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  statusHistory?: { status: OrderStatus; timestamp: string; note?: string }[];
}

const steps: { status: OrderStatus; label: string; icon: React.FC<{ className?: string }> }[] = [
  { status: 'Pending', label: 'Order Placed', icon: Clock },
  { status: 'Confirmed', label: 'Order Confirmed', icon: CheckCircle2 },
  { status: 'Preparing', label: 'Handcrafting / Packing Idol', icon: RefreshCw },
  { status: 'Out for Delivery', label: 'Out for Delivery (Vijayawada)', icon: Truck },
  { status: 'Delivered', label: 'Delivered at Doorstep', icon: Home },
];

export default function OrderTimeline({ currentStatus, statusHistory = [] }: OrderTimelineProps) {
  if (currentStatus === 'Cancelled') {
    return (
      <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl p-4 text-center text-rose-700 dark:text-rose-300 flex items-center justify-center gap-2 font-semibold">
        <XCircle className="w-5 h-5" /> Order has been Cancelled
      </div>
    );
  }

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Confirmed':
        return 1;
      case 'Preparing':
      case 'Packed':
        return 2;
      case 'Out for Delivery':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="py-4">
      <div className="relative flex items-center justify-between max-w-2xl mx-auto">
        {/* Connecting Background Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-stone-200 dark:bg-stone-800 -translate-y-1/2 z-0" />
        
        {/* Progress Fill Line */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#FF7A00] to-emerald-500 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-[#FF7A00] text-white ring-4 ring-amber-200 dark:ring-amber-900 shadow-lg scale-110'
                    : isCompleted
                    ? 'bg-emerald-500 text-white shadow'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-300 dark:border-stone-700'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <span
                className={`text-[11px] font-semibold mt-2 text-center max-w-[90px] ${
                  isCurrent
                    ? 'text-[#FF7A00] dark:text-amber-400 font-bold'
                    : isCompleted
                    ? 'text-stone-800 dark:text-stone-200'
                    : 'text-stone-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
