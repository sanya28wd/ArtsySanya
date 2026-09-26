"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useInquiry } from "@/components/inquiry-provider";
import { motion, AnimatePresence } from "motion/react";
import { LiquidGlassLayer } from "@/components/liquid-glass-layer";

export const Header = () => {
  const { items, toggle } = useInquiry();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
    { href: "/commissions", label: "Commissions" },
  ];

  return (
    <>
      <header className="site-header">
        <Link href="/" className="wordmark" data-cursor-text="HOME">
          artsy<span>sanya</span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Primary navigation" className="desktop-nav">
          {pathname === "/" && <LiquidGlassLayer />}
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? "is-active" : ""}`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="active-nav-dot"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="header-actions">
          <button
            className="bag-button"
            onClick={toggle}
            aria-label={`Open inquiry bag, ${items.length} selected works`}
            data-cursor-text="BAG"
          >
            Inquiry Bag{" "}
            <motion.span
              key={items.length}
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              {String(items.length).padStart(2, "0")}
            </motion.span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-nav-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            <nav className="mobile-nav-links">
              <Link
                href="/"
                className={pathname === "/" ? "is-active" : ""}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={pathname.startsWith(link.href) ? "is-active" : ""}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mobile-nav-footer">
              <span>Dubai, UAE · Handmade & Code</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
