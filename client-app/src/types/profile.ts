export interface Profile {
  id: string;
  username: string;
  displayName?: string;
  bio?: string;
  imageUrl?: string;
  followersCount: number;
  followingsCount: number;
  isFollowing: boolean;
  isCurrentUser: boolean;
}

export interface UserEvent {
  id: string;
  title: string;
  category: string;
  startDate: string;
  imageUrl?: string;
}

export interface Follower {
  id: string;
  username: string;
  displayName?: string;
  imageUrl?: string;
  followersCount: number;
}