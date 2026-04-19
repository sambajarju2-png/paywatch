"use client";

import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ArrowRight, Linkedin, Twitter, Instagram } from "lucide-react";
import { useApp } from "./AppProvider";

/* ─── Menu items ─── */
const menuLinks = [
  {
    href: "/blog",
    label: { nl: "Blog", en: "Blog" },
    image: "/menu/blog.png",
  },
  {
    href: "/about",
    label: { nl: "Over ons", en: "About" },
    image: "/menu/about.png",
  },
  {
    href: "/support",
    label: { nl: "Support", en: "Support" },
    image: "/menu/support.png",
  },
  {
    href: "/schuldhulp",
    label: { nl: "Schuldhulp", en: "Debt Help" },
    image: "/menu/schuldhulp.png",
  },
  {
    href: "/roadmap",
    label: { nl: "Roadmap", en: "Roadmap" },
    image: "/menu/roadmap.png",
  },
];

/* ─── Framer variants ─── */
const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.4, ease: "easeInOut" as const } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut" as const } },
};

const staggerContainer = {
  open: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
  closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const itemVariants = {
  closed: { y: 40, opacity: 0 },
  open: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

const bottomBarVariants = {
  closed: { opacity: 0, y: 20 },
  open: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.5, duration: 0.4 },
  },
};

interface OverlayMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OverlayMenu({ isOpen, onClose }: OverlayMenuProps) {
  const { lang } = useApp();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Body scroll lock */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* Escape key */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col"
          variants={overlayVariants}
          initial="closed"
          animate="open"
          exit="exit"
        >
          {/* Background gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #0A2540 0%, #0E2D4A 30%, #133A5C 60%, #1A4A72 100%)",
            }}
          />

          {/* ─── Top bar ─── */}
          <div className="relative z-10 flex items-center justify-between px-6 py-4 sm:px-8">
            <Link href="/" onClick={onClose}>
              <img src="/logo-dark.svg" alt="PayWatch" className="h-6" />
            </Link>

            {/* Close button */}
            <button
              onClick={onClose}
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:rotate-90 hover:scale-110 hover:bg-white/20"
              aria-label="Close menu"
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>

          {/* ─── Main content ─── */}
          <div className="relative z-10 flex flex-1 items-center px-6 sm:px-8 lg:px-16">
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left: menu items */}
              <motion.nav
                className="lg:col-span-7 flex flex-col gap-1 sm:gap-2"
                variants={staggerContainer}
                initial="closed"
                animate="open"
                exit="closed"
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {menuLinks.map((item, i) => {
                  const isHovered = hoveredIndex === i;
                  const somethingHovered = hoveredIndex !== null;

                  return (
                    <motion.div key={item.href} variants={itemVariants}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        onMouseEnter={() => setHoveredIndex(i)}
                        className="group flex items-center gap-4 py-2 sm:py-3 transition-all duration-300"
                        style={{
                          transform: isHovered ? "translateX(8px)" : "translateX(0)",
                          transition: "transform 0.3s ease, opacity 0.3s ease",
                        }}
                      >
                        {/* Number */}
                        <span
                          className="font-mono text-xs sm:text-sm transition-all duration-300"
                          style={{
                            color: isHovered
                              ? "rgba(255,255,255,0.8)"
                              : "rgba(255,255,255,0.3)",
                            minWidth: "2rem",
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        {/* Label */}
                        <span
                          className="font-extrabold tracking-tighter leading-[0.85] transition-all duration-300"
                          style={{
                            fontSize: "clamp(2rem, 5vw, 5.5rem)",
                            color: isHovered
                              ? "#ffffff"
                              : somethingHovered
                              ? "rgba(255,255,255,0.2)"
                              : "rgba(255,255,255,0.9)",
                          }}
                        >
                          {item.label[lang]}
                        </span>

                        {/* Arrow */}
                        <span
                          className="transition-all duration-300"
                          style={{
                            opacity: isHovered ? 1 : 0,
                            transform: isHovered
                              ? "translateX(0)"
                              : "translateX(-12px)",
                            transition:
                              "opacity 0.3s ease, transform 0.3s ease",
                          }}
                        >
                          <ArrowRight
                            size={24}
                            className="text-[#2563EB] sm:w-8 sm:h-8"
                          />
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.nav>

              {/* Right: preview image (desktop only) */}
              <div className="hidden lg:flex lg:col-span-5 items-center justify-center">
                <div className="relative w-full max-w-md aspect-[4/5] rounded-[28px] overflow-hidden bg-white/5 backdrop-blur-sm shadow-2xl ring-1 ring-white/10">
                  <AnimatePresence mode="sync">
                    <motion.img
                      key={hoveredIndex !== null ? menuLinks[hoveredIndex].image : "default"}
                      src={hoveredIndex !== null ? menuLinks[hoveredIndex].image : menuLinks[0].image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain rounded-[28px]"
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Bottom bar ─── */}
          <motion.div
            className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-6 sm:px-8"
            variants={bottomBarVariants}
            initial="closed"
            animate="open"
          >
            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-white/40">
              <span>Rotterdam, Netherlands</span>
              <span className="text-white/20">·</span>
              <span>KVK 83474889</span>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                {
                  icon: Linkedin,
                  href: "https://www.linkedin.com/company/paywatch-nl",
                  label: "LinkedIn",
                },
                {
                  icon: Twitter,
                  href: "https://x.com/paywatch_nl",
                  label: "Twitter",
                },
                {
                  icon: Instagram,
                  href: "https://instagram.com/paywatch.nl",
                  label: "Instagram",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/50 transition-all duration-300 hover:border-white/30 hover:text-white hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
