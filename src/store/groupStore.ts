import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

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
    getGroupColorById: (id: number) => string | null | undefined;
  };
}

const groupStore = create<GroupStore>()(
  devtools((set, get) => ({
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
      getGroupColorById: (id: number) => {
        const group = get().groups.find(
          (groupItem: Group) => groupItem.groupId === id
        );
        return group?.color;
      },
    },
  }))
);

export const useSelectedGroupId = () =>
  groupStore(state => state.selectedGroup);

export const useGroups = () => groupStore(state => state.groups);

export const useSelectedGroupIdActions = () =>
  groupStore(state => state.actions);
