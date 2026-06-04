import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface w-full py-12 md:py-section-gap border-t border-outline-variant/20 font-body-md text-body-md">
      <div className="max-w-7xl mx-auto px-6 md:px-container-padding">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mb-10 md:mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              className="font-display-xl tracking-tighter text-primary flex items-center gap-2 text-headline-md mb-3"
              href="#"
            >
              <span className="material-symbols-outlined text-[26px]">
                shopping_basket
              </span>
              Shuddhota CO.
            </Link>
            <p className="text-on-surface-variant text-[12px] md:text-body-md leading-relaxed">
              Pure spices, bold flavors. Stone-ground in Bangladesh since 2018.
            </p>
          </div>
          {/* Shop */}
          <div>
            <h4 className="text-[11px] font-semibold text-on-surface mb-3 uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-on-surface-variant hover:text-primary transition-colors text-[12px] md:text-body-md"
                >
                  Whole Spices
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-on-surface-variant hover:text-primary transition-colors text-[12px] md:text-body-md"
                >
                  Blended Masalas
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-on-surface-variant hover:text-primary transition-colors text-[12px] md:text-body-md"
                >
                  Ground Masalas
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-on-surface-variant hover:text-primary transition-colors text-[12px] md:text-body-md"
                >
                  Dals & Pulses
                </Link>
              </li>
            </ul>
          </div>
          {/* Help */}
          <div>
            <h4 className="text-[11px] font-semibold text-on-surface mb-3 uppercase tracking-wider">
              Help
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-on-surface-variant hover:text-primary transition-colors text-[12px] md:text-body-md"
                >
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-on-surface-variant hover:text-primary transition-colors text-[12px] md:text-body-md"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-on-surface-variant hover:text-primary transition-colors text-[12px] md:text-body-md"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-on-surface-variant hover:text-primary transition-colors text-[12px] md:text-body-md"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          {/* Company */}
          <div>
            <h4 className="text-[11px] font-semibold text-on-surface mb-3 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-on-surface-variant hover:text-primary transition-colors text-[12px] md:text-body-md"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-on-surface-variant hover:text-primary transition-colors text-[12px] md:text-body-md"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-on-surface-variant hover:text-primary transition-colors text-[12px] md:text-body-md"
                >
                  Wholesale
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-on-surface-variant hover:text-primary transition-colors text-[12px] md:text-body-md"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-outline-variant/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-on-surface-variant text-[11px] md:text-sm">
            © 2024 Shuddhota Co. Pure spices, bold flavors.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-surface-container-low rounded-full px-3 py-1.5 border border-outline-variant/30">
              <span className="material-symbols-outlined text-secondary text-[14px] md:text-[16px]">
                verified
              </span>
              <span className="text-[10px] md:text-[12px] text-on-surface-variant font-medium">
                BSTI Certified
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-surface-container-low rounded-full px-3 py-1.5 border border-outline-variant/30">
              <span className="material-symbols-outlined text-secondary text-[14px] md:text-[16px]">
                eco
              </span>
              <span className="text-[10px] md:text-[12px] text-on-surface-variant font-medium">
                100% Natural
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
