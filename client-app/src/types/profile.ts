export interface Profile {
  id: string;
  displayName: string;
  bio?: string | null;
  imageUrl?: string | null;
  following: boolean;
  followersCount: number;
  followingCount: number;
}

export type Follower = Profile;

// The profile events endpoint (GET /profiles/{id}/events) returns full EventDto,
// so we reuse the Event type from types/event.ts rather than a separate shape.
export type ProfileEventFilter = 'Future' | 'Past' | 'Host';