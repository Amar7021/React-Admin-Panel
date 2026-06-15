import { Link, NavLink, useNavigate } from "react-router-dom";
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
  X,
  Sun,
  Moon,
} from "lucide-react";

import { useEffect, useRef } from "react";
import { useSidebarStore } from "@/store/sidebarStore";
import { useAuthStore } from "@/store/authStore";
import { dbService } from "@/lib/db";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { useThemeStore } from "@/store/themeStore";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const Sidebar = () => {
  const navigate = useNavigate();

  const open = useSidebarStore((state) => state.open);
  const close = useSidebarStore((state) => state.close);
  const darkMode = useThemeStore((state) => state.darkMode);
  const setDarkMode = useThemeStore((state) => state.setDarkMode);
  const setLightMode = useThemeStore((state) => state.setLightMode);

  const sidebarRef = useRef<HTMLDivElement>(null);
  console.log({ sidebarRef })

  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [close]);

  const menuItems = [
    {
      title: "MAIN",
      items: [
        {
          name: "Dashboard",
          icon: LayoutDashboard,
          path: "/",
        },
      ],
    },
    {
      title: "LISTS",
      items: [
        {
          name: "Users",
          icon: Users,
          path: "/users",
        },
        {
          name: "Products",
          icon: Package,
          path: "/products",
        },
        {
          name: "Orders",
          icon: CreditCard,
          path: "/orders",
        },
        {
          name: "Delivery",
          icon: Truck,
          path: "/delivery",
        },
      ],
    },
    {
      title: "USEFUL",
      items: [
        {
          name: "Stats",
          icon: TrendingUp,
          path: "/stats",
        },
        {
          name: "Notifications",
          icon: Bell,
          path: "/notifications",
        },
      ],
    },
    {
      title: "SERVICE",
      items: [
        {
          name: "System Health",
          icon: Activity,
          path: "/health",
        },
        {
          name: "Logs",
          icon: FileText,
          path: "/logs",
        },
        {
          name: "Settings",
          icon: Settings,
          path: "/settings",
        },
      ],
    },
    {
      title: "USER",
      items: [
        {
          name: "Profile",
          icon: UserIcon,
          path: "/profile",
        },
      ],
    },
  ];

  const handleLinkClick = (
    e: React.MouseEvent,
    path: string
  ) => {
    const publicRoutes = [
      "/",
      "/users",
      "/products",
    ];

    if (!currentUser && !publicRoutes.includes(path)) {
      e.preventDefault();

      toast.error("You are not logged in", {
        position: "bottom-right",
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
      });

      return;
    }

    close();
  };

  const handleLogout = async () => {
    try {
      await dbService.signOut();

      logout();

      close();

      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const flatItems = menuItems.flatMap(
    (section) => section.items
  );

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-40"
          onClick={close}
        />
      )}
      <aside className="w-16 h-screen sticky top-0 border-r border-border bg-card shrink-0 flex flex-col z-30">
        <div className="h-16 flex items-center justify-center border-b border-border">
          <Link
            to="/"
            className="font-bold text-primary text-lg"
          >
            AD
          </Link>
        </div>
        <nav className="flex-1 py-3">
          <ul className="space-y-2">
            {flatItems.map((item) => {
              const Icon = item.icon;

              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <li
                      className="flex justify-center"
                    >
                      <NavLink
                        to={item.path}
                        onClick={(e) =>
                          handleLinkClick(
                            e,
                            item.path
                          )
                        }
                        title={item.name}
                        className={({ isActive }) =>
                          cn(
                            "h-10 w-10 flex items-center justify-center rounded-lg transition-all",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )
                        }
                      >
                        <Icon className="h-5 w-5" />
                      </NavLink>
                    </li>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </ul>
        </nav>
      </aside>
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-72 bg-card border-r border-border z-50 transition-transform duration-300 ease-in-out",
          open
            ? "translate-x-0"
            : "-translate-x-full"
        )}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-border">
          <Link
            to="/"
            className="font-bold text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
          >
            Admin Dashboard
          </Link>

          <button
            onClick={close}
            className="p-2 rounded-lg hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-140px)] p-4">
          {menuItems.map((section) => (
            <div
              key={section.title}
              className="mb-6"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                {section.title}
              </h4>

              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (

                    <li key={item.name}>
                      <NavLink
                        to={item.path}
                        onClick={(e) =>
                          handleLinkClick(
                            e,
                            item.path
                          )
                        }
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )
                        }
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {currentUser && (
            <button
              onClick={handleLogout}
              className="w-full mt-4 flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          )}
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
    </>
  );
};

export default Sidebar;
