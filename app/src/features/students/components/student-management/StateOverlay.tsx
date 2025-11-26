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
  const isMongoError = description?.includes("MongoDB Atlas") || description?.includes("Cannot Connect to MongoDB");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div
        className={`mb-4 rounded-full p-4 ${
          isError 
            ? isMongoError 
              ? "bg-yellow-50 text-yellow-600" 
              : "bg-red-50 text-red-600"
            : "bg-blue-50 text-blue-600"
        }`}
      >
        {isError ? (isMongoError ? "⏳" : "⚠️") : "⏳"}
      </div>
      <h2
        className={`text-2xl font-semibold ${
          isError 
            ? isMongoError 
              ? "text-yellow-700" 
              : "text-red-700"
            : "text-gray-900"
        }`}
      >
        {title}
      </h2>
      {description && (
        <div className="mt-2 max-w-lg">
          <p className={`text-sm ${
            isMongoError ? "text-yellow-700" : "text-gray-600"
          }`}>
            {description}
          </p>
          {isMongoError && (
            <div className="mt-4 rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-left">
              <p className="text-sm font-medium text-yellow-800 mb-2">
                💡 What's happening?
              </p>
              <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
                <li>MongoDB Atlas M0 (free tier) clusters pause after 30 days of inactivity</li>
                <li>The cluster needs 10-30 seconds to wake up</li>
                <li>This is normal behavior for free tier clusters</li>
              </ul>
            </div>
          )}
        </div>
      )}
      {isError && onRetry && (
        <button
          onClick={onRetry}
          className={`mt-6 rounded px-6 py-2.5 text-white font-medium transition-colors ${
            isMongoError
              ? "bg-yellow-600 hover:bg-yellow-700"
              : "bg-red-600 hover:bg-red-500"
          }`}
        >
          {isMongoError ? "Wait and Retry" : "Try Again"}
        </button>
      )}
    </div>
  );
}
