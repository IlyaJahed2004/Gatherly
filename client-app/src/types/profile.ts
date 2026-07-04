export interface Profile {
  id: string;
  displayName: string;
  bio?: string | null;
  imageUrl?: string | null;
  following: boolean;
  followersCount: number;
  followingCount: number;
}

export interface UserEvent {
  id: string;
  title: string;
  category: string;
  startDate: string;
  imageUrl?: string;
}

export type Follower = Profile;