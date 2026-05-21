import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import clsx from 'clsx';

interface SystemCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color: 'primary' | 'accent' | 'success' | 'warning' | 'danger';
  trend?: number;
  delay?: number;
}

const styles = {
  primary: {
    glow: 'shadow-blue-500/10',
    icon: 'text-blue-400',
    line: 'from-blue-500 to-cyan-400',
    soft: 'bg-blue-500/10 border-blue-500/20',
  },
  accent: {
    glow: 'shadow-fuchsia-500/10',
    icon: 'text-fuchsia-400',
    line: 'from-fuchsia-500 to-violet-400',
    soft: 'bg-fuchsia-500/10 border-fuchsia-500/20',
  },
  success: {
    glow: 'shadow-emerald-500/10',
    icon: 'text-emerald-400',
    line: 'from-emerald-500 to-green-400',
    soft: 'bg-emerald-500/10 border-emerald-500/20',
  },
  warning: {
    glow: 'shadow-amber-500/10',
    icon: 'text-amber-400',
    line: 'from-amber-500 to-orange-400',
    soft: 'bg-amber-500/10 border-amber-500/20',
  },
  danger: {
    glow: 'shadow-rose-500/10',
    icon: 'text-rose-400',
    line: 'from-rose-500 to-red-400',
    soft: 'bg-rose-500/10 border-rose-500/20',
  },
};

export const SystemCard: React.FC<SystemCardProps> = ({
  title,
  value,
  unit,
  icon,
  color,
  trend,
  delay = 0,
}) => {
  const theme = styles[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      className={clsx(
        'relative overflow-hidden rounded-3xl',
        'border border-white/[0.06]',
        'bg-[rgba(10,14,24,0.92)]',
        'backdrop-blur-2xl',
        'p-5',
        'shadow-2xl',
        theme.glow
      )}
    >
      {/* top glow */}
      <div
        className={clsx(
          'absolute inset-x-0 top-0 h-px bg-gradient-to-r opacity-70',
          theme.line
        )}
      />

      {/* subtle mesh */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_top,white,transparent_70%)]" />

      <div className="relative z-10">
        {/* header */}
        <div className="flex items-start justify-between mb-6">
          <div
            className={clsx(
              'w-12 h-12 rounded-2xl border flex items-center justify-center',
              theme.soft
            )}
          >
            <div className={theme.icon}>{icon}</div>
          </div>

          {trend !== undefined && (
            <div className="flex items-center gap-1 text-[12px] font-medium text-emerald-400">
              <TrendingUp size={13} />
              <span>
                {trend > 0 ? '+' : ''}
                {trend.toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        {/* title */}
        <div className="space-y-2">
          <p className="text-[13px] uppercase tracking-[0.18em] text-gray-500 font-medium">
            {title}
          </p>

          <div className="flex items-end gap-2">
            <span className="text-5xl font-semibold tracking-tight text-white">
              {value.toFixed(1)}
            </span>

            <span className="text-sm text-gray-500 mb-2 font-medium">
              {unit}
            </span>
          </div>
        </div>

        {/* graph line */}
        <div className="mt-6">
          <div className="h-[70px] w-full relative overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.02]">
            <svg
              viewBox="0 0 300 80"
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              <motion.path
                d="M0,52 C20,30 40,60 60,42 C80,24 100,65 120,38 C140,20 160,48 180,44 C200,40 220,16 240,34 C260,52 280,28 300,42"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={theme.icon}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.8, delay }}
              />
            </svg>

            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-white/[0.06]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
