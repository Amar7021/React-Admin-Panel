import { Activity, Bell, CreditCard, FileText, LayoutDashboard, Package, Settings, TrendingUp, Truck, UserIcon, Users } from "lucide-react";

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

export { menuItems }