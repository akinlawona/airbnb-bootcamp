import { create } from "zustand";

export interface SearchFilters {
  // Price range
  minPrice?: number;
  maxPrice?: number;

  // Property basics
  bedroomCount?: number;
  bedCount?: number;
  bathroomCount?: number;

  // Property type
  privacyTypeIds?: string[];
  categoryIds?: string[];

  // Amenities
  amenityIds?: string[];

  // Host type
  hostTypes?: string[];

  // Booking options
  instantBook?: boolean;
  selfCheckIn?: boolean;

  // Accessibility
  stepFreeAccess?: boolean;
}

interface SearchFilterStore {
  filters: SearchFilters;
  isOpen: boolean;
  
  // Filter setters
  setMinPrice: (price?: number) => void;
  setMaxPrice: (price?: number) => void;
  setBedroomCount: (count?: number) => void;
  setBedCount: (count?: number) => void;
  setBathroomCount: (count?: number) => void;
  setPrivacyTypeIds: (ids: string[]) => void;
  setCategoryIds: (ids: string[]) => void;
  setAmenityIds: (ids: string[]) => void;
  setHostTypes: (types: string[]) => void;
  setInstantBook: (value?: boolean) => void;
  setSelfCheckIn: (value?: boolean) => void;
  setStepFreeAccess: (value?: boolean) => void;
  
  // Dialog controls
  open: () => void;
  close: () => void;
  
  // Reset filters
  reset: () => void;
  
  // Get active filter count
  getActiveFilterCount: () => number;
}

const initialFilters: SearchFilters = {
  minPrice: undefined,
  maxPrice: undefined,
  bedroomCount: undefined,
  bedCount: undefined,
  bathroomCount: undefined,
  privacyTypeIds: [],
  categoryIds: [],
  amenityIds: [],
  hostTypes: [],
  instantBook: undefined,
  selfCheckIn: undefined,
  stepFreeAccess: undefined,
};

const useSearchFilterStore = create<SearchFilterStore>((set, get) => ({
  filters: initialFilters,
  isOpen: false,

  setMinPrice: (price) => set((state) => ({ 
    filters: { ...state.filters, minPrice: price } 
  })),
  
  setMaxPrice: (price) => set((state) => ({ 
    filters: { ...state.filters, maxPrice: price } 
  })),
  
  setBedroomCount: (count) => set((state) => ({ 
    filters: { ...state.filters, bedroomCount: count } 
  })),
  
  setBedCount: (count) => set((state) => ({ 
    filters: { ...state.filters, bedCount: count } 
  })),
  
  setBathroomCount: (count) => set((state) => ({ 
    filters: { ...state.filters, bathroomCount: count } 
  })),
  
  setPrivacyTypeIds: (ids) => set((state) => ({ 
    filters: { ...state.filters, privacyTypeIds: ids } 
  })),
  
  setCategoryIds: (ids) => set((state) => ({ 
    filters: { ...state.filters, categoryIds: ids } 
  })),
  
  setAmenityIds: (ids) => set((state) => ({ 
    filters: { ...state.filters, amenityIds: ids } 
  })),
  
  setHostTypes: (types) => set((state) => ({ 
    filters: { ...state.filters, hostTypes: types } 
  })),
  
  setInstantBook: (value) => set((state) => ({ 
    filters: { ...state.filters, instantBook: value } 
  })),
  
  setSelfCheckIn: (value) => set((state) => ({ 
    filters: { ...state.filters, selfCheckIn: value } 
  })),
  
  setStepFreeAccess: (value) => set((state) => ({ 
    filters: { ...state.filters, stepFreeAccess: value } 
  })),

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),

  reset: () => set({ filters: initialFilters }),

  getActiveFilterCount: () => {
    const { filters } = get();
    let count = 0;
    
    if (filters.minPrice !== undefined) count++;
    if (filters.maxPrice !== undefined) count++;
    if (filters.bedroomCount !== undefined && filters.bedroomCount > 0) count++;
    if (filters.bedCount !== undefined && filters.bedCount > 0) count++;
    if (filters.bathroomCount !== undefined && filters.bathroomCount > 0) count++;
    if (filters.privacyTypeIds && filters.privacyTypeIds.length > 0) count++;
    if (filters.categoryIds && filters.categoryIds.length > 0) count++;
    if (filters.amenityIds && filters.amenityIds.length > 0) count++;
    if (filters.hostTypes && filters.hostTypes.length > 0) count++;
    if (filters.instantBook === true) count++;
    if (filters.selfCheckIn === true) count++;
    if (filters.stepFreeAccess === true) count++;
    
    return count;
  },
}));

export default useSearchFilterStore;
