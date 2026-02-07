import { NavLink } from "react-router-dom";
import { LayoutDashboard, BookOpen, BarChart3, Lightbulb, DollarSign, LogOut, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/courses", icon: BookOpen, label: "Courses" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/recommendations", icon: Lightbulb, label: "For You" },
];

export default function Sidebar() {
  const { displayName, signOut } = useAuth();
  const initials = displayName
    ? displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "FN";

  return (
    <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border min-h-screen p-6 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-sidebar-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />

      <div className="flex items-center gap-2.5 mb-10 relative">
        <div className="h-9 w-9 rounded-lg bg-accent/15 flex items-center justify-center">
          <DollarSign className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-bold text-sidebar-primary">WealthPath</h1>
          <div className="flex items-center gap-1 text-[10px] text-primary font-medium">
            <TrendingUp className="h-2.5 w-2.5" />
            <span>Finance Academy</span>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1 relative">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-sidebar-accent text-accent shadow-sm shadow-accent/10"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-sidebar-border space-y-3 relative">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center text-accent font-heading font-bold text-sm">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{displayName || "Investor"}</p>
            <p className="text-xs text-sidebar-foreground/40">Student</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="w-full justify-start text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 gap-2"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>
    </aside>
  );
}
