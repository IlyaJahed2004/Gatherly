import { createContext, useContext } from 'react';
import { AuthStore } from './authStore';
import { EventStore } from './eventStore';
import { ProfileStore } from './profileStore';

export class RootStore {
  authStore: AuthStore;
  eventStore: EventStore;
  profileStore: ProfileStore;

  constructor() {
    this.authStore    = new AuthStore(this);
    this.eventStore   = new EventStore(this);
    this.profileStore = new ProfileStore(this);
  }
}

const RootStoreContext = createContext<RootStore | null>(null);

export const RootStoreProvider = RootStoreContext.Provider;

export const useStore = () => {
  const context = useContext(RootStoreContext);
  if (!context) throw new Error('useStore must be used within RootStoreProvider');
  return context;
};