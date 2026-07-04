export interface EventAttendee {
  id: string;
  displayName: string;
  imageUrl?: string | null;
}

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
  hostId: string;
  hostDisplayName: string;
  imageUrl: string | null;
  isHost: boolean;
  isGoing: boolean;
  attendees: EventAttendee[];
}

export interface AttendeeDto {
  id: string;
  displayName: string;
  imageUrl?: string;
  isHost: boolean;
}

export interface EventDetails extends Event {
  attendees: AttendeeDto[];
}

export interface PagedList<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface GetEventsResult {
  pagedEvents: PagedList<Event>;
  currentDate: string;
}

export interface EventParams {
  pageNumber?: number;
  pageSize?: number;
  startDate?: string;
  category?: number;
}