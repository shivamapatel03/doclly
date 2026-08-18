import React from 'react';

export const Word3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="w3d_base" x1="6" y1="4" x2="26" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
      <linearGradient id="w3d_fold" x1="20" y1="4" x2="28" y2="12" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#93C5FD" />
        <stop offset="100%" stopColor="#60A5FA" />
      </linearGradient>
      <linearGradient id="w3d_badge" x1="10" y1="14" x2="22" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E40AF" />
        <stop offset="100%" stopColor="#172554" />
      </linearGradient>
      </defs>
    <g>
      <path d="M7 6C7 4.89543 7.89543 4 9 4H21L29 12V30C29 31.1046 28.1046 32 27 32H9C7.89543 32 7 31.1046 7 30V6Z" fill="url(#w3d_base)" />
      <path d="M21 4V10C21 11.1046 21.8954 12 23 12H29L21 4Z" fill="url(#w3d_fold)" />
      <path d="M9 4.5H20.5L28.5 12.5V30C28.5 30.8284 27.8284 31.5 27 31.5H9C8.17157 31.5 7.5 30.8284 7.5 30V6C7.5 5.17157 8.17157 4.5 9 4.5Z" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
      <rect x="5" y="14" width="16" height="14" rx="3.5" fill="url(#w3d_badge)" />
      <rect x="5.5" y="14.5" width="15" height="13" rx="3" stroke="#60A5FA" strokeOpacity="0.4" />
      <path d="M8.5 18L10.2 24.5H11.8L13 20L14.2 24.5H15.8L17.5 18H16L14.9 22.3L13.7 18H12.3L11.1 22.3L10 18H8.5Z" fill="white" />
      <rect x="23" y="17" width="3.5" height="1.5" rx="0.75" fill="white" fillOpacity="0.7" />
      <rect x="23" y="21" width="3.5" height="1.5" rx="0.75" fill="white" fillOpacity="0.7" />
      <rect x="23" y="25" width="3.5" height="1.5" rx="0.75" fill="white" fillOpacity="0.7" />
    </g>
  </svg>
);

export const Excel3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="x3d_base" x1="6" y1="4" x2="26" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="x3d_fold" x1="20" y1="4" x2="28" y2="12" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#A7F3D0" />
        <stop offset="100%" stopColor="#34D399" />
      </linearGradient>
      <linearGradient id="x3d_badge" x1="10" y1="14" x2="22" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#065F46" />
        <stop offset="100%" stopColor="#022C22" />
      </linearGradient>
      </defs>
    <g>
      <path d="M7 6C7 4.89543 7.89543 4 9 4H21L29 12V30C29 31.1046 28.1046 32 27 32H9C7.89543 32 7 31.1046 7 30V6Z" fill="url(#x3d_base)" />
      <path d="M21 4V10C21 11.1046 21.8954 12 23 12H29L21 4Z" fill="url(#x3d_fold)" />
      <path d="M9 4.5H20.5L28.5 12.5V30C28.5 30.8284 27.8284 31.5 27 31.5H9C8.17157 31.5 7.5 30.8284 7.5 30V6C7.5 5.17157 8.17157 4.5 9 4.5Z" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
      <rect x="23" y="16" width="3.5" height="2" rx="0.5" fill="white" fillOpacity="0.7" />
      <rect x="23" y="20" width="3.5" height="2" rx="0.5" fill="white" fillOpacity="0.7" />
      <rect x="23" y="24" width="3.5" height="2" rx="0.5" fill="white" fillOpacity="0.7" />
      <rect x="5" y="14" width="16" height="14" rx="3.5" fill="url(#x3d_badge)" />
      <rect x="5.5" y="14.5" width="15" height="13" rx="3" stroke="#34D399" strokeOpacity="0.4" />
      <path d="M9 18H10.8L13 21L15.2 18H17L14.1 21.8L17.2 26H15.4L13 22.7L10.6 26H8.8L11.9 21.8L9 18Z" fill="white" />
    </g>
  </svg>
);

export const Ppt3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="p3d_base" x1="6" y1="4" x2="26" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FB923C" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
      <linearGradient id="p3d_fold" x1="20" y1="4" x2="28" y2="12" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FED7AA" />
        <stop offset="100%" stopColor="#FDBA74" />
      </linearGradient>
      <linearGradient id="p3d_badge" x1="10" y1="14" x2="22" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#C2410C" />
        <stop offset="100%" stopColor="#7C2D12" />
      </linearGradient>
      </defs>
    <g>
      <path d="M7 6C7 4.89543 7.89543 4 9 4H21L29 12V30C29 31.1046 28.1046 32 27 32H9C7.89543 32 7 31.1046 7 30V6Z" fill="url(#p3d_base)" />
      <path d="M21 4V10C21 11.1046 21.8954 12 23 12H29L21 4Z" fill="url(#p3d_fold)" />
      <path d="M9 4.5H20.5L28.5 12.5V30C28.5 30.8284 27.8284 31.5 27 31.5H9C8.17157 31.5 7.5 30.8284 7.5 30V6C7.5 5.17157 8.17157 4.5 9 4.5Z" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
      <circle cx="25" cy="21" r="2" fill="white" fillOpacity="0.75" />
      <rect x="5" y="14" width="16" height="14" rx="3.5" fill="url(#p3d_badge)" />
      <rect x="5.5" y="14.5" width="15" height="13" rx="3" stroke="#FDBA74" strokeOpacity="0.4" />
      <path d="M9.5 18H13.2C14.8 18 15.8 18.8 15.8 20.3C15.8 21.8 14.8 22.6 13.2 22.6H11.2V26H9.5V18ZM11.2 21.2H13C13.8 21.2 14.2 20.8 14.2 20.3C14.2 19.8 13.8 19.4 13 19.4H11.2V21.2Z" fill="white" />
    </g>
  </svg>
);

export const Image3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="img3d_base" x1="5" y1="5" x2="31" y2="31" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="img3d_sky" x1="7" y1="7" x2="29" y2="29" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF3C7" />
        <stop offset="100%" stopColor="#FDE68A" />
      </linearGradient>
      <linearGradient id="img3d_mnt1" x1="14" y1="18" x2="25" y2="29" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
      <linearGradient id="img3d_mnt2" x1="7" y1="21" x2="19" y2="29" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
      </defs>
    <g>
      <rect x="5" y="5" width="26" height="26" rx="6" fill="url(#img3d_base)" />
      <rect x="5.5" y="5.5" width="25" height="25" rx="5.5" stroke="white" strokeOpacity="0.3" />
      <rect x="7" y="7" width="22" height="22" rx="4.5" fill="url(#img3d_sky)" />
      <circle cx="13" cy="13" r="3" fill="#F59E0B" />
      <circle cx="13" cy="13" r="3" stroke="#FDE68A" strokeWidth="0.8" />
      <path d="M15 17L27 29H13L15 17Z" fill="url(#img3d_mnt1)" />
      <path d="M9 20L19 29H7L9 20Z" fill="url(#img3d_mnt2)" />
    </g>
  </svg>
);

