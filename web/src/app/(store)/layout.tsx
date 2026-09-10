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
      <div className="min-h-screen w-full flex flex-col bg-[#f5f6f1] text-[#182018] overflow-x-hidden">
        <Navbar />
        <main className="flex-grow w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-20 md:pb-8 min-w-0">
          {children}
        </main>
        
        {/* Luxury Minimal Footer */}
        <footer className="bg-[#102c23] text-[#f5f6f1] py-8 border-t border-white/10 hidden md:block">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#aebfb7]">
            <div>
              <span className="font-display text-base font-bold text-white block mb-0.5">Goodfinds</span>
              <p className="text-[11px] text-[#9db4aa]">Curated direct-from-manufacturer lifestyle essentials & smart finds.</p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Express Doorstep Delivery</span>
              <span>&bull;</span>
              <span className="text-[#baf2cd]">UPI & COD Protected</span>
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
