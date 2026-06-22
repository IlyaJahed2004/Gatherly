import { createContext, useContext } from 'react';
import { AuthStore } from './authStore';
import { EventStore } from './eventStore';

export class RootStore {
  authStore: AuthStore;
  eventStore: EventStore;

  constructor() {
    this.authStore = new AuthStore(this);
    this.eventStore = new EventStore(this);
  }
}

const RootStoreContext = createContext<RootStore | null>(null);

export const RootStoreProvider = RootStoreContext.Provider;

export const useStore = () => {
  const context = useContext(RootStoreContext);
  if (!context) {
    throw new Error('useStore must be used within RootStoreProvider');
  }
  return context;
};