export const Text3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="txt3d_base" x1="6" y1="4" x2="26" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#4338CA" />
      </linearGradient>
      <linearGradient id="txt3d_fold" x1="20" y1="4" x2="28" y2="12" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#C7D2FE" />
        <stop offset="100%" stopColor="#818CF8" />
      </linearGradient>
      </defs>
    <g>
      <path d="M7 6C7 4.89543 7.89543 4 9 4H21L29 12V30C29 31.1046 28.1046 32 27 32H9C7.89543 32 7 31.1046 7 30V6Z" fill="url(#txt3d_base)" />
      <path d="M21 4V10C21 11.1046 21.8954 12 23 12H29L21 4Z" fill="url(#txt3d_fold)" />
      <path d="M9 4.5H20.5L28.5 12.5V30C28.5 30.8284 27.8284 31.5 27 31.5H9C8.17157 31.5 7.5 30.8284 7.5 30V6C7.5 5.17157 8.17157 4.5 9 4.5Z" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
      <rect x="11" y="16" width="10" height="2" rx="1" fill="white" />
      <rect x="11" y="20" width="14" height="2" rx="1" fill="white" fillOpacity="0.8" />
      <rect x="11" y="24" width="8" height="2" rx="1" fill="#C7D2FE" />
    </g>
  </svg>
);

export const Html3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="h3d_base" x1="5" y1="5" x2="31" y2="31" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#0E7490" />
      </linearGradient>
      </defs>
    <g>
      <rect x="5" y="6" width="26" height="24" rx="5" fill="url(#h3d_base)" />
      <rect x="5.5" y="6.5" width="25" height="23" rx="4.5" stroke="white" strokeOpacity="0.3" />
      <circle cx="9.5" cy="10.5" r="1" fill="white" fillOpacity="0.8" />
      <circle cx="13" cy="10.5" r="1" fill="white" fillOpacity="0.8" />
      <circle cx="16.5" cy="10.5" r="1" fill="white" fillOpacity="0.8" />
      <path d="M12.5 17L9.5 20L12.5 23" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M23.5 17L26.5 20L23.5 23" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.5 16L16.5 24" stroke="#A5F3FC" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  </svg>
);

export const Merge3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="mrg3d_1" x1="5" y1="5" x2="22" y2="25" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F43F5E" />
        <stop offset="100%" stopColor="#BE123C" />
      </linearGradient>
      <linearGradient id="mrg3d_2" x1="12" y1="10" x2="30" y2="31" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FB7185" />
        <stop offset="100%" stopColor="#E11D48" />
      </linearGradient>
      </defs>
    <g>
      <rect x="6" y="5" width="17" height="21" rx="3.5" fill="url(#mrg3d_1)" />
      <rect x="13" y="10" width="17" height="21" rx="3.5" fill="url(#mrg3d_2)" />
      <rect x="13.5" y="10.5" width="16" height="20" rx="3" stroke="white" strokeOpacity="0.3" />
      <circle cx="21.5" cy="20.5" r="5" fill="#881337" fillOpacity="0.4" />
      <path d="M21.5 17.5V23.5M18.5 20.5H24.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

export const Split3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="splt3d_card" x1="5" y1="5" x2="31" y2="31" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#7E22CE" />
      </linearGradient>
      <linearGradient id="splt3d_split" x1="14" y1="8" x2="22" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F3E8FF" />
      </linearGradient>
      </defs>
    <g>
      {/* 3D Purple Card Base */}
      <rect x="6" y="5" width="24" height="26" rx="5" fill="url(#splt3d_card)" />
      <rect x="6.5" y="5.5" width="23" height="25" rx="4.5" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
      
      {/* Center Dashed Separation Line */}
      <line x1="18" y1="8" x2="18" y2="28" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="2 2" />
      
      {/* Left Sheet Segment */}
      <rect x="9" y="9" width="6.5" height="18" rx="2" fill="url(#splt3d_split)" />
      {/* Right Sheet Segment */}
      <rect x="20.5" y="9" width="6.5" height="18" rx="2" fill="url(#splt3d_split)" />
      
      {/* Scissor / Cut Icon in center */}
      <circle cx="15.5" cy="18" r="2" fill="#7E22CE" />
      <circle cx="20.5" cy="18" r="2" fill="#7E22CE" />
      <path d="M16 16.5L20 19.5M20 16.5L16 19.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  </svg>
);

export const RemovePages3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="rm3d_base" x1="6" y1="4" x2="28" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#B91C1C" />
      </linearGradient>
      </defs>
    <g>
      <rect x="7" y="5" width="22" height="26" rx="4" fill="url(#rm3d_base)" />
      <rect x="7.5" y="5.5" width="21" height="25" rx="3.5" stroke="white" strokeOpacity="0.3" />
      <circle cx="18" cy="18" r="6" fill="#7F1D1D" fillOpacity="0.45" />
      <path d="M15 15L21 21M21 15L15 21" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

export const ExtractPages3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="ext3d_back" x1="8" y1="12" x2="28" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
      <linearGradient id="ext3d_front" x1="8" y1="4" x2="28" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
      </defs>
    <g>
      <rect x="11" y="11" width="18" height="20" rx="3.5" fill="url(#ext3d_back)" opacity="0.6" />
      <rect x="7" y="5" width="18" height="20" rx="3.5" fill="url(#ext3d_front)" />
      <rect x="7.5" y="5.5" width="17" height="19" rx="3" stroke="white" strokeOpacity="0.3" />
      <path d="M16 17V10M16 10L13 13M16 10L19 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const Organize3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="org3d_base" x1="5" y1="5" x2="31" y2="31" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#6D28D9" />
      </linearGradient>
      </defs>
    <g>
      <rect x="6" y="6" width="10.5" height="10.5" rx="2.5" fill="url(#org3d_base)" />
      <rect x="19.5" y="6" width="10.5" height="10.5" rx="2.5" fill="url(#org3d_base)" opacity="0.75" />
      <rect x="6" y="19.5" width="10.5" height="10.5" rx="2.5" fill="url(#org3d_base)" opacity="0.75" />
      <rect x="19.5" y="19.5" width="10.5" height="10.5" rx="2.5" fill="url(#org3d_base)" />
      <rect x="6.5" y="6.5" width="9.5" height="9.5" rx="2" stroke="white" strokeOpacity="0.3" />
      <rect x="20" y="20" width="9.5" height="9.5" rx="2" stroke="white" strokeOpacity="0.3" />
    </g>
  </svg>
);

