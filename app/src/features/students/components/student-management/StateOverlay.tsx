import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Clock, Loader2, RefreshCw, Database } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StateOverlayProps {
  variant: "loading" | "error";
  title: string;
  description?: string;
  onRetry?: () => void;
}

export function StateOverlay({
  variant,
  title,
  description,
  onRetry,
}: StateOverlayProps) {
  const isError = variant === "error";
  const isMongoError =
    description?.includes("MongoDB Atlas") ||
    description?.includes("Cannot Connect to MongoDB");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <div
            className={cn(
              "mb-4 rounded-full p-4",
              isError
                ? isMongoError
                  ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                  : "bg-destructive/10 text-destructive"
                : "bg-primary/10 text-primary"
            )}
          >
            {isError ? (
              isMongoError ? (
                <Database className="h-8 w-8" />
              ) : (
                <AlertCircle className="h-8 w-8" />
              )
            ) : (
              <Loader2 className="h-8 w-8 animate-spin" />
            )}
          </div>

          <h2
            className={cn(
              "text-xl font-semibold",
              isError
                ? isMongoError
                  ? "text-yellow-700 dark:text-yellow-400"
                  : "text-destructive"
                : "text-foreground"
            )}
          >
            {title}
          </h2>

          {description && (
            <p
              className={cn(
                "mt-2 text-sm",
                isMongoError
                  ? "text-yellow-700 dark:text-yellow-400"
                  : "text-muted-foreground"
              )}
            >
              {description}
            </p>
          )}

          {isMongoError && (
            <Card className="mt-4 border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-900/20">
              <CardContent className="p-4 text-left">
                <div className="flex items-center gap-2 text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  <Clock className="h-4 w-4" />
                  What's happening?
                </div>
                <ul className="mt-2 space-y-1 text-xs text-yellow-700 dark:text-yellow-400">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-yellow-600 dark:bg-yellow-400" />
                    MongoDB Atlas M0 (free tier) clusters pause after 30 days of
                    inactivity
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-yellow-600 dark:bg-yellow-400" />
                    The cluster needs 10-30 seconds to wake up
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-yellow-600 dark:bg-yellow-400" />
                    This is normal behavior for free tier clusters
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}

          {isError && onRetry && (
            <Button
              onClick={onRetry}
              className="mt-6"
              variant={isMongoError ? "outline" : "destructive"}
            >
              <RefreshCw className="h-4 w-4" />
              {isMongoError ? "Wait and Retry" : "Try Again"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
