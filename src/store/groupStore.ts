import { create } from 'zustand';

interface GroupStore {
  selectedGroup: number;
  actions: {
    setGroupId: (id: number) => void;
  };
}

const groupStore = create<GroupStore>()(set => ({
  selectedGroup: 1,
  actions: {
    setGroupId: (id: number) => {
      set({ selectedGroup: id });
    },
  },
}));

export const useSelectedGroupId = () =>
  groupStore(state => state.selectedGroup);

export const useSelectedGroupIdActions = () =>
  groupStore(state => state.actions);