export const Sign3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="sgn3d_base" x1="6" y1="4" x2="26" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="sgn3d_pen" x1="14" y1="8" x2="29" y2="23" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      </defs>
    <g>
      <rect x="6" y="5" width="20" height="26" rx="4" fill="url(#sgn3d_base)" />
      <rect x="6.5" y="5.5" width="19" height="25" rx="3.5" stroke="white" strokeOpacity="0.3" />
      <path d="M10 24C12 21 14 25 16 23C18 21 19 24 21 24" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M26 6L29 9L19 19L16 20L17 17L26 6Z" fill="url(#sgn3d_pen)" />
      <circle cx="28" cy="8" r="1.5" fill="#FCD34D" />
      <path d="M16 20L18 18" stroke="#FCD34D" strokeWidth="1" />
    </g>
  </svg>
);

export const Watermark3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="wtm3d_base" x1="6" y1="4" x2="28" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#0891B2" />
      </linearGradient>
      </defs>
    <g>
      <rect x="7" y="5" width="22" height="26" rx="4" fill="url(#wtm3d_base)" />
      <rect x="7.5" y="5.5" width="21" height="25" rx="3.5" stroke="white" strokeOpacity="0.3" />
      <circle cx="18" cy="18" r="6.5" stroke="white" strokeWidth="1.5" strokeDasharray="2 2" />
      <circle cx="18" cy="18" r="4" fill="white" fillOpacity="0.3" />
      <path d="M15 18H21" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  </svg>
);

export const Protect3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="prt3d_base" x1="6" y1="4" x2="30" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FB7185" />
        <stop offset="50%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#9F1239" />
      </linearGradient>
      <linearGradient id="prt3d_gold" x1="10" y1="14" x2="26" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="prt3d_shackle" x1="12" y1="7" x2="24" y2="17" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#94A3B8" />
      </linearGradient>
    </defs>
    <g>
      {/* 3D Ruby Card Plate */}
      <rect x="5" y="5" width="26" height="26" rx="6" fill="url(#prt3d_base)" />
      <rect x="5.5" y="5.5" width="25" height="25" rx="5.5" stroke="white" strokeOpacity="0.35" strokeWidth="1" />
      
      {/* Heavy Steel Closed Shackle */}
      <path
        d="M13 16V12C13 9.23858 15.2386 7 18 7C20.7614 7 23 9.23858 23 12V16"
        stroke="url(#prt3d_shackle)"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      
      {/* 3D Solid Gold Padlock Body */}
      <rect x="10" y="15" width="16" height="12" rx="3" fill="url(#prt3d_gold)" />
      <rect x="10.5" y="15.5" width="15" height="11" rx="2.5" stroke="#FEF08A" strokeOpacity="0.6" strokeWidth="0.8" />
      
      {/* Keyhole & Cyan Status Dot */}
      <circle cx="18" cy="20" r="1.5" fill="#713F12" />
      <path d="M18 21.5V23.5" stroke="#713F12" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="23" cy="18" r="1" fill="#38BDF8" />
    </g>
  </svg>
);

export const Unlock3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="unl3d_base" x1="6" y1="4" x2="30" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="50%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="unl3d_gold" x1="8" y1="14" x2="24" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      <linearGradient id="unl3d_shackle" x1="10" y1="5" x2="26" y2="15" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#94A3B8" />
      </linearGradient>
      <linearGradient id="unl3d_key" x1="20" y1="16" x2="30" y2="26" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#FEF08A" />
      </linearGradient>
    </defs>
    <g>
      {/* 3D Vibrant Emerald Card Plate */}
      <rect x="5" y="5" width="26" height="26" rx="6" fill="url(#unl3d_base)" />
      <rect x="5.5" y="5.5" width="25" height="25" rx="5.5" stroke="white" strokeOpacity="0.35" strokeWidth="1" />
      
      {/* Swung-Open & Lifted Shackle */}
      <path
        d="M12 15V10C12 7.23858 14.2386 5 17 5C19.7614 5 22 7.23858 22 10V11"
        stroke="url(#unl3d_shackle)"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      
      {/* 3D Padlock Body Shifted Left */}
      <rect x="9" y="15" width="14" height="12" rx="3" fill="url(#unl3d_gold)" />
      <rect x="9.5" y="15.5" width="13" height="11" rx="2.5" stroke="#FEF08A" strokeOpacity="0.6" strokeWidth="0.8" />
      
      {/* Keyhole */}
      <circle cx="16" cy="20" r="1.3" fill="#713F12" />
      <path d="M16 21.3V23" stroke="#713F12" strokeWidth="1.1" strokeLinecap="round" />
      
      {/* 3D Floating Unlock Key */}
      <circle cx="26" cy="18" r="2.2" stroke="url(#unl3d_key)" strokeWidth="1.2" fill="none" />
      <path d="M26 20.2V26M26 23.5H28M26 25.5H27.5" stroke="url(#unl3d_key)" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  </svg>
);

export const Flatten3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="flt3d_base" x1="6" y1="4" x2="28" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      </defs>
    <g>
      <rect x="6" y="8" width="24" height="5" rx="2" fill="#FDE68A" />
      <rect x="6" y="15" width="24" height="5" rx="2" fill="#F59E0B" />
      <rect x="6" y="22" width="24" height="7" rx="2.5" fill="url(#flt3d_base)" />
      <rect x="6.5" y="22.5" width="23" height="6" rx="2" stroke="white" strokeOpacity="0.3" />
    </g>
  </svg>
);

export const Compare3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="cmp3d_1" x1="5" y1="5" x2="19" y2="27" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#64748B" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
      <linearGradient id="cmp3d_2" x1="17" y1="5" x2="31" y2="27" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
      </defs>
    <g>
      <rect x="5" y="6" width="13" height="24" rx="3" fill="url(#cmp3d_1)" />
      <rect x="18" y="6" width="13" height="24" rx="3" fill="url(#cmp3d_2)" />
      <rect x="18.5" y="6.5" width="12" height="23" rx="2.5" stroke="white" strokeOpacity="0.3" />
      <rect x="8" y="11" width="7" height="1.8" rx="0.9" fill="#94A3B8" />
      <rect x="8" y="15" width="7" height="1.8" rx="0.9" fill="#F87171" />
      <rect x="21" y="11" width="7" height="1.8" rx="0.9" fill="white" />
      <rect x="21" y="15" width="7" height="1.8" rx="0.9" fill="#4ADE80" />
    </g>
  </svg>
);

export const Compress3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="cps3d_base" x1="6" y1="4" x2="28" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#14B8A6" />
        <stop offset="100%" stopColor="#0F766E" />
      </linearGradient>
      </defs>
    <g>
      <rect x="7" y="5" width="22" height="26" rx="4" fill="url(#cps3d_base)" />
      <rect x="7.5" y="5.5" width="21" height="25" rx="3.5" stroke="white" strokeOpacity="0.3" />
      <path d="M12 18H16M16 18L14 16M16 18L14 20" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 18H20M20 18L22 16M20 18L22 20" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="18" cy="18" r="1.5" fill="#5EEAD4" />
    </g>
  </svg>
);

