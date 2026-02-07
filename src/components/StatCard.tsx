import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subtext?: string;
  variant?: "default" | "primary" | "accent" | "success";
}

const variantStyles = {
  default: "bg-card border-border",
  primary: "bg-primary/5 border-primary/20 stat-glow",
  accent: "bg-accent/10 border-accent/20",
  success: "bg-success/10 border-success/20",
};

const iconStyles = {
  default: "text-muted-foreground",
  primary: "text-primary",
  accent: "text-accent",
  success: "text-success",
};

export default function StatCard({ icon: Icon, label, value, subtext, variant = "default" }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-5 animate-fade-in ${variantStyles[variant]}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg bg-background/50 ${iconStyles[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
      </div>
      <p className="text-2xl font-heading font-bold">{value}</p>
      {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
    </div>
  );
}
