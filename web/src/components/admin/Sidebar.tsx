import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, ExternalLink, Sparkles } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-950 text-slate-200 min-h-screen p-5 flex flex-col justify-between border-r border-slate-800">
      <div>
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-tight">Goodfinds</h1>
            <span className="text-[10px] uppercase font-extrabold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
              Dropship
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Operations & Sourcing Hub</p>
        </div>

        <nav className="space-y-1.5 text-sm font-semibold">
          <Link
            href="/admin"
            className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition text-slate-300"
          >
            <LayoutDashboard size={18} className="text-emerald-400" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition text-slate-300"
          >
            <ShoppingCart size={18} className="text-indigo-400" />
            <span>Fulfillment & Orders</span>
          </Link>

          <Link
            href="/admin/products"
            className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition text-slate-300"
          >
            <Package size={18} className="text-amber-400" />
            <span>Products & Sourcing</span>
          </Link>
        </nav>
      </div>

      <div className="pt-6 border-t border-slate-800/80 space-y-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition"
        >
          <span className="flex items-center gap-2">
            <ExternalLink size={14} />
            <span>View Live Store</span>
          </span>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Preview</span>
        </Link>

        <div className="p-3 bg-gradient-to-br from-indigo-950/60 to-emerald-950/60 rounded-xl border border-indigo-500/20 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-bold text-slate-200 mb-1">
            <Sparkles size={14} className="text-emerald-400" />
            <span>Direct Sourcing</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Direct integration with verified suppliers, Cash on Delivery & UPI processing.
          </p>
        </div>
      </div>
    </aside>
  );
}