export const Pdf3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="pdf3d_base" x1="6" y1="4" x2="26" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#B91C1C" />
      </linearGradient>
      <linearGradient id="pdf3d_fold" x1="20" y1="4" x2="28" y2="12" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FCA5A5" />
        <stop offset="100%" stopColor="#F87171" />
      </linearGradient>
      <linearGradient id="pdf3d_badge" x1="10" y1="14" x2="22" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#991B1B" />
        <stop offset="100%" stopColor="#7F1D1D" />
      </linearGradient>
      </defs>
    <g>
      <path d="M7 6C7 4.89543 7.89543 4 9 4H21L29 12V30C29 31.1046 28.1046 32 27 32H9C7.89543 32 7 31.1046 7 30V6Z" fill="url(#pdf3d_base)" />
      <path d="M21 4V10C21 11.1046 21.8954 12 23 12H29L21 4Z" fill="url(#pdf3d_fold)" />
      <path d="M9 4.5H20.5L28.5 12.5V30C28.5 30.8284 27.8284 31.5 27 31.5H9C8.17157 31.5 7.5 30.8284 7.5 30V6C7.5 5.17157 8.17157 4.5 9 4.5Z" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
      <rect x="5" y="14" width="16" height="14" rx="3.5" fill="url(#pdf3d_badge)" />
      <rect x="5.5" y="14.5" width="15" height="13" rx="3" stroke="#F87171" strokeOpacity="0.4" />
      <path d="M8 18H10.5C11.5 18 12.2 18.6 12.2 19.6C12.2 20.6 11.5 21.2 10.5 21.2H9.2V24H8V18ZM9.2 20.2H10.4C10.9 20.2 11.1 19.9 11.1 19.6C11.1 19.3 10.9 19 10.4 19H9.2V20.2Z" fill="white" />
      <path d="M13 18H15C16.8 18 17.8 19.2 17.8 21C17.8 22.8 16.8 24 15 24H13V18ZM14.2 22.9H14.9C16 22.9 16.6 22.1 16.6 21C16.6 19.9 16 19.1 14.9 19.1H14.2V22.9Z" fill="white" />
    </g>
  </svg>
);

export const Upload3DIcon: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="up3d_folder" x1="6" y1="12" x2="42" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFD84D" />
        <stop offset="100%" stopColor="#E6B400" />
      </linearGradient>
      <linearGradient id="up3d_arrow" x1="24" y1="14" x2="24" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F5F5F5" />
      </linearGradient>
      </defs>
    <g>
      <path d="M6 14C6 11.7909 7.79086 10 10 10H19.5L24 14H38C40.2091 14 42 15.7909 42 18V38C42 40.2091 40.2091 42 38 42H10C7.79086 42 6 40.2091 6 38V14Z" fill="url(#up3d_folder)" />
      <path d="M6 16H42V38C42 40.2091 40.2091 42 38 42H10C7.79086 42 6 40.2091 6 38V16Z" fill="#FFC800" />
      <rect x="6.5" y="14.5" width="35" height="27" rx="3.5" stroke="white" strokeOpacity="0.35" />
      <circle cx="24" cy="27" r="8.5" fill="#111111" />
      <path d="M24 21L20 25.5H22.5V31.5H25.5V25.5H28L24 21Z" fill="url(#up3d_arrow)" />
    </g>
  </svg>
);

export const Flash3DIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="fl3d_grad" x1="12" y1="4" x2="28" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      </defs>
    <g>
      <path d="M22 4L10 20H19L16 36L30 18H21L24 4H22Z" fill="url(#fl3d_grad)" />
      <path d="M21 6L12 19H19L17 32L27 19H21L23 6H21Z" fill="white" fillOpacity="0.35" />
    </g>
  </svg>
);

export const Shield3DIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="sh3d_grad" x1="8" y1="4" x2="32" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      </defs>
    <g>
      <path d="M20 4L32 9V19C32 27 26.5 33.5 20 36C13.5 33.5 8 27 8 19V9L20 4Z" fill="url(#sh3d_grad)" />
      <path d="M20 6.5L29.5 10.5V18.5C29.5 25 25 30.5 20 32.5V6.5Z" fill="white" fillOpacity="0.2" />
      <path d="M15 19L18.5 22.5L25 15.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const Mouse3DIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="mo3d_grad" x1="12" y1="6" x2="28" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>
      </defs>
    <g>
      <rect x="11" y="6" width="18" height="28" rx="9" fill="url(#mo3d_grad)" stroke="white" strokeWidth="1.2" />
      <rect x="18.5" y="10" width="3" height="6" rx="1.5" fill="white" />
    </g>
  </svg>
);

export const Cycle3DIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="cy3d_grad" x1="8" y1="8" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#7E22CE" />
      </linearGradient>
      </defs>
    <g>
      <circle cx="20" cy="20" r="14" fill="url(#cy3d_grad)" />
      <circle cx="20" cy="20" r="13" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
      <path d="M20 12C15.6 12 12 15.6 12 20H10L13.5 24L17 20H15C15 17.2 17.2 15 20 15C22.8 15 25 17.2 25 20C25 22.8 22.8 25 20 25C18.6 25 17.3 24.4 16.5 23.5L14.4 25.6C15.8 27.1 17.8 28 20 28C24.4 28 28 24.4 28 20C28 15.6 24.4 12 20 12Z" fill="white" />
    </g>
  </svg>
);

export const Chart3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="ch3d_card" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="ch3d_bar1" x1="8" y1="18" x2="13" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
      <linearGradient id="ch3d_bar2" x1="15.5" y1="12" x2="20.5" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <linearGradient id="ch3d_bar3" x1="23" y1="7" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      </defs>
    <g>
      <rect x="4" y="4" width="28" height="28" rx="6" fill="url(#ch3d_card)" />
      <rect x="4.5" y="4.5" width="27" height="27" rx="5.5" stroke="white" strokeOpacity="0.18" strokeWidth="1" />
      <line x1="8" y1="14" x2="28" y2="14" stroke="white" strokeOpacity="0.08" strokeDasharray="2 2" />
      <line x1="8" y1="21" x2="28" y2="21" stroke="white" strokeOpacity="0.08" strokeDasharray="2 2" />
      <rect x="8" y="18" width="5" height="10" rx="1.8" fill="url(#ch3d_bar1)" />
      <rect x="8.5" y="18.5" width="4" height="2" rx="1" fill="#BAE6FD" fillOpacity="0.8" />
      <rect x="15.5" y="12" width="5" height="16" rx="1.8" fill="url(#ch3d_bar2)" />
      <rect x="16" y="12.5" width="4" height="2" rx="1" fill="#FEF3C7" fillOpacity="0.9" />
      <rect x="23" y="7" width="5" height="21" rx="1.8" fill="url(#ch3d_bar3)" />
      <rect x="23.5" y="7.5" width="4" height="2" rx="1" fill="#A7F3D0" fillOpacity="0.9" />
      <path d="M10.5 16L18 10L25.5 5" stroke="#FDE68A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="25.5" cy="5" r="1.8" fill="#FFC800" stroke="white" strokeWidth="1" />
    </g>
  </svg>
);

