import { create } from "zustand";

type PlannerState = {
  selectedStateId: string | null;
  selectedStateName: string | null;
  selectedPlaceIds: string[];
  setSelectedState: (id: string, name: string) => void;
  toggleSelectedPlace: (placeId: string) => void;
  setInitialPlaces: (placeIds: string[]) => void;
  resetState: () => void;
};

export const usePlannerStore = create<PlannerState>((set) => ({
  selectedStateId: null,
  selectedStateName: null,
  selectedPlaceIds: [],
  setSelectedState: (id, name) =>
    set({ selectedStateId: id, selectedStateName: name, selectedPlaceIds: [] }),
  toggleSelectedPlace: (placeId) =>
    set((state) => ({
      selectedPlaceIds: state.selectedPlaceIds.includes(placeId)
        ? state.selectedPlaceIds.filter((id) => id !== placeId)
        : [...state.selectedPlaceIds, placeId],
    })),
  setInitialPlaces: (placeIds) => set({ selectedPlaceIds: placeIds }),
  resetState: () =>
    set({
      selectedStateId: null,
      selectedStateName: null,
      selectedPlaceIds: [],
    }),
}));
