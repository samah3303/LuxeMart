'use client';

import React, { useState } from 'react';
import { updateFulfillment } from '@/actions/orderActions';
import { Check, Copy, Save, Truck } from 'lucide-react';

interface FulfillmentFormProps {
  orderId: string;
  initialData: {
    supplierOrderId?: string | null;
    courierName?: string | null;
    trackingNumber?: string | null;
    fulfillmentStatus?: string | null;
    paymentStatus?: string | null;
  };
  addressText: string;
}

export function FulfillmentForm({ orderId, initialData, addressText }: FulfillmentFormProps) {
  const [formData, setFormData] = useState({
    supplierOrderId: initialData.supplierOrderId || '',
    courierName: initialData.courierName || 'Shiprocket (Delhivery)',
    trackingNumber: initialData.trackingNumber || '',
    fulfillmentStatus: initialData.fulfillmentStatus || 'PENDING_SUPPLIER',
    paymentStatus: initialData.paymentStatus || 'PENDING',
  });

  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(addressText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      await updateFulfillment(orderId, {
        supplierOrderId: formData.supplierOrderId,
        courierName: formData.courierName,
        trackingNumber: formData.trackingNumber,
        fulfillmentStatus: formData.fulfillmentStatus,
        paymentStatus: formData.paymentStatus,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1-Click Copy Address for Supplier */}
      <div className="bg-[#090d16] p-5 sm:p-6 rounded-3xl text-[#faf8f5] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-white/10">
        <div>
          <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-widest block">
            Dropship Dispatch Action
          </span>
          <h4 className="font-display font-bold text-sm sm:text-base text-white mt-0.5">
            1-Click Copy Formatted Address
          </h4>
          <p className="text-slate-400 text-xs mt-0.5 font-light">
            Formatted specifically for Roposo Clout, GlowRoad, or Meesho order placement.
          </p>
        </div>
        <button
          onClick={handleCopyAddress}
          className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm active:scale-95 cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={16} />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy size={16} />
              <span>Copy Address for Supplier</span>
            </>
          )}
        </button>
      </div>

      {/* Fulfillment Status Form */}
      <form onSubmit={handleSave} className="bg-white p-5 sm:p-8 rounded-3xl border border-[#eee9df] shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-[#eee9df] pb-3">
          <h3 className="font-display font-bold text-[#090d16] text-base flex items-center gap-2">
            <Truck size={18} className="text-amber-800" />
            <span>Fulfillment & Dispatch Controls</span>
          </h3>
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <Check size={14} /> Saved Successfully
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Supplier Order Reference ID
            </label>
            <input
              type="text"
              value={formData.supplierOrderId}
              onChange={(e) => setFormData({ ...formData, supplierOrderId: e.target.value })}
              placeholder="e.g. ROP-102938 / GLOW-4491"
              className="w-full border border-[#e8e3d9] bg-[#faf8f5] rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-amber-700 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Fulfillment Workflow Stage
            </label>
            <select
              value={formData.fulfillmentStatus}
              onChange={(e) => setFormData({ ...formData, fulfillmentStatus: e.target.value })}
              className="w-full border border-[#e8e3d9] bg-[#faf8f5] rounded-xl px-3 py-2.5 focus:bg-white focus:border-amber-700 focus:outline-none font-semibold text-slate-800"
            >
              <option value="PENDING_SUPPLIER">PENDING SUPPLIER (Need to place order)</option>
              <option value="ORDERED_AT_SUPPLIER">ORDERED AT SUPPLIER (Placed with wholesaler)</option>
              <option value="SHIPPED">SHIPPED / IN TRANSIT (Courier dispatched)</option>
              <option value="DELIVERED">DELIVERED (Accepted by customer)</option>
              <option value="RTO_RETURNED">RTO / RETURNED TO ORIGIN (Rejected/Failed)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Courier Aggregator / Partner
            </label>
            <select
              value={formData.courierName}
              onChange={(e) => setFormData({ ...formData, courierName: e.target.value })}
              className="w-full border border-[#e8e3d9] bg-[#faf8f5] rounded-xl px-3 py-2.5 focus:bg-white focus:border-amber-700 focus:outline-none"
            >
              <option value="Shiprocket (Delhivery)">Shiprocket (Delhivery)</option>
              <option value="Shiprocket (Bluedart)">Shiprocket (Bluedart)</option>
              <option value="Shiprocket (Shadowfax)">Shiprocket (Shadowfax)</option>
              <option value="Speed Post Express (COD)">Speed Post Express (COD)</option>
              <option value="NimbusPost">NimbusPost</option>
              <option value="Direct Supplier Courier">Direct Supplier Courier</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Air Waybill / Tracking Number (AWB)
            </label>
            <input
              type="text"
              value={formData.trackingNumber}
              onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
              placeholder="e.g. 143284918239"
              className="w-full border border-[#e8e3d9] bg-[#faf8f5] rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-amber-700 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Payment Settlement Status
            </label>
            <select
              value={formData.paymentStatus}
              onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
              className="w-full border border-[#e8e3d9] bg-[#faf8f5] rounded-xl px-3 py-2.5 focus:bg-white focus:border-amber-700 focus:outline-none"
            >
              <option value="PAID">PAID (Prepaid UPI or Courier Remitted)</option>
              <option value="PENDING">PENDING (Awaiting Doorstep Cash Collection)</option>
              <option value="REFUNDED">REFUNDED / CANCELLED</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto bg-[#090d16] hover:bg-slate-800 text-[#faf8f5] font-extrabold text-xs px-6 py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save size={16} />
            <span>{saving ? 'Updating...' : 'Save Fulfillment Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
