export interface ConfirmDeleteState {
  id?: string;
  ids?: string[];
  name?: string;
  count?: number;
  isProcessing: boolean;
  isBulk?: boolean;
}

export interface SearchStats {
  total: number;
  filtered: number;
  hasSearch: boolean;
  searchTerm?: string;
}