export const Folder3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="fld3d_back" x1="4" y1="7" x2="30" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="fld3d_front" x1="4" y1="13" x2="32" y2="31" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFD84D" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <linearGradient id="fld3d_sheet1" x1="10" y1="5" x2="26" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F1F5F9" />
      </linearGradient>
      <linearGradient id="fld3d_sheet2" x1="13" y1="8" x2="29" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E0F2FE" />
        <stop offset="100%" stopColor="#BAE6FD" />
      </linearGradient>
      </defs>
    <g>
      <path d="M4 10C4 8.34315 5.34315 7 7 7H13.5L16.5 10H29C30.6569 10 32 11.3431 32 13V26C32 27.6569 30.6569 29 29 29H7C5.34315 29 4 27.6569 4 26V10Z" fill="url(#fld3d_back)" />
      <rect x="9" y="6" width="15" height="15" rx="2" fill="url(#fld3d_sheet1)" stroke="#CBD5E1" strokeWidth="0.8" />
      <line x1="12" y1="9.5" x2="19" y2="9.5" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="12" y1="12.5" x2="21" y2="12.5" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="13" y="9" width="15" height="14" rx="2" fill="url(#fld3d_sheet2)" stroke="#7DD3FC" strokeWidth="0.8" />
      <line x1="16" y1="12.5" x2="23" y2="12.5" stroke="#0284C7" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M4 15C4 13.8954 4.89543 13 6 13H30C31.1046 13 32 13.8954 32 15V27C32 28.6569 30.6569 30 29 30H7C5.34315 30 4 28.6569 4 27V15Z" fill="url(#fld3d_front)" />
      <path d="M4.5 13.5H31.5V27C31.5 28.3807 30.3807 29.5 29 29.5H7C5.61929 29.5 4.5 28.3807 4.5 27V13.5Z" stroke="white" strokeOpacity="0.45" strokeWidth="1" />
      <rect x="12" y="19" width="12" height="5" rx="1.5" fill="white" fillOpacity="0.85" />
      <circle cx="15" cy="21.5" r="1" fill="#D97706" />
      <line x1="17.5" y1="21.5" x2="22" y2="21.5" stroke="#D97706" strokeWidth="1" strokeLinecap="round" />
    </g>
  </svg>
);

export const CreditCard3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="cc3d_card" x1="4" y1="7" x2="32" y2="29" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="60%" stopColor="#0F172A" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
      <linearGradient id="cc3d_chip" x1="8" y1="13" x2="14" y2="19" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="cc3d_ribbon" x1="4" y1="11" x2="32" y2="15" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFC800" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#E11D48" stopOpacity="0.6" />
      </linearGradient>
      </defs>
    <g>
      <rect x="4" y="8" width="28" height="20" rx="4" fill="url(#cc3d_card)" />
      <rect x="4.5" y="8.5" width="27" height="19" rx="3.5" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
      <path d="M4 12H32V15H4V12Z" fill="url(#cc3d_ribbon)" />
      <rect x="8" y="17" width="6" height="5" rx="1.2" fill="url(#cc3d_chip)" stroke="#FEF08A" strokeWidth="0.5" />
      <line x1="8" y1="19.5" x2="14" y2="19.5" stroke="#92400E" strokeWidth="0.5" />
      <line x1="11" y1="17" x2="11" y2="22" stroke="#92400E" strokeWidth="0.5" />
      <path d="M16 18C17 18.7 17 20.3 16 21" stroke="#38BDF8" strokeWidth="1" strokeLinecap="round" />
      <path d="M18 16.8C19.5 18 19.5 22 18 23.2" stroke="#38BDF8" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
      <rect x="8" y="24" width="12" height="1.8" rx="0.9" fill="white" fillOpacity="0.75" />
      <circle cx="25" cy="22" r="3" fill="#EF4444" fillOpacity="0.85" />
      <circle cx="28" cy="22" r="3" fill="#FBBF24" fillOpacity="0.85" />
    </g>
  </svg>
);

export const User3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="usr3d_bg" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#4338CA" />
      </linearGradient>
      <linearGradient id="usr3d_head" x1="14" y1="8" x2="22" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E2E8F0" />
      </linearGradient>
      <linearGradient id="usr3d_body" x1="8" y1="19" x2="28" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#EEF2FF" />
        <stop offset="100%" stopColor="#C7D2FE" />
      </linearGradient>
      </defs>
    <g>
      <circle cx="18" cy="18" r="14" fill="url(#usr3d_bg)" />
      <circle cx="18" cy="18" r="13.5" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
      <path d="M7 14C9 8 27 8 29 14" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.4" />
      <circle cx="18" cy="13.5" r="4.5" fill="url(#usr3d_head)" />
      <circle cx="18" cy="13.5" r="4" stroke="white" strokeWidth="0.8" strokeOpacity="0.6" />
      <path d="M10 27C10 22.5 13.5 20 18 20C22.5 20 26 22.5 26 27C26 28 25 29 23.5 29H12.5C11 29 10 28 10 27Z" fill="url(#usr3d_body)" />
      <circle cx="27" cy="10" r="3.2" fill="#10B981" stroke="white" strokeWidth="1.2" />
    </g>
  </svg>
);

export const Clock3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="clk3d_rim" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="clk3d_face" x1="8" y1="8" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F1F5F9" />
      </linearGradient>
      </defs>
    <g>
      <rect x="16" y="2" width="4" height="3" rx="1" fill="#047857" />
      <rect x="15" y="1.5" width="6" height="1.5" rx="0.75" fill="#34D399" />
      <circle cx="18" cy="19" r="13" fill="url(#clk3d_rim)" />
      <circle cx="18" cy="19" r="12.5" stroke="white" strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="18" cy="19" r="9.5" fill="url(#clk3d_face)" stroke="#CBD5E1" strokeWidth="0.8" />
      <circle cx="18" cy="11.5" r="0.8" fill="#64748B" />
      <circle cx="25.5" cy="19" r="0.8" fill="#64748B" />
      <circle cx="18" cy="26.5" r="0.8" fill="#64748B" />
      <circle cx="10.5" cy="19" r="0.8" fill="#64748B" />
      <line x1="18" y1="19" x2="14" y2="14" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="19" x2="23" y2="13" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="18" cy="19" r="1.8" fill="#0F172A" />
      <circle cx="18" cy="19" r="0.8" fill="#FFC800" />
    </g>
  </svg>
);

