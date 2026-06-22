import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import type { Event, PagedList, EventParams } from '../types/event';
import type { RootStore } from './rootStore';

export class EventStore {
  rootStore: RootStore;
  events: Event[] = [];
  isLoading = false;
  totalCount = 0;
  totalPages = 0;
  currentPage = 1;
  selectedCategory = 0;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  loadEvents = async (params?: EventParams) => {
    this.isLoading = true;
    try {
      const result: PagedList<Event> = await agent.Events.list({
        pageNumber: this.currentPage,
        pageSize: 10,
        category: this.selectedCategory,
        // ✅ تاریخ رو از اول بذار تا همه ایونت‌ها (از جمله گذشته) نشون داده بشن
        startDate: '2020-01-01',
        ...params,
      });
      runInAction(() => {
        this.events = result.items;
        this.totalCount = result.totalCount;
        this.totalPages = result.totalPages;
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

  setPage = (page: number) => {
    this.currentPage = page;
    this.loadEvents();
  };
}