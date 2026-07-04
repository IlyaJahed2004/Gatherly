import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import type { Event, GetEventsResult, EventParams } from '../types/event';
import type { RootStore } from './rootStore';

export class EventStore {
  rootStore: RootStore;
  events: Event[] = [];
  isLoading = false;
  totalCount = 0;
  totalPages = 0;
  currentPage = 1;
  selectedCategory = 0;
  selectedDate: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  loadEvents = async (params?: EventParams) => {
    this.isLoading = true;
    try {
      const result: GetEventsResult = await agent.Events.list({
        pageNumber: this.currentPage,
        pageSize: 10,
        category: this.selectedCategory,
        startDate: this.selectedDate ?? '2020-01-01',
        ...params,
      });
      runInAction(() => {
        this.events = result.pagedEvents.items;
        this.totalCount = result.pagedEvents.totalCount;
        this.totalPages = result.pagedEvents.totalPages;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
      });
      console.error('Failed to load events:', error);
    }
  };

  setCategory = (category: number) => {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.loadEvents();
  };

  setDate = (date: string | null) => {
    this.selectedDate = date;
    this.currentPage = 1;
    this.loadEvents();
  };

  setPage = (page: number) => {
    this.currentPage = page;
    this.loadEvents();
  };
}