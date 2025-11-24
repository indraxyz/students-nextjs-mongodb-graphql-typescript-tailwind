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

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div
        className={`mb-4 rounded-full p-4 ${
          isError ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
        }`}
      >
        {isError ? "⚠️" : "⏳"}
      </div>
      <h2
        className={`text-2xl font-semibold ${
          isError ? "text-red-700" : "text-gray-900"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-md text-gray-600">{description}</p>
      )}
      {isError && onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-500"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
}
