import { Loader2 } from "lucide-react";
import React from "react";

const SuspenseLayout = ({ children }: { children: React.ReactNode }) => (
    <React.Suspense
        fallback={
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground gap-4 select-none">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <span className="text-sm font-semibold tracking-wider text-muted-foreground animate-pulse">
                    Loading Admin Dashboard...
                </span>
            </div>
        }
    >
        {children}
    </React.Suspense>
);

export default SuspenseLayout