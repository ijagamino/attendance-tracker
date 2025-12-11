export type Object = {
  [k: string]: string | number | boolean;
};

interface Pagination {
  page: number;
  totalPage: number;
}

export interface PaginationParams {
  page: string;
  limit: string;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: Pagination;
}
