import { Button } from "@/components/ui/button";
import { AlertTriangle, Link } from "lucide-react";

const ErrorBoundary = () => (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-6 text-center space-y-4">
        <div className="p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-full">
            <AlertTriangle className="h-10 w-10 animate-bounce" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Route Loading Failed
        </h1>
        <p className="text-muted-foreground text-xs max-w-sm">
            There was a problem loading this section. This might be due to a network error or code execution failure.
        </p>
        <Link to="/">
            <Button className="font-semibold" size="sm">
                Return to Dashboard
            </Button>
        </Link>
    </div>
)

export default ErrorBoundary
