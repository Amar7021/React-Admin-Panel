import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  Truck,
  TrendingUp,
  Bell,
  Activity,
  FileText,
  Settings,
  User as UserIcon,
  LogOut,
  Sun,
  Moon
} from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";
import { dbService } from "@/lib/db";
import { cn } from "@/utils/cn";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setDarkMode = useThemeStore((state) => state.setDarkMode);
  const setLightMode = useThemeStore((state) => state.setLightMode);
  const darkMode = useThemeStore((state) => state.darkMode);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await dbService.signOut();
      logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const menuItems = [
    {
      title: "MAIN",
      items: [
        { name: "Dashboard", icon: LayoutDashboard, path: "/" }
      ]
    },
    {
      title: "LISTS",
      items: [
        { name: "Users", icon: Users, path: "/users" },
        { name: "Products", icon: Package, path: "/products" },
        { name: "Orders", icon: CreditCard, path: "/orders" },
        { name: "Delivery", icon: Truck, path: "/delivery" }
      ]
    },
    {
      title: "USEFUL",
      items: [
        { name: "Stats", icon: TrendingUp, path: "/stats" },
        { name: "Notifications", icon: Bell, path: "/notifications" }
      ]
    },
    {
      title: "SERVICE",
      items: [
        { name: "System Health", icon: Activity, path: "/health" },
        { name: "Logs", icon: FileText, path: "/logs" },
        { name: "Settings", icon: Settings, path: "/settings" }
      ]
    },
    {
      title: "USER",
      items: [
        { name: "Profile", icon: UserIcon, path: "/profile" }
      ]
    }
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0 shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link to="/" className="text-xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent tracking-wide">
          Admin Dashboard
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {menuItems.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            <h4 className="text-xs font-bold text-muted-foreground tracking-wider px-2 select-none uppercase">
              {section.title}
            </h4>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Active = isActive(item.path);
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group select-none",
                        Active
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        Active
                          ? "text-primary-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      )} />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* Manual Logout Button in Sidebar Menu */}
        <div className="space-y-1.5 pt-2">
          <ul className="space-y-0.5">
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all cursor-pointer select-none text-left"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="p-4 border-t border-border flex items-center gap-3 bg-muted/30">
        <span className="text-xs font-semibold text-muted-foreground">Theme:</span>
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-lg border border-border flex-1 justify-around">
          <button
            onClick={setLightMode}
            className={cn(
              "p-1.5 rounded-md hover:text-foreground transition-all cursor-pointer flex-1 flex justify-center",
              !darkMode
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground"
            )}
            title="Light Theme"
          >
            <Sun className="h-5 w-5" />
          </button>
          <button
            onClick={setDarkMode}
            className={cn(
              "p-1.5 rounded-md hover:text-foreground transition-all cursor-pointer flex-1 flex justify-center",
              darkMode
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground"
            )}
            title="Dark Theme"
          >
            <Moon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
