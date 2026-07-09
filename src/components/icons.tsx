// Lightweight inline icon set so we don't pull in a library.
// All icons accept size + className for color via currentColor.

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 18) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const Icon = {
  Search: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  Heart: ({ size, filled, ...p }: IconProps & { filled?: boolean }) => (
    <svg
      {...base(size)}
      fill={filled ? "currentColor" : "none"}
      {...p}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  MapPin: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Bed: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M2 9V5a1 1 0 0 1 1-1h7v5" />
      <path d="M2 11h20v6" />
      <path d="M4 17v3" />
      <path d="M20 17v3" />
      <path d="M22 11V8a2 2 0 0 0-2-2h-6" />
      <circle cx="7" cy="11" r="2" />
    </svg>
  ),
  Ruler: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="m21 16-7 7-11-11 7-7z" />
      <path d="m7 11 2 2" />
      <path d="m10 8 2 2" />
      <path d="m13 5 2 2" />
    </svg>
  ),
  Car: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M5 17h14M3 17v-3l2-6h14l2 6v3" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  ),
  Dumbbell: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M6 6v12" />
      <path d="M18 6v12" />
      <path d="M3 9v6" />
      <path d="M21 9v6" />
      <path d="M6 12h12" />
    </svg>
  ),
  Waves: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M2 12c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
      <path d="M2 17c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
    </svg>
  ),
  ArrowUp: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  ),
  Power: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M12 2v10" />
      <path d="M5.93 7.93a10 10 0 1 0 12.14 0" />
    </svg>
  ),
  Shield: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Balcony: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M3 21h18" />
      <path d="M5 21V8h14v13" />
      <path d="M9 21v-5h6v5" />
      <path d="M5 8l7-5 7 5" />
    </svg>
  ),
  Paw: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <circle cx="5" cy="9" r="2" />
      <circle cx="9" cy="5" r="2" />
      <circle cx="15" cy="5" r="2" />
      <circle cx="19" cy="9" r="2" />
      <path d="M12 10a4 4 0 0 0-4 4c0 3 4 7 4 7s4-4 4-7a4 4 0 0 0-4-4z" />
    </svg>
  ),
  Wifi: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M5 12.55a11 11 0 0 1 14 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <circle cx="12" cy="20" r="1" />
    </svg>
  ),
  Phone: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Calendar: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  Clock: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  Play: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} fill="currentColor" stroke="none" {...p}>
      <path d="M6 4l14 8-14 8z" />
    </svg>
  ),
  Pause: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} fill="currentColor" stroke="none" {...p}>
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  ),
  X: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  Menu: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  ),
  User: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Logout: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  ),
  TrendingUp: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="m22 7-8.5 8.5-5-5L2 17" />
      <path d="M16 7h6v6" />
    </svg>
  ),
  TrendingDown: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="m22 17-8.5-8.5-5 5L2 7" />
      <path d="M16 17h6v-6" />
    </svg>
  ),
  Sparkle: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </svg>
  ),
  Bell: ({ size, ...p }: IconProps) => (
    <svg {...base(size)} {...p}>
      <path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h16l-2-2z" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  ),
  Google: ({ size = 18, ...p }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 48 48" {...p}>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  ),
};

export const amenityIcon = (key: string) => {
  switch (key) {
    case "parking":
      return Icon.Car;
    case "gym":
      return Icon.Dumbbell;
    case "pool":
      return Icon.Waves;
    case "lift":
      return Icon.ArrowUp;
    case "power":
      return Icon.Power;
    case "security":
      return Icon.Shield;
    case "balcony":
      return Icon.Balcony;
    case "pet":
      return Icon.Paw;
    case "wifi":
      return Icon.Wifi;
    default:
      return Icon.Sparkle;
  }
};
