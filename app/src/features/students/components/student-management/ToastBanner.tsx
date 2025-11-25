import { ToastState } from "./types";

export interface ToastBannerProps {
  toast: ToastState;
  onDismiss: () => void;
}

export function ToastBanner({ toast, onDismiss }: ToastBannerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 h-3 w-3 rounded-full ${
            toast.status === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <p className="flex-1 text-sm text-gray-800">{toast.message}</p>
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
