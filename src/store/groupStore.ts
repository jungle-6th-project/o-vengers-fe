import { create } from 'zustand';

interface Group {
  groupId: number;
  groupName: string;
  color: string | null;
  path: string;
  secret: boolean;
}

interface GroupStore {
  groups: Group[];
  selectedGroup: number;
  actions: {
    setGroupId: (id: number) => void;
    setGroup: (groups: Group[]) => void;
    getGroupNameById: (id: number) => string | undefined;
  };
}

const groupStore = create<GroupStore>()((set, get) => ({
  groups: [],
  selectedGroup: 1,
  actions: {
    setGroupId: (id: number) => {
      set({ selectedGroup: id });
    },
    setGroup: (groups: Group[]) => {
      set({ groups });
    },
    getGroupNameById: (id: number) => {
      const group = get().groups.find(
        (groupItem: Group) => groupItem.groupId === id
      );
      return group?.groupName;
    },
  },
}));

export const useSelectedGroupId = () =>
  groupStore(state => state.selectedGroup);

export const useGroups = () => groupStore(state => state.groups);

export const useSelectedGroupIdActions = () =>
  groupStore(state => state.actions);
