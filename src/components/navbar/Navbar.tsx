import { useEffect, useRef, useState } from "react";
import {
  Search,
  Globe,
  Sun,
  Moon,
  Maximize,
  Bell,
  MessageSquare,
  User as UserIcon,
  Settings,
  LogOut,
  LogIn
} from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { dbService, AppNotification } from "@/lib/db";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { Menu } from "lucide-react";
import { useSidebarStore } from "@/store/sidebarStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const Navbar = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [fullscreen, setFullscreen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const darkMode = useThemeStore((state) => state.darkMode);
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);
  const { currentUser, logout } = useAuthStore();
  const toggleSidebar = useSidebarStore((state) => state.toggle);

  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = dbService.listenNotifications((data) => {
      setNotifications(data);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;

      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTyping) return;

      const isShortcut =
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k";

      if (isShortcut) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = () => {
    dbService.markNotificationsRead();
  };

  const handleLinkClick = (path: string): void => {
    if (!currentUser) {
      toast.error("You are not logged in", {
        position: "bottom-right",
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        }
      });
      return;
    }
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await dbService.signOut();
      logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setFullscreen(true);
      }).catch(err => {
        console.error("Fullscreen toggle failed", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setFullscreen(false);
      });
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-3 sm:px-4 md:px-6 gap-1">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg hover:bg-muted"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md flex items-center gap-2 bg-muted/60 px-3 py-1.5 rounded-lg border border-border transition-all focus-within:ring-2 focus-within:ring-primary/40">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search..."
          className="bg-transparent border-0 outline-hidden text-sm w-full placeholder:text-muted-foreground text-foreground"
          ref={searchRef}
        />
        <div className="hidden md:flex items-center gap-1">
          <kbd className="border border-border rounded px-1 text-xs font-semibold bg-background">
            Ctrl
          </kbd>
          <span>+</span>
          <kbd className="border border-border rounded px-1 text-xs font-semibold bg-background">
            K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
        <div className="hidden md:flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors select-none cursor-pointer">
          <Globe className="h-4 w-4" />
          <span>English</span>
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer hidden md:block"
          title="Toggle Fullscreen"
        >
          <Maximize className="h-5 w-5" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-card animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border">
              <span className="font-semibold text-sm">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkRead}
                  className="text-xs text-primary hover:underline font-medium cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No new notifications
                </div>
              ) : (
                notifications.map((not) => (
                  <div
                    key={not.id}
                    className={cn(
                      "p-3 text-xs border-b border-muted transition-colors",
                      not.read ? "bg-transparent" : "bg-primary/5 font-medium"
                    )}
                  >
                    <div className="text-foreground">{not.message}</div>
                    <div className="text-muted-foreground text-[10px] mt-1">{not.time}</div>
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer relative hidden sm:block"
          title="Messages"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-green-500 rounded-full ring-2 ring-card" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 focus:outline-hidden cursor-pointer select-none">
              <img
                src={currentUser?.photoURL || "https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"}
                alt="Profile avatar"
                className="h-8 w-8 rounded-full border border-border object-cover ring-2 ring-primary/10 shadow-xs"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            {
              currentUser && <><DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none text-foreground">
                    {currentUser?.displayName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            }
            <DropdownMenuItem onClick={() => handleLinkClick('/profile')}>
              <UserIcon className="h-4 w-4 mr-2" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLinkClick('/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              <span>Settings</span>
            </DropdownMenuItem>
            {!currentUser && <DropdownMenuItem onClick={() => navigate('/login')}>
              <LogIn className="h-4 w-4 mr-2" />
              <span>Login</span>
            </DropdownMenuItem>}
            {
              currentUser && <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setLogoutDialogOpen(true);
                  }}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </>
            }

          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialog
          open={logoutDialogOpen}
          onOpenChange={setLogoutDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to logout?
              </AlertDialogTitle>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
};

export default Navbar;
