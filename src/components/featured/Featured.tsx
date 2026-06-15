import { MoreVertical, ArrowDown, ArrowUp } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Card, CardContent } from "@/components/ui/card";

const Featured = () => {
  return (
    <Card className="flex-2 min-w-[260px]">
      <CardContent className="p-6 flex flex-col justify-between h-full space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Total Revenue
          </h1>
          <button className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-32 w-32 font-bold">
            <CircularProgressbar
              value={70}
              text={"70%"}
              strokeWidth={8}
              styles={buildStyles({
                pathColor: "hsl(var(--primary))",
                textColor: "hsl(var(--foreground))",
                trailColor: "hsl(var(--muted))",
                textSize: "18px"
              })}
            />
          </div>
          <p className="text-sm font-medium text-muted-foreground text-center">
            Total sales made today
          </p>
          <p className="text-3xl font-extrabold text-foreground tracking-tight">
            $420
          </p>
          <p className="text-xs text-muted-foreground text-center max-w-[220px]">
            Previous transactions processing. Last payments may not be included.
          </p>
        </div>

        <div className="grid grid-cols-3 border-t border-border pt-4 text-center divide-x divide-border">
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground font-medium">Target</span>
            <div className="flex items-center justify-center gap-0.5 text-xs text-red-500 font-semibold">
              <ArrowDown className="h-3 w-3" />
              <span>$12.4k</span>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground font-medium">Last Week</span>
            <div className="flex items-center justify-center gap-0.5 text-xs text-green-500 font-semibold">
              <ArrowUp className="h-3 w-3" />
              <span>$15.6k</span>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground font-medium">Last Month</span>
            <div className="flex items-center justify-center gap-0.5 text-xs text-green-500 font-semibold">
              <ArrowUp className="h-3 w-3" />
              <span>$48.2k</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Featured;
