import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import type { Profile, UserEvent, Follower } from '../types/profile';
import type { RootStore } from './rootStore';

export class ProfileStore {
  rootStore: RootStore;
  profile: Profile | null = null;
  events: UserEvent[] = [];
  followings: Follower[] = [];
  isLoading = false;
  isLoadingEvents = false;
  isLoadingFollowings = false;
  isSubmitting = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  loadProfile = async (username: string) => {
    this.isLoading = true;
    try {
      const data = await agent.Profiles.get(username);
      runInAction(() => { this.profile = data; });
    } catch (err) {
      console.error(err);
    } finally {
      runInAction(() => { this.isLoading = false; });
    }
  };

  updateProfile = async (data: { displayName?: string; bio?: string }) => {
    this.isSubmitting = true;
    try {
      await agent.Profiles.update(data);
      runInAction(() => {
        if (this.profile) {
          this.profile.displayName = data.displayName ?? this.profile.displayName;
          this.profile.bio         = data.bio         ?? this.profile.bio;
        }
        if (this.rootStore.authStore.user && data.displayName) {
          this.rootStore.authStore.user.displayName = data.displayName;
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      runInAction(() => { this.isSubmitting = false; });
    }
  };

  toggleFollow = async (username: string) => {
    this.isSubmitting = true;
    try {
      await agent.Profiles.toggleFollow(username);
      runInAction(() => {
        if (this.profile) {
          this.profile.isFollowing = !this.profile.isFollowing;
          this.profile.followersCount += this.profile.isFollowing ? 1 : -1;
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      runInAction(() => { this.isSubmitting = false; });
    }
  };

  loadEvents = async (username: string, predicate: string) => {
    this.isLoadingEvents = true;
    try {
      const data = await agent.Profiles.getEvents(username, predicate);
      runInAction(() => { this.events = data; });
    } catch (err) {
      console.error(err);
    } finally {
      runInAction(() => { this.isLoadingEvents = false; });
    }
  };

  loadFollowings = async (username: string, predicate: string) => {
    this.isLoadingFollowings = true;
    try {
      const data = await agent.Profiles.getFollowings(username, predicate);
      runInAction(() => { this.followings = data; });
    } catch (err) {
      console.error(err);
    } finally {
      runInAction(() => { this.isLoadingFollowings = false; });
    }
  };
}