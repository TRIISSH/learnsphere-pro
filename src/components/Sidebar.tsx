import { NavLink } from "react-router-dom";
import { LayoutDashboard, BookOpen, BarChart3, Lightbulb, GraduationCap } from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/courses", icon: BookOpen, label: "Courses" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/recommendations", icon: Lightbulb, label: "For You" },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border min-h-screen p-6">
      <div className="flex items-center gap-2 mb-10">
        <GraduationCap className="h-8 w-8 text-sidebar-primary" />
        <h1 className="font-heading text-xl font-bold text-sidebar-primary">LearnPath</h1>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary font-heading font-bold text-sm">
            AJ
          </div>
          <div>
            <p className="text-sm font-medium">Alex Johnson</p>
            <p className="text-xs text-sidebar-foreground/50">Student</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
