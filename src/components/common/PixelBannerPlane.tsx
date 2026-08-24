import React from 'react';
import { Link } from 'react-router-dom';

export const PixelBannerPlane: React.FC = () => {
  return (
    <div className="w-full max-w-full overflow-hidden flex justify-center items-center py-2 px-2 relative z-20 select-none">
      <Link
        to="/student"
        aria-label="Student Offer - ₹19 Only"
        className="inline-flex items-center animate-plane-hover cursor-pointer group transition-all max-w-full"
      >
        {/* ========================================================================= */}
        {/* 1. Realistic Sky Aerial Banner (Yellow Fabric Banner from Reference)       */}
        {/* ========================================================================= */}
        <div className="relative animate-banner-wave origin-right bg-[#FFC800] text-[#111111] px-4 sm:px-6 py-2 sm:py-2.5 rounded-sm shadow-md flex flex-col items-center justify-center text-center whitespace-nowrap group-hover:brightness-105 transition-all shrink">
          
          {/* Subtle Cloth Wave Gradient Highlights */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-white/15 to-black/10 pointer-events-none rounded-sm" />

          {/* Main Banner Heading */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs sm:text-sm">🎓</span>
            <span className="font-black text-xs sm:text-sm md:text-base tracking-wider uppercase text-[#111111] drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
              Student Offer
            </span>
          </div>

          {/* Centered Dark Badge (Matching "SMART OBJECT" box from user image) */}
          <div className="mt-1 flex items-center gap-1 bg-[#111111] text-[#FFC800] px-2.5 sm:px-3 py-0.5 rounded text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-xs group-hover:bg-black transition-colors">
            <span>₹19 ONLY</span>
            <span className="text-white/80 font-normal text-[9px] sm:text-[10px] hidden sm:inline">• CLAIM NOW →</span>
          </div>

          {/* Front Vertical Spreader Pole (White/Grey Lead Bar on front edge) */}
          <div className="absolute -right-1 top-0 bottom-0 w-1 bg-[#E2E8F0] border-r border-[#94A3B8] rounded-r-sm" />
        </div>

        {/* ========================================================================= */}
        {/* 2. V-Shaped Black Bridle Tow Rope (Directly from User Reference Image)    */}
        {/* ========================================================================= */}
        <div className="w-8 sm:w-12 h-10 sm:h-12 relative shrink-0 -ml-0.5">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 48 40" fill="none">
            {/* Top Bridle Line (from top of pole to tow hook) */}
            <line
              x1="0"
              y1="4"
              x2="32"
              y2="20"
              stroke="#111111"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Bottom Bridle Line (from bottom of pole to tow hook) */}
            <line
              x1="0"
              y1="36"
              x2="32"
              y2="20"
              stroke="#111111"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Main Towline Connecting to Plane Tail */}
            <line
              x1="32"
              y1="20"
              x2="48"
              y2="20"
              stroke="#111111"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Tow Hook Ring */}
            <circle cx="32" cy="20" r="2" fill="#111111" />
          </svg>
        </div>

        {/* ========================================================================= */}
        {/* 3. Pixel Art Airplane (In FRONT on the right, pulling the tow rope)       */}
        {/* ========================================================================= */}
        <div className="relative shrink-0 filter drop-shadow-sm group-hover:scale-105 transition-transform">
          <svg
            className="w-13 h-9 sm:w-16 sm:h-11 transform -rotate-1 overflow-visible"
            viewBox="0 0 72 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ imageRendering: 'pixelated' }}
          >
            {/* Tail Fin & Rudder (Where tow cable attaches at x=5, y=17.5) */}
            <path d="M12 7 L20 14 L14 14 L9 7 Z" fill="#FFC800" />
            <path d="M10 8 L18 14 L14 14 L8 8 Z" fill="#D99B00" />
            <rect x="6" y="16" width="12" height="3" rx="1.5" fill="#FFC800" />
            <circle cx="5" cy="17.5" r="1.5" fill="#111111" />
            {/* Animated Smoke Puffs */}
            <circle cx="1" cy="18" r="1.5" fill="#CBD5E1" className="animate-ping opacity-60" />
            <circle cx="-3" cy="19" r="1.2" fill="#E2E8F0" className="animate-pulse opacity-50" />

            {/* Main Fuselage (Yellow Theme) */}
            <rect x="18" y="13" width="38" height="10" rx="4" fill="#FFC800" />
            <rect x="19" y="12" width="35" height="3" fill="#FFE580" />
            <rect x="20" y="21" width="34" height="2" fill="#D99B00" />

            {/* Nose Cone */}
            <path d="M56 14 C59 15, 60 17, 60 18 C60 19, 59 21, 56 22 Z" fill="#D99B00" />

            {/* Cockpit / Windshield */}
            <path d="M38 10 L46 10 L48 14 L36 14 Z" fill="#111111" />
            <path d="M39 11 L45 11 L47 13 L38 13 Z" fill="#67E8F9" />
            <rect x="40" y="11" width="2" height="2" fill="#FFFFFF" />

            {/* Top Wing */}
            <rect x="28" y="4" width="22" height="4" rx="2" fill="#FFC800" />
            <rect x="29" y="4" width="20" height="1.5" fill="#FFE580" />
            <rect x="36" y="8" width="2" height="5" fill="#111111" />
            <rect x="44" y="8" width="2" height="5" fill="#111111" />

            {/* Bottom Wing & Landing Wheels */}
            <rect x="30" y="23" width="18" height="3" rx="1.5" fill="#D99B00" />
            <path d="M34 25 L32 29" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
            <path d="M42 25 L44 29" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
            <circle cx="31" cy="30" r="2.5" fill="#111111" />
            <circle cx="45" cy="30" r="2.5" fill="#111111" />

            {/* Fast-Spinning Propeller at Nose (Front Right) */}
            <ellipse
              cx="60.5"
              cy="18"
              rx="3"
              ry="13"
              fill="#FFC800"
              className="animate-prop-blur"
              opacity="0.4"
            />
            <ellipse
              cx="60.5"
              cy="18"
              rx="1.5"
              ry="11"
              fill="#FFFFFF"
              opacity="0.3"
            />

            <g
              style={{
                transformOrigin: '60px 18px',
                animation: 'propellerSideSpin 0.08s linear infinite',
              }}
            >
              <rect x="59.5" y="6" width="2" height="24" rx="1" fill="#111111" />
              <rect x="59.5" y="6" width="2" height="3.5" rx="0.5" fill="#FFC800" />
              <rect x="59.5" y="26.5" width="2" height="3.5" rx="0.5" fill="#FFC800" />
            </g>

            <circle cx="60" cy="18" r="3.5" fill="#111111" />
            <circle cx="60.5" cy="18" r="2" fill="#D99B00" />
            <circle cx="61.5" cy="17.5" r="0.8" fill="#FFFFFF" />
          </svg>
        </div>
      </Link>
    </div>
  );
};