export const Storage3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="stg3d_base" x1="6" y1="5" x2="30" y2="31" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
      <linearGradient id="stg3d_bay" x1="7" y1="10" x2="29" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      </defs>
    <g>
      <rect x="6" y="5" width="24" height="26" rx="5" fill="url(#stg3d_base)" />
      <rect x="6.5" y="5.5" width="23" height="25" rx="4.5" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
      <rect x="9" y="8" width="18" height="6" rx="2" fill="url(#stg3d_bay)" />
      <line x1="12" y1="11" x2="19" y2="11" stroke="#64748B" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="23" cy="11" r="1" fill="#34D399" />
      <circle cx="25" cy="11" r="1" fill="#38BDF8" />
      <rect x="9" y="15" width="18" height="6" rx="2" fill="url(#stg3d_bay)" />
      <line x1="12" y1="18" x2="19" y2="18" stroke="#64748B" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="23" cy="18" r="1" fill="#34D399" />
      <circle cx="25" cy="18" r="1" fill="#FBBF24" />
      <rect x="9" y="22" width="18" height="6" rx="2" fill="url(#stg3d_bay)" />
      <line x1="12" y1="25" x2="19" y2="25" stroke="#64748B" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="23" cy="25" r="1" fill="#34D399" />
      <circle cx="25" cy="25" r="1" fill="#34D399" />
    </g>
  </svg>
);

export const Crown3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="crw3d_base" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="crw3d_gold" x1="8" y1="10" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <g>
      {/* 3D Dark Titanium Squircle Container */}
      <rect x="4" y="4" width="28" height="28" rx="7" fill="url(#crw3d_base)" />
      <rect x="4.5" y="4.5" width="27" height="27" rx="6.5" stroke="#FFC800" strokeOpacity="0.4" strokeWidth="1" />
      
      {/* 3D Geometric Gold Crown */}
      <path
        d="M9 24L10.5 14L15 19L18 11L21 19L25.5 14L27 24H9Z"
        fill="url(#crw3d_gold)"
      />
      {/* Crown Base Gem Bar */}
      <rect x="9" y="23" width="18" height="2.5" rx="1.25" fill="#B45309" />
      <circle cx="18" cy="11" r="1.5" fill="#FEF08A" />
      <circle cx="10.5" cy="14" r="1.2" fill="#FEF08A" />
      <circle cx="25.5" cy="14" r="1.2" fill="#FEF08A" />
      <circle cx="14" cy="24.2" r="0.75" fill="#38BDF8" />
      <circle cx="18" cy="24.2" r="0.75" fill="#EF4444" />
      <circle cx="22" cy="24.2" r="0.75" fill="#38BDF8" />
    </g>
  </svg>
);

export const Diamond3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="dmd3d_base" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0F172A" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
      <linearGradient id="dmd3d_gem" x1="8" y1="8" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#BAE6FD" />
        <stop offset="50%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    </defs>
    <g>
      <rect x="4" y="4" width="28" height="28" rx="7" fill="url(#dmd3d_base)" />
      <rect x="4.5" y="4.5" width="27" height="27" rx="6.5" stroke="#38BDF8" strokeOpacity="0.4" strokeWidth="1" />
      <path d="M12 12H24L28 17L18 27L8 17L12 12Z" fill="url(#dmd3d_gem)" />
      <path d="M8 17H28M12 12L15 17L18 27L21 17L24 12M15 17L18 12L21 17" stroke="white" strokeWidth="0.8" strokeOpacity="0.6" />
    </g>
  </svg>
);

export const Receipt3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="rcp3d_paper" x1="7" y1="4" x2="29" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F1F5F9" />
      </linearGradient>
      </defs>
    <g>
      <path d="M8 5L10 4L12 5L14 4L16 5L18 4L20 5L22 4L24 5L26 4L28 5V30L26 31L24 30L22 31L20 30L18 31L16 30L14 31L12 30L10 31L8 30V5Z" fill="url(#rcp3d_paper)" stroke="#CBD5E1" strokeWidth="1" />
      <rect x="11" y="8" width="14" height="2.5" rx="1.25" fill="#1E293B" />
      <line x1="11" y1="13.5" x2="20" y2="13.5" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="23" y1="13.5" x2="25" y2="13.5" stroke="#64748B" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="11" y1="17" x2="18" y2="17" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="22" y1="17" x2="25" y2="17" stroke="#64748B" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="11" y1="20.5" x2="25" y2="20.5" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="1.5 1.5" />
      <rect x="11" y="23" width="8" height="2" rx="1" fill="#10B981" />
      <rect x="21" y="23" width="4" height="2" rx="1" fill="#10B981" />
      <circle cx="24" cy="22" r="5" fill="#10B981" />
      <path d="M22 22L23.5 23.5L26 21" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const Star3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="str3d_gold" x1="6" y1="4" x2="30" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      </defs>
    <g>
      <polygon points="18,4 22.3,13 32,14.4 25,21.2 26.7,31 18,26.3 9.3,31 11,21.2 4,14.4 13.7,13" fill="url(#str3d_gold)" />
      <polygon points="18,4 18,26.3 13.7,13" fill="white" fillOpacity="0.4" />
      <polygon points="18,4 22.3,13 18,26.3" fill="white" fillOpacity="0.2" />
      <polygon points="32,14.4 25,21.2 18,26.3" fill="#78350F" fillOpacity="0.2" />
      <polygon points="9.3,31 11,21.2 18,26.3" fill="#78350F" fillOpacity="0.15" />
      <polygon points="18,4 22.3,13 32,14.4 25,21.2 26.7,31 18,26.3 9.3,31 11,21.2 4,14.4 13.7,13" stroke="white" strokeOpacity="0.35" strokeWidth="0.8" />
    </g>
  </svg>
);

export const Trash3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="trh3d_body" x1="8" y1="12" x2="28" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#B91C1C" />
      </linearGradient>
      <linearGradient id="trh3d_lid" x1="6" y1="6" x2="30" y2="12" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="100%" stopColor="#DC2626" />
      </linearGradient>
      </defs>
    <g>
      <path d="M10 13L12 29C12 30.1046 12.8954 31 14 31H22C23.1046 31 24 30.1046 24 29L26 13H10Z" fill="url(#trh3d_body)" />
      <path d="M10 13L12 29C12 30.1046 12.8954 31 14 31H22C23.1046 31 24 30.1046 24 29L26 13H10Z" stroke="white" strokeOpacity="0.25" strokeWidth="0.8" />
      <line x1="14.5" y1="16" x2="15.5" y2="28" stroke="white" strokeOpacity="0.4" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="18" y1="16" x2="18" y2="28" stroke="white" strokeOpacity="0.4" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="21.5" y1="16" x2="20.5" y2="28" stroke="white" strokeOpacity="0.4" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="7" y="9" width="22" height="4" rx="2" fill="url(#trh3d_lid)" stroke="white" strokeOpacity="0.35" strokeWidth="0.8" />
      <rect x="15" y="6" width="6" height="3.5" rx="1.5" fill="#B91C1C" stroke="#FCA5A5" strokeWidth="0.8" />
    </g>
  </svg>
);

