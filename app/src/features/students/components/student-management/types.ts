export type ToastStatus = "success" | "error";

export interface ToastState {
  message: string;
  status: ToastStatus;
}

export interface ConfirmDeleteState {
  id?: string;
  ids?: string[];
  name?: string;
  count?: number;
  isProcessing: boolean;
  isBulk?: boolean;
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
