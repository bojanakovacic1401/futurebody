"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/constants";

type HologramBodyProps = {
  size?: "sm" | "md" | "lg";
  intensity?: number;
  showHeart?: boolean;
  className?: string;
};

const sizeMap = {
  sm: {
    wrapper: "h-[220px] w-[150px]",
  },
  md: {
    wrapper: "h-[360px] w-[250px]",
  },
  lg: {
    wrapper: "h-[620px] w-[430px]",
  },
};

export function HologramBody({
  size = "lg",
  intensity = 1,
  showHeart = true,
  className,
}: HologramBodyProps) {
  const config = sizeMap[size];

  return (
    <div
      className={cn(
        "relative mx-auto flex items-center justify-center",
        config.wrapper,
        className
      )}
    >
      <div className="absolute inset-0 rounded-full bg-cyan-400/5 blur-3xl" />

      <div className="absolute bottom-4 h-8 w-[70%] rounded-full border border-cyan-300/60 bg-cyan-400/10 blur-[1px] shadow-[0_0_45px_rgba(34,211,238,.7)]" />
      <div className="absolute bottom-5 h-14 w-[85%] rounded-full border border-cyan-300/20" />

      <motion.div
        className="absolute inset-0 rounded-full border border-cyan-300/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute inset-[8%] rounded-full border border-cyan-300/10"
        animate={{ rotate: -360 }}
        transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
      />

      <div className="absolute inset-[18%] rounded-full border border-cyan-300/10" />

      <svg
        viewBox="0 0 240 520"
        className="relative z-10 h-full w-full overflow-visible drop-shadow-[0_0_22px_rgba(34,211,238,.8)]"
      >
        <defs>
          <linearGradient id="futurebody-body-glow" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          <filter id="futurebody-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#futurebody-glow)" opacity={0.7 + intensity * 0.16}>
          <circle
            cx="120"
            cy="44"
            r="28"
            fill="rgba(8,145,178,.14)"
            stroke="url(#futurebody-body-glow)"
            strokeWidth="2"
          />

          <path
            d="M103 76 C82 88 72 118 69 157 C66 202 61 245 52 300"
            fill="none"
            stroke="url(#futurebody-body-glow)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          <path
            d="M137 76 C158 88 168 118 171 157 C174 202 179 245 188 300"
            fill="none"
            stroke="url(#futurebody-body-glow)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          <path
            d="M86 105 C96 86 144 86 154 105 C166 132 163 203 146 248 C136 275 134 305 137 335"
            fill="rgba(8,145,178,.1)"
            stroke="url(#futurebody-body-glow)"
            strokeWidth="2.6"
          />

          <path
            d="M154 105 C144 86 96 86 86 105 C74 132 77 203 94 248 C104 275 106 305 103 335"
            fill="rgba(8,145,178,.05)"
            stroke="url(#futurebody-body-glow)"
            strokeWidth="2.6"
          />

          <path
            d="M100 336 C95 385 90 430 84 489"
            fill="none"
            stroke="url(#futurebody-body-glow)"
            strokeWidth="6"
            strokeLinecap="round"
          />

          <path
            d="M140 336 C145 385 150 430 156 489"
            fill="none"
            stroke="url(#futurebody-body-glow)"
            strokeWidth="6"
            strokeLinecap="round"
          />

          <path
            d="M100 336 C102 388 110 432 111 490"
            fill="none"
            stroke="url(#futurebody-body-glow)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <path
            d="M140 336 C138 388 130 432 129 490"
            fill="none"
            stroke="url(#futurebody-body-glow)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <path
            d="M78 160 C44 178 35 209 34 260"
            fill="none"
            stroke="url(#futurebody-body-glow)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          <path
            d="M162 160 C196 178 205 209 206 260"
            fill="none"
            stroke="url(#futurebody-body-glow)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          <path
            d="M34 260 C31 282 28 307 26 332"
            fill="none"
            stroke="url(#futurebody-body-glow)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          <path
            d="M206 260 C209 282 212 307 214 332"
            fill="none"
            stroke="url(#futurebody-body-glow)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          <path
            d="M82 130 C104 145 136 145 158 130"
            stroke="url(#futurebody-body-glow)"
            strokeWidth="1.4"
            opacity=".65"
          />

          <path
            d="M85 185 C108 199 132 199 155 185"
            stroke="url(#futurebody-body-glow)"
            strokeWidth="1.4"
            opacity=".65"
          />

          <path
            d="M96 246 C112 258 128 258 144 246"
            stroke="url(#futurebody-body-glow)"
            strokeWidth="1.4"
            opacity=".65"
          />

          {Array.from({ length: 54 }).map((_, index) => (
            <circle
              key={index}
              cx={50 + ((index * 37) % 140)}
              cy={90 + ((index * 53) % 360)}
              r={index % 4 === 0 ? 2.2 : 1.2}
              fill="#22d3ee"
              opacity={0.25 + (index % 5) * 0.12}
            />
          ))}

          {showHeart && (
            <motion.circle
              cx="136"
              cy="132"
              r="15"
              fill="#fb7185"
              opacity=".75"
              animate={{
                r: [12, 16, 12],
                opacity: [0.55, 0.88, 0.55],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
              }}
            />
          )}
        </g>
      </svg>
    </div>
  );
}