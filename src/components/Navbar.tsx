"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="fixed top-3 md:top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl rounded-full border border-outline-variant/30 bg-surface/80 backdrop-blur-xl shadow-sm shadow-[0_8px_32px_rgba(0,0,0,0.05)] z-50 flex justify-between items-center px-4 md:px-8 py-2 md:py-3">
        <Link
          className="font-display-xl tracking-tighter text-primary flex items-center gap-1.5 md:gap-2 text-[15px] md:text-headline-md"
          href="/"
        >
          <span className="material-symbols-outlined text-[20px] md:text-[28px]">
            shopping_basket
          </span>
          <span className="hidden sm:inline">Shuddhota CO.</span>
          <span className="sm:hidden font-bold">Shuddhota</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link
            className={`${
              pathname === "/" ? "text-primary font-bold" : "text-on-surface-variant font-medium hover:text-primary transition-colors"
            } font-body-md text-body-md`}
            href="/"
          >
            Home
          </Link>
          <Link
            className={`${
              pathname === "/products" ? "text-primary font-bold" : "text-on-surface-variant font-medium hover:text-primary transition-colors"
            } font-body-md text-body-md`}
            href="/products"
          >
            Products
          </Link>
          <Link
            className="text-on-surface-variant font-medium hover:text-primary transition-colors font-body-md text-body-md"
            href="#"
          >
            Deals
          </Link>
          <Link
            className="text-on-surface-variant font-medium hover:text-primary transition-colors font-body-md text-body-md"
            href="#"
          >
            About
          </Link>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/cart" className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center relative">
            <span className="material-symbols-outlined text-[20px] md:text-[24px]">
              shopping_cart
            </span>
            <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[9px] md:text-[10px] font-bold w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </Link>
          <Link
            className="hidden md:block bg-primary text-on-primary font-medium px-3 md:px-6 py-1.5 md:py-2 rounded-full hover:bg-primary/90 transition-colors text-[12px] md:text-body-md"
            href="/products"
          >
            Shop Now
          </Link>
          <button
            id="mobile-menu-btn"
            className="flex md:hidden text-on-surface-variant hover:text-primary transition-colors items-center justify-center"
            onClick={toggleMobileMenu}
          >
            <span id="hamburger-icon" className="material-symbols-outlined text-[22px]">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Nav Menu */}
      <div
        id="mobile-menu"
        className={`${
          isMenuOpen ? "" : "hidden"
        } fixed top-[60px] left-1/2 -translate-x-1/2 w-[95%] max-w-7xl rounded-[20px] border border-outline-variant/30 bg-surface/95 backdrop-blur-xl shadow-lg z-40 md:hidden`}
      >
        <div className="flex flex-col py-3 px-2">
          <Link
            className={`${
              pathname === "/" ? "text-primary font-bold" : "text-on-surface-variant font-medium hover:text-primary transition-colors"
            } font-body-md text-[15px] py-3 px-4 rounded-xl hover:bg-surface-variant transition-colors`}
            href="/"
          >
            Home
          </Link>
          <Link
            className={`${
              pathname === "/products" ? "text-primary font-bold" : "text-on-surface-variant font-medium hover:text-primary transition-colors"
            } font-body-md text-[15px] py-3 px-4 rounded-xl hover:bg-surface-variant`}
            href="/products"
          >
            Products
          </Link>
          <Link
            className="text-on-surface-variant font-medium hover:text-primary transition-colors font-body-md text-[15px] py-3 px-4 rounded-xl hover:bg-surface-variant"
            href="#"
          >
            Deals
          </Link>
          <Link
            className="text-on-surface-variant font-medium hover:text-primary transition-colors font-body-md text-[15px] py-3 px-4 rounded-xl hover:bg-surface-variant"
            href="#"
          >
            About
          </Link>
          <div className="h-px bg-outline-variant/20 mx-2 my-1"></div>
          <Link
            className="flex items-center justify-center gap-2 bg-primary text-on-primary font-medium text-[14px] py-3 px-4 rounded-xl hover:bg-primary/90 transition-colors"
            href="/products"
          >
            Shop Now
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </>
  );
}
