import { create } from 'zustand';
import { Store } from '@/types';
import { mockStores } from '@/data/stores';

interface FilterOptions {
  searchKeyword: string;
  sizeFilter: string;
  priceRange: [number, number];
  minRating: number;
  openNow: boolean;
  sortBy: 'default' | 'distance' | 'price' | 'rating';
}

interface StoreState {
  stores: Store[];
  filters: FilterOptions;
  selectedStore: Store | null;
  setStores: (stores: Store[]) => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  setSelectedStore: (store: Store | null) => void;
  getFilteredStores: () => Store[];
}

export const useStoreStore = create<StoreState>((set, get) => ({
  stores: mockStores,
  filters: {
    searchKeyword: '',
    sizeFilter: 'all',
    priceRange: [0, 100],
    minRating: 0,
    openNow: false,
    sortBy: 'default',
  },
  selectedStore: null,

  setStores: (stores) => set({ stores }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  setSelectedStore: (store) => set({ selectedStore: store }),

  getFilteredStores: () => {
    const { stores, filters } = get();
    let filtered = [...stores];

    if (filters.searchKeyword) {
      const keyword = filters.searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(keyword) ||
          s.address.toLowerCase().includes(keyword)
      );
    }

    if (filters.sizeFilter !== 'all') {
      filtered = filtered.filter((s) => {
        const cap = s.capacity[filters.sizeFilter as keyof typeof s.capacity];
        return cap && cap.available > 0;
      });
    }

    if (filters.minRating > 0) {
      filtered = filtered.filter((s) => s.rating >= filters.minRating);
    }

    filtered = filtered.filter(
      (s) =>
        s.pricePerHour >= filters.priceRange[0] &&
        s.pricePerHour <= filters.priceRange[1]
    );

    switch (filters.sortBy) {
      case 'distance':
        filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
      case 'price':
        filtered.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  },
}));
