import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ErrorBoundary = () => {
    const navigate = useNavigate()

    return (
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
            <Button className="font-semibold" size="sm" onClick={() => navigate("/")}>
                Return to Dashboard
            </Button>
        </div>
    )
}

export default ErrorBoundary
