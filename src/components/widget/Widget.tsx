import { useEffect, useState } from "react";
import {
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { dbService } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { useNavigate } from "react-router-dom";

interface WidgetProps {
  type: "user" | "product" | "order" | "earning";
}

const Widget = ({ type }: WidgetProps) => {
  const [amount, setAmount] = useState<number | null>(null);
  const [diff, setDiff] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    const fetchWidgetData = async () => {
      try {
        setLoading(true);
        const stats = await dbService.getStatsSummary(type);
        if (active) {
          setAmount(stats.amount);
          setDiff(stats.diff);
        }
      } catch (err) {
        console.error("Widget data fetch failed", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchWidgetData();
    return () => {
      active = false;
    };
  }, [type]);

  let config = {
    title: "",
    isMoney: false,
    link: "",
    path: "",
    icon: Users,
    colorClass: "",
    bgClass: ""
  };

  switch (type) {
    case "user":
      config = {
        title: "USERS",
        isMoney: false,
        link: "See all users",
        path: "/users",
        icon: Users,
        colorClass: "text-red-500",
        bgClass: "bg-red-500/10"
      };
      break;
    case "product":
      config = {
        title: "PRODUCTS",
        isMoney: false,
        link: "View products",
        path: "/products",
        icon: Package,
        colorClass: "text-purple-500",
        bgClass: "bg-purple-500/10"
      };
      break;
    case "order":
      config = {
        title: "ORDERS",
        isMoney: false,
        link: "View all orders",
        path: "",
        icon: ShoppingCart,
        colorClass: "text-amber-500",
        bgClass: "bg-amber-500/10"
      };
      break;
    case "earning":
      config = {
        title: "EARNINGS",
        isMoney: true,
        link: "View net earnings",
        path: "",
        icon: DollarSign,
        colorClass: "text-green-500",
        bgClass: "bg-green-500/10"
      };
      break;
  }

  const Icon = config.icon;
  const isPositive = diff && diff >= 0;

  return (
    <Card className="flex-1 min-w-[220px]">
      <CardContent className="p-6 flex justify-between h-full">
        <div className="flex flex-col justify-between space-y-4">
          <span className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
            {config.title}
          </span>
          <span className="text-2xl font-bold text-foreground leading-none">
            {loading ? (
              <span className="text-muted-foreground animate-pulse text-lg">Loading...</span>
            ) : (
              <>
                {config.isMoney && "$"}
                {amount?.toLocaleString() ?? 0}
              </>
            )}
          </span>
          <span className="text-xs text-primary underline underline-offset-4 cursor-pointer hover:text-primary/80 transition-colors" onClick={() => navigate(config.path)}>
            {config.link}
          </span>
        </div>

        <div className="flex flex-col justify-between items-end">
          {diff !== null && !loading && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full select-none",
              isPositive
                ? "text-green-600 bg-green-500/10"
                : "text-red-600 bg-red-500/10"
            )}
            >
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{Math.abs(diff)}%</span>
            </div>
          )}
          <div className={cn("p-2.5 rounded-xl border border-border/50", config.colorClass, config.bgClass)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Widget;