export const Security3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="sec3d_shield" x1="6" y1="4" x2="30" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      </defs>
    <g>
      <path d="M18 4L29 8.5V17C29 24.2 24.2 30 18 32C11.8 30 7 24.2 7 17V8.5L18 4Z" fill="url(#sec3d_shield)" />
      <path d="M18 6.2L26.8 9.8V16.6C26.8 22.4 23 27 18 29.8V6.2Z" fill="white" fillOpacity="0.2" />
      <path d="M18 4L29 8.5V17C29 24.2 24.2 30 18 32C11.8 30 7 24.2 7 17V8.5L18 4Z" stroke="white" strokeOpacity="0.3" strokeWidth="1" />
      <circle cx="18" cy="16" r="3" fill="#FDE047" />
      <polygon points="16.5,17 19.5,17 19,22 17,22" fill="#FDE047" />
    </g>
  </svg>
);

export const QrCode3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="qr3d_base" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="qr3d_accent" x1="6" y1="6" x2="30" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFD233" />
        <stop offset="100%" stopColor="#FFB703" />
      </linearGradient>
      <linearGradient id="qr3d_inner" x1="6" y1="6" x2="30" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F8FAFC" />
      </linearGradient>
      </defs>
    <g>
      {/* Outer 3D Rounded Card */}
      <rect x="4" y="4" width="28" height="28" rx="7" fill="url(#qr3d_base)" />
      <rect x="4.5" y="4.5" width="27" height="27" rx="6.5" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
      <rect x="5.5" y="5.5" width="25" height="25" rx="5.5" fill="url(#qr3d_inner)" />
      
      {/* Top-Left QR Target Finder */}
      <rect x="8" y="8" width="7" height="7" rx="2" fill="#0F172A" />
      <rect x="9.5" y="9.5" width="4" height="4" rx="1" fill="#FFFFFF" />
      <rect x="10.5" y="10.5" width="2" height="2" rx="0.5" fill="url(#qr3d_accent)" />

      {/* Top-Right QR Target Finder */}
      <rect x="21" y="8" width="7" height="7" rx="2" fill="#0F172A" />
      <rect x="22.5" y="9.5" width="4" height="4" rx="1" fill="#FFFFFF" />
      <rect x="23.5" y="10.5" width="2" height="2" rx="0.5" fill="url(#qr3d_accent)" />

      {/* Bottom-Left QR Target Finder */}
      <rect x="8" y="21" width="7" height="7" rx="2" fill="#0F172A" />
      <rect x="9.5" y="22.5" width="4" height="4" rx="1" fill="#FFFFFF" />
      <rect x="10.5" y="23.5" width="2" height="2" rx="0.5" fill="url(#qr3d_accent)" />

      {/* Data Pixels with 3D Depth */}
      <rect x="16.5" y="8.5" width="2.5" height="2.5" rx="0.6" fill="#0F172A" />
      <rect x="16.5" y="12.5" width="2.5" height="2.5" rx="0.6" fill="#0F172A" />
      <rect x="12.5" y="16.5" width="2.5" height="2.5" rx="0.6" fill="#0F172A" />
      <rect x="16.5" y="16.5" width="2.5" height="2.5" rx="0.6" fill="url(#qr3d_accent)" />
      <rect x="21" y="16.5" width="2.5" height="2.5" rx="0.6" fill="#0F172A" />
      <rect x="25.5" y="16.5" width="2.5" height="2.5" rx="0.6" fill="#0F172A" />
      <rect x="16.5" y="21" width="2.5" height="2.5" rx="0.6" fill="#0F172A" />
      <rect x="21" y="21" width="2.5" height="2.5" rx="0.6" fill="url(#qr3d_accent)" />
      <rect x="25.5" y="21" width="2.5" height="2.5" rx="0.6" fill="#0F172A" />
      <rect x="16.5" y="25.5" width="2.5" height="2.5" rx="0.6" fill="#0F172A" />
      <rect x="21" y="25.5" width="2.5" height="2.5" rx="0.6" fill="#0F172A" />
      <rect x="25.5" y="25.5" width="2.5" height="2.5" rx="0.6" fill="url(#qr3d_accent)" />
    </g>
  </svg>
);

export const Barcode3DIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="bc3d_base" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="bc3d_inner" x1="6" y1="6" x2="30" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F8FAFC" />
      </linearGradient>
      </defs>
    <g>
      <rect x="4" y="4" width="28" height="28" rx="7" fill="url(#bc3d_base)" />
      <rect x="4.5" y="4.5" width="27" height="27" rx="6.5" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
      <rect x="5.5" y="5.5" width="25" height="25" rx="5.5" fill="url(#bc3d_inner)" />
      
      {/* Vertical Barcode Lines */}
      <rect x="8" y="9" width="1.5" height="15" rx="0.5" fill="#0F172A" />
      <rect x="10.5" y="9" width="2.5" height="15" rx="0.5" fill="#0F172A" />
      <rect x="14" y="9" width="1" height="15" rx="0.5" fill="#0F172A" />
      <rect x="16" y="9" width="3" height="15" rx="0.5" fill="#FFB703" />
      <rect x="20" y="9" width="1.5" height="15" rx="0.5" fill="#0F172A" />
      <rect x="22.5" y="9" width="1" height="15" rx="0.5" fill="#0F172A" />
      <rect x="24.5" y="9" width="3" height="15" rx="0.5" fill="#0F172A" />
      
      {/* Numbers underneath */}
      <rect x="9" y="26" width="3" height="1.5" rx="0.5" fill="#64748B" />
      <rect x="14" y="26" width="8" height="1.5" rx="0.5" fill="#64748B" />
      <rect x="24" y="26" width="3" height="1.5" rx="0.5" fill="#64748B" />
    </g>
  </svg>
);



