import { HUDCard } from "@/components/ui/HUDCard";

export function InflammationChart() {
  return (
    <HUDCard className="p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
            Inflammation Trend
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Lifestyle-related wellness estimate
          </p>
        </div>

        <div className="flex rounded-xl border border-cyan-300/15 bg-slate-950/50 p-1">
          <button className="rounded-lg bg-cyan-400/15 px-3 py-1 text-xs text-cyan-200">
            7D
          </button>
          <button className="px-3 py-1 text-xs text-slate-500">30D</button>
          <button className="px-3 py-1 text-xs text-slate-500">90D</button>
        </div>
      </div>

      <div className="relative h-44 w-full overflow-hidden rounded-xl border border-cyan-300/10 bg-slate-950/45">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.06)_1px,transparent_1px)] bg-[size:36px_36px]" />

        <svg
          viewBox="0 0 420 170"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="currentInflammationSvg" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="improvedInflammationSvg" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </linearGradient>

            <filter id="chartGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Current path area */}
          <path
            d="M0,88 L70,68 L140,48 L210,70 L280,76 L350,82 L420,96 L420,170 L0,170 Z"
            fill="url(#currentInflammationSvg)"
          />

          {/* Improved path area */}
          <path
            d="M0,96 L70,104 L140,112 L210,120 L280,130 L350,138 L420,146 L420,170 L0,170 Z"
            fill="url(#improvedInflammationSvg)"
          />

          {/* Current path line */}
          <polyline
            points="0,88 70,68 140,48 210,70 280,76 350,82 420,96"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#chartGlow)"
          />

          {/* Improved path line */}
          <polyline
            points="0,96 70,104 140,112 210,120 280,130 350,138 420,146"
            fill="none"
            stroke="#34d399"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#chartGlow)"
          />

          {[0, 70, 140, 210, 280, 350, 420].map((x, index) => {
            const currentY = [88, 68, 48, 70, 76, 82, 96][index];
            const improvedY = [96, 104, 112, 120, 130, 138, 146][index];

            return (
              <g key={x}>
                <circle cx={x} cy={currentY} r="4" fill="#22d3ee" />
                <circle cx={x} cy={improvedY} r="4" fill="#34d399" />
              </g>
            );
          })}
        </svg>

        <div className="absolute bottom-3 left-3 right-3 flex justify-between text-[10px] uppercase tracking-[0.14em] text-slate-500">
          <span>May 15</span>
          <span>May 16</span>
          <span>May 17</span>
          <span>May 18</span>
          <span>May 19</span>
          <span>May 20</span>
          <span>Today</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-cyan-300/10 bg-slate-950/50 p-3">
          <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
            Current
          </div>
          <div className="mt-1 text-2xl font-light text-cyan-200">2.1</div>
        </div>

        <div className="rounded-xl border border-emerald-300/10 bg-slate-950/50 p-3">
          <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
            Improved Path
          </div>
          <div className="mt-1 text-2xl font-light text-emerald-200">0.9</div>
        </div>
      </div>
    </HUDCard>
  );
}