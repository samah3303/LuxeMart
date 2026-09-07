import { Navbar } from "@/components/Navbar";
import { MobileBottomBar } from "@/components/MobileBottomBar";
import { CartProvider } from "@/context/CartContext";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen w-full flex flex-col bg-[#faf8f5] text-[#090d16] overflow-x-hidden">
        <Navbar />
        <main className="flex-grow w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 md:py-10 pb-28 md:pb-12 min-w-0">
          {children}
        </main>
        
        {/* Luxury Minimal Footer */}
        <footer className="bg-[#090d16] text-[#faf8f5] py-12 border-t border-white/10 hidden md:block">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
            <div>
              <span className="font-display text-lg font-bold text-white block mb-1">Goodfinds</span>
              <p>Curated direct-from-manufacturer lifestyle essentials & smart finds.</p>
            </div>
            <div className="flex items-center gap-6">
              <span>Express Doorstep Delivery</span>
              <span>&bull;</span>
              <span>UPI & COD Protected</span>
              <span>&bull;</span>
              <span>&copy; 2026 Goodfinds</span>
            </div>
          </div>
        </footer>

        {/* Floating Mobile Dock */}
        <MobileBottomBar />
      </div>
    </CartProvider>
  );
}
