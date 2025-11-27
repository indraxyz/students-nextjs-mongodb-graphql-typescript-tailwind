export interface ConfirmDialogProps {
  studentName?: string;
  count?: number;
  isBulk?: boolean;
  isProcessing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  studentName,
  count,
  isBulk = false,
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
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900">
          {isBulk ? `Delete ${count} students?` : "Delete student?"}
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          {isBulk ? (
            <>
              This action will permanently delete{" "}
              <strong>{count} selected student(s)</strong>. This cannot be
              undone. Are you sure?
            </>
          ) : (
            <>
              This action will delete the data <strong>{studentName}</strong>{" "}
              permanently. Are you sure?
            </>
          )}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isProcessing
              ? isBulk
                ? `Deleting ${count}...`
                : "Deleting..."
              : isBulk
              ? `Delete ${count} Students`
              : "Delete Student"}
          </button>
        </div>
      </div>
    </div>
  );
}