const THREE_D_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  pdf: Pdf3DIcon,
  word: Word3DIcon,
  excel: Excel3DIcon,
  ppt: Ppt3DIcon,
  image: Image3DIcon,
  text: Text3DIcon,
  html: Html3DIcon,
  merge: Merge3DIcon,
  split: Split3DIcon,
  remove: RemovePages3DIcon,
  extract: ExtractPages3DIcon,
  organize: Organize3DIcon,
  sign: Sign3DIcon,
  watermark: Watermark3DIcon,
  protect: Protect3DIcon,
  unlock: Unlock3DIcon,
  flatten: Flatten3DIcon,
  compare: Compare3DIcon,
  compress: Compress3DIcon,
  qrcode: QrCode3DIcon,
  qr: QrCode3DIcon,
  barcode: Barcode3DIcon,
  stamp: Barcode3DIcon,
  upload: Upload3DIcon,
  flash: Flash3DIcon,
  shield: Shield3DIcon,
  mouse: Mouse3DIcon,
  cycle: Cycle3DIcon,
  chart: Chart3DIcon,
  overview: Chart3DIcon,
  analytics: Chart3DIcon,
  barchart: Chart3DIcon,
  folder: Folder3DIcon,
  recent: Folder3DIcon,
  files: Folder3DIcon,
  documents: Folder3DIcon,
  billing: CreditCard3DIcon,
  card: CreditCard3DIcon,
  creditcard: CreditCard3DIcon,
  payment: CreditCard3DIcon,
  user: User3DIcon,
  account: User3DIcon,
  profile: User3DIcon,
  avatar: User3DIcon,
  clock: Clock3DIcon,
  time: Clock3DIcon,
  timer: Clock3DIcon,
  storage: Storage3DIcon,
  harddrive: Storage3DIcon,
  server: Storage3DIcon,
  cloud: Storage3DIcon,
  crown: Crown3DIcon,
  pro: Crown3DIcon,
  diamond: Diamond3DIcon,
  business: Diamond3DIcon,
  enterprise: Diamond3DIcon,
  receipt: Receipt3DIcon,
  invoice: Receipt3DIcon,
  star: Star3DIcon,
  favorite: Star3DIcon,
  trash: Trash3DIcon,
  delete: Trash3DIcon,
  security: Security3DIcon,
};

export const ThreeDIcon: React.FC<{ name: string; className?: string }> = ({ name, className = 'w-7 h-7' }) => {
  const IconComponent = THREE_D_ICON_MAP[name] || Word3DIcon;
  return <IconComponent className={className} />;
};

export function getTool3DIcon(toolId?: string, iconName?: string): string {
  if (!toolId && !iconName) return 'pdf';
  const id = (toolId || '').toLowerCase();
  
  if (id.includes('stamp') || id.includes('barcode')) return 'barcode';
  if (id.includes('qr') || id.includes('qrcode')) return 'qrcode';
  if (id === 'pdf-to-word' || id === 'word-to-pdf') return 'word';
  if (id === 'pdf-to-excel' || id === 'excel-to-pdf' || id.includes('csv') || id.includes('excel')) return 'excel';
  if (id === 'pdf-to-ppt' || id === 'ppt-to-pdf' || id.includes('ppt') || id.includes('presentation')) return 'ppt';
  if (id === 'pdf-to-jpg' || id === 'jpg-to-pdf' || id.includes('jpg') || id.includes('image') || id.includes('png')) return 'image';
  if (id === 'pdf-to-text' || id.includes('text') || id.includes('txt')) return 'text';
  if (id === 'html-to-pdf' || id.includes('html') || id.includes('code')) return 'html';
  if (id.includes('merge')) return 'merge';
  if (id.includes('split')) return 'split';
  if (id.includes('remove')) return 'remove';
  if (id.includes('extract')) return 'extract';
  if (id.includes('organize')) return 'organize';
  if (id.includes('compress') || id.includes('zip')) return 'compress';
  if (id.includes('flatten')) return 'flatten';
  if (id.includes('sign')) return 'sign';
  if (id.includes('watermark')) return 'watermark';
  if (id.includes('unlock') || id.includes('decrypt')) return 'unlock';
  if (id.includes('protect') || id.includes('lock') || id.includes('encrypt') || id.includes('secure')) return 'protect';
  if (id.includes('compare')) return 'compare';

  // Fallback by iconName
  const icon = (iconName || '').toLowerCase();
  if (icon.includes('barcode') || icon.includes('stamp')) return 'barcode';
  if (icon.includes('qr')) return 'qrcode';
  if (icon.includes('filetext') || icon.includes('fileplus')) return 'word';
  if (icon.includes('table') || icon.includes('sheet') || icon.includes('spreadsheet')) return 'excel';
  if (icon.includes('presentation')) return 'ppt';
  if (icon.includes('image')) return 'image';
  if (icon.includes('filecode') || icon.includes('code')) return 'html';
  if (icon.includes('files')) return 'merge';
  if (icon.includes('scissor')) return 'split';
  if (icon.includes('trash')) return 'remove';
  if (icon.includes('copy')) return 'extract';
  if (icon.includes('layoutgrid')) return 'organize';
  if (icon.includes('minimize')) return 'compress';
  if (icon.includes('layers')) return 'flatten';
  if (icon.includes('pen')) return 'sign';
  if (icon.includes('stamp')) return 'watermark';
  if (icon.includes('unlock') || icon.includes('decrypt') || icon.includes('key')) return 'unlock';
  if (icon.includes('lock') || icon.includes('protect') || icon.includes('shield')) return 'protect';
  if (icon.includes('compare')) return 'compare';

  return 'pdf';
}

export const DocReady3DIcon: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="dr3d_sheet" x1="8" y1="4" x2="36" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F8FAFC" />
      </linearGradient>
      <linearGradient id="dr3d_border" x1="8" y1="4" x2="36" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
      <linearGradient id="dr3d_fold" x1="28" y1="4" x2="38" y2="14" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#94A3B8" />
      </linearGradient>
      <linearGradient id="dr3d_check_bg" x1="20" y1="20" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    <path d="M10 7C10 5.34315 11.3431 4 13 4H28L38 14V41C38 42.6569 36.6569 44 35 44H13C11.3431 44 10 42.6569 10 41V7Z" fill="url(#dr3d_sheet)" stroke="url(#dr3d_border)" strokeWidth="1.5" />
    <path d="M28 4V12C28 13.1046 28.8954 14 30 14H38L28 4Z" fill="url(#dr3d_fold)" />
    <rect x="15" y="16" width="10" height="2.5" rx="1.25" fill="#CBD5E1" />
    <rect x="15" y="21" width="16" height="2.5" rx="1.25" fill="#E2E8F0" />
    <rect x="15" y="26" width="12" height="2.5" rx="1.25" fill="#E2E8F0" />
    <circle cx="32" cy="32" r="11" fill="url(#dr3d_check_bg)" />
    <circle cx="32" cy="32" r="10" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
    <path d="M24 28C26 23 38 23 40 28" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.5" />
    <path d="M26.5 32L30.5 36L37.5 28.5" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function getFile3DIconName(filename?: string): string {
  if (!filename) return 'pdf';
  const name = filename.toLowerCase();
  if (name.endsWith('.docx') || name.endsWith('.doc')) return 'word';
  if (name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.csv')) return 'excel';
  if (name.endsWith('.pptx') || name.endsWith('.ppt')) return 'ppt';
  if (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.webp')) return 'image';
  if (name.endsWith('.txt')) return 'text';
  if (name.endsWith('.html') || name.endsWith('.htm')) return 'html';
  if (name.endsWith('.zip')) return 'compress';
  if (name.endsWith('.pdf')) return 'pdf';
  return 'pdf';
}

export function getFile3DIcon(filename?: string, className = 'w-7 h-7'): React.ReactElement {
  const iconName = getFile3DIconName(filename);
  return <ThreeDIcon name={iconName} className={className} />;
}





