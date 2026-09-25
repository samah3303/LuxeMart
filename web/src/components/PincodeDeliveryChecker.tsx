'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, CheckCircle2, Truck, AlertCircle, Clock } from 'lucide-react';

export function PincodeDeliveryChecker() {
  const [pincode, setPincode] = useState('');
  const [checkedPincode, setCheckedPincode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<string>('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('goodfinds_pincode');
      if (saved && saved.length === 6) {
        setCheckedPincode(saved);
        calculateDeliveryDate();
      }
    } catch (e) {
      // localStorage may fail in private mode
    }
  }, []);

  const calculateDeliveryDate = () => {
    const now = new Date();
    // 3 days later
    const future = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    };
    setDeliveryDate(future.toLocaleDateString('en-US', options));
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pincode.trim();
    if (!/^\d{6}$/.test(clean)) {
      setError('Please enter a valid 6-digit postal pincode.');
      return;
    }
    setError(null);
    setCheckedPincode(clean);
    calculateDeliveryDate();
    try {
      localStorage.setItem('goodfinds_pincode', clean);
    } catch (e) {}
  };

  const handleReset = () => {
    setCheckedPincode(null);
    setPincode('');
    setError(null);
  };

  return (
    <div className="border border-[#dfe3dd] rounded-xl p-3.5 bg-white space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#182018] flex items-center gap-1.5">
          <MapPin size={14} className="text-[#2f7a54]" />
          <span>Delivery Options & Availability</span>
        </span>
        {checkedPincode && (
          <button
            onClick={handleReset}
            className="text-[11px] font-bold text-[#2f7a54] hover:underline cursor-pointer"
          >
            Change
          </button>
        )}
      </div>

      {!checkedPincode ? (
        <form onSubmit={handleCheck} className="space-y-1.5">
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="flex-1 bg-[#f5f6f1] border border-[#dfe3dd] rounded-lg px-3 py-1.5 text-xs text-[#182018] placeholder-[#687068] focus:outline-none focus:border-[#2f7a54]"
            />
            <button
              type="submit"
              className="bg-[#183d2f] hover:bg-[#2f7a54] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition cursor-pointer"
            >
              Check
            </button>
          </div>
          {error && (
            <p className="text-[11px] text-[#ff745e] flex items-center gap-1">
              <AlertCircle size={12} />
              <span>{error}</span>
            </p>
          )}
          <p className="text-[10px] text-[#687068]">
            Enter your destination pincode to check dispatch timeline and COD availability.
          </p>
        </form>
      ) : (
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#182018]">
            <span className="bg-[#f5f6f1] px-2 py-0.5 rounded border border-[#dfe3dd] text-[11px]">
              Pincode: {checkedPincode}
            </span>
            <span className="text-[#2f7a54] flex items-center gap-1 text-[11px]">
              <CheckCircle2 size={13} />
              <span>Serviceable</span>
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-[#182018]">
            <div className="flex items-center gap-2">
              <Truck size={14} className="text-[#2f7a54] flex-shrink-0" />
              <span>
                Estimated Delivery by <span className="font-bold text-[#183d2f]">{deliveryDate}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#2f7a54] flex-shrink-0" />
              <span>
                Fast Standard Shipping: <span className="font-bold text-[#2f7a54]">FREE</span> on prepaid orders
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[#2f7a54] flex-shrink-0" />
              <span>
                Doorstep <span className="font-bold">Cash on Delivery (COD)</span> is available
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
