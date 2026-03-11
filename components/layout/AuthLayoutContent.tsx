"use client";

import React from "react";

import Image from "next/image";

import { usePathname } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";

export default function AuthLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/sign-in";

  return (
    <div className="flex min-h-screen w-full bg-white relative overflow-hidden">
      <div className={`flex w-full h-full absolute inset-0 transition-all duration-500 ease-in-out ${isLoginPage ? 'flex-row' : 'flex-row-reverse'}`}>
        
         {/* Image Section - Animated */}
         <motion.div 
            layout
            className="hidden lg:flex lg:w-1/2 relative h-full items-center justify-center"
            style={{
              background: "var(--Gradient-1, linear-gradient(180deg, #EC4899 0%, #F472B6 50%, #FBCFE8 100%))"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
         >
            {/* Logo */}
            <div className="absolute top-12 left-12 z-20">
                 <Image
                  src="/auth-logo.svg"
                  alt="Binzo Logo"
                  width={139.32}
                  height={40}
                  className="object-contain" // Preserves aspect-ratio
                  priority
                />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isLoginPage ? "login-img" : "forgot-img"}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="relative"
                style={{ width: '403.472px', height: '340.79px' }}
              >
                 <Image
                  src={isLoginPage ? "/login-background.svg" : "/forgot-password-background.svg"}
                  alt="Background illustration"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Tagline */}
            <div className="absolute bottom-12 left-12 right-12 z-20 flex flex-col gap-2">
                <p style={{ 
                    color: 'var(--slate-950, #020618)',
                    fontSize: '16px',
                    fontWeight: 500,
                    lineHeight: '24px',
                    fontFamily: 'Inter, sans-serif'
                }}>
                    “Every successful student has a carefully crafted learning journey behind them.”
                </p>
               <div className="flex items-center gap-2">
                 {/* Dash/Line */}
                 <div className="h-[1px] w-3 bg-slate-700/50"></div>
                 <p style={{
                    color: 'var(--slate-700, #314158)',
                    fontSize: '12px',
                    fontWeight: 400,
                    lineHeight: '16px',
                     fontFamily: 'Inter, sans-serif',
                     fontFeatureSettings: '"subs" on'
                 }}>
                    FROM DEVELOPER TEAM
                </p>
               </div>
            </div>
         </motion.div>

        {/* Form Section - Animated */}
        <motion.div 
            layout
            className="flex w-full items-center justify-center lg:w-1/2 h-full bg-white relative"
             transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
             {/* Mobile/Tablet Navbar */}
             <div className="absolute top-0 w-full flex justify-center items-center py-6 lg:hidden z-10 bg-white border-b border-slate-200 shadow-[0_4px_12px_8px_rgba(0,0,0,0.05)]">
                <Image
                    src="/mobile-logo.svg"
                    alt="Binzo Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                />
             </div>

             <div className="w-full max-w-sm px-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
      </div>
    </div>
  );
}
