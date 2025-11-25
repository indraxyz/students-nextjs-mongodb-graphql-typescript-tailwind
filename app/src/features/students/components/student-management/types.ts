export type ToastStatus = "success" | "error";

export interface ToastState {
  message: string;
  status: ToastStatus;
}

export interface ConfirmDeleteState {
  id: string;
  name: string;
  isProcessing: boolean;
}

export interface PageHeaderProps {
  stats: {
    total: number;
    filtered: number;
    hasSearch: boolean;
  };
  onCreate: () => void;
  disabled: boolean;
}

export interface SearchStats {
  total: number;
  filtered: number;
  hasSearch: boolean;
  searchTerm?: string;
}
