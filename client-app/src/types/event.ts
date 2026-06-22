export interface Event {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  category: string;
  isCancelled: boolean;
  city: string;
  venue: string;
  latitude: number;
  longitude: number;
}

export interface PagedList<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface EventParams {
  pageNumber?: number;
  pageSize?: number;
  startDate?: string;
  category?: number; // 0=None, 1=Sports, 2=Science, 3=Leisure, 4=Other
}