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
  accent: "bg-accent/5 border-accent/20",
  success: "bg-primary/5 border-primary/20",
};

const iconStyles = {
  default: "text-muted-foreground bg-muted/50",
  primary: "text-primary bg-primary/10",
  accent: "text-accent bg-accent/10",
  success: "text-primary bg-primary/10",
};

export default function StatCard({ icon: Icon, label, value, subtext, variant = "default" }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-5 animate-fade-in relative overflow-hidden ${variantStyles[variant]}`}>
      {variant !== "default" && (
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-accent/5 to-transparent rounded-bl-full" />
      )}
      <div className="flex items-center gap-3 mb-3 relative">
        <div className={`p-2 rounded-lg ${iconStyles[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
      </div>
      <p className="text-2xl font-heading font-bold relative">{value}</p>
      {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
    </div>
  );
}
