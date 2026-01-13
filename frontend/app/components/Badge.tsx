import { clsx } from "clsx";

interface BadgeProps {
  label: string;
  variant?: "bg-red" | "bg-orange" | "bg-emerald" | "bg-slate" | "outline";
  className?: string;
}

export function Badge({ label, variant = "bg-slate", className }: BadgeProps) {
  const styles = {
    "bg-red": "bg-red-100 text-red-800",
    "bg-orange": "bg-orange-100 text-orange-800",
    "bg-emerald": "bg-emerald-100 text-emerald-800",
    "bg-slate": "bg-slate-100 text-slate-800",
    outline: "border border-slate-200 text-slate-600",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        styles[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
