export interface ConfirmDialogProps {
  studentName: string;
  isProcessing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  studentName,
  isProcessing,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
    >
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900">Delete student?</h3>
        <p className="mt-2 text-sm text-gray-600">
          This action will delete the data <strong>{studentName}</strong>{" "}
          permanently. Are you sure?
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isProcessing ? "Deleting..." : "Delete Student"}
          </button>
        </div>
      </div>
    </div>
  );
}
