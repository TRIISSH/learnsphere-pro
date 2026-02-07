import { NavLink } from "react-router-dom";
import { LayoutDashboard, BookOpen, BarChart3, Lightbulb } from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Home" },
  { to: "/courses", icon: BookOpen, label: "Courses" },
  { to: "/analytics", icon: BarChart3, label: "Stats" },
  { to: "/recommendations", icon: Lightbulb, label: "For You" },
];

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-lg border-t border-border z-50">
      <div className="flex justify-around py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive ? "text-accent" : "text-muted-foreground"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
