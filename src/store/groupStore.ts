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
    setGroupColorById: (id: number, color: string) => void;
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
      const updatedGroups = groups.map(group => {
        if (group.color === null) {
          return { ...group, color: 'accent' };
        }
        return group;
      });
      set({ groups: updatedGroups });
    },
    getGroupNameById: (id: number) => {
      const group = get().groups.find(
        (groupItem: Group) => groupItem.groupId === id
      );
      return group?.groupName;
    },
    setGroupColorById: (id: number, color: string) => {
      const groupIndex = get().groups.findIndex(
        (groupItem: Group) => groupItem.groupId === id
      );

      if (groupIndex !== -1) {
        const newGroups = [...get().groups];
        newGroups[groupIndex] = {
          ...newGroups[groupIndex],
          color,
        };
        set({ groups: newGroups });
      }
    },
  },
}));

export const useSelectedGroupId = () =>
  groupStore(state => state.selectedGroup);

export const useGroups = () => groupStore(state => state.groups);

export const useSelectedGroupIdActions = () =>
  groupStore(state => state.actions);

export const useGroupColor = (id: number) =>
  groupStore(state => {
    const group = state.groups.find(groupItem => groupItem.groupId === id);
    return group?.color;
  });
