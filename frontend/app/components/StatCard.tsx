import { clsx } from "clsx";
import { type LucideIcon, ArrowRight, Trophy } from "lucide-react";
import { CONFIG } from "~/config/constants";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  unit?: string;
  limit?: number;
  isOverLimit?: boolean;
  type?: "progress" | "simple" | "interactive";
  onClick?: () => void;
  bgClass?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  unit = "",
  limit,
  isOverLimit = false,
  type = "progress",
  onClick,
}: StatCardProps) {
  const getBarColor = (current: number, max: number) => {
    if (current > max) return "bg-red-500";
    if (current > max * 0.75) return "bg-orange-400";
    return "bg-emerald-500";
  };

  const commonClasses =
    "bg-white p-6 rounded-2xl border border-slate-100 shadow-sm";

  if (type === "interactive") {
    return (
      <div
        onClick={onClick}
        className={clsx(
          commonClasses,
          "cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group"
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <Icon className={clsx("w-4 h-4", iconColor)} /> {label}
          </div>
          <Trophy className="w-4 h-4 text-slate-300 group-hover:text-yellow-500 transition-colors" />
        </div>
        <span className="text-3xl font-bold block text-slate-900">{value}</span>
        <div className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-blue-600 transition-colors font-medium mt-1">
          Voir le classement{" "}
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    );
  }

  if (type === "simple") {
    return (
      <div className={commonClasses}>
        <div className="flex items-center gap-2 mb-4 text-slate-500 text-sm font-medium">
          <Icon className={clsx("w-4 h-4", iconColor)} /> {label}
        </div>
        <span className="text-3xl font-bold block text-slate-900">
          {value.toFixed(0)}
        </span>
      </div>
    );
  }

  // Progress type
  const percentage = limit ? Math.min((value / limit) * 100, 100) : 0;

  return (
    <div
      className={clsx(commonClasses, "col-span-1 md:col-span-2 lg:col-span-1")}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
          <Icon className={clsx("w-4 h-4", iconColor)} /> {label}
        </div>
        {isOverLimit && (
          <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold animate-pulse">
            DANGER
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <span
          className={clsx(
            "text-3xl font-bold",
            isOverLimit ? "text-red-600" : "text-slate-900"
          )}
        >
          {value % 1 !== 0 ? value.toFixed(1) : value}
        </span>
        {limit && (
          <span className="text-slate-400 text-sm">
            / {limit}
            {unit}
          </span>
        )}
      </div>
      {limit && (
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={clsx(
              "h-full rounded-full transition-all duration-700 ease-out",
              getBarColor(value, limit)
            )}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
