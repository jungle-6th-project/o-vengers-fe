import { create } from 'zustand';
import { shallow } from 'zustand/shallow';

interface Group {
  groupId: number;
  groupName: string;
  color: string | null;
  path: string;
  secret: boolean;
}

interface GroupStore {
  groups: { [id: string]: Group };
  selectedGroupId: number;
  actions: {
    setSelectedGroupId: (id: number) => void;
    setGroup: (groups: Group[]) => void;
    getGroupNameById: (id: number) => string | undefined;
    setGroupColorById: (id: number, color: string) => void;
  };
}

const groupStore = create<GroupStore>()((set, get) => ({
  groups: {},
  selectedGroupId: 1,
  actions: {
    setSelectedGroupId: (id: number) => {
      set({ selectedGroupId: id });
    },
    setGroup: (groups: Group[]) => {
      const updatedGroups = Object.fromEntries(
        Object.entries(groups).map(([, group]) => {
          return [`${group.groupId}`, group];
        })
      );
      set({ groups: updatedGroups });
    },
    getGroupNameById: (id: number) => {
      const group = get().groups[`${id}`];
      return group?.groupName;
    },
    setGroupColorById: (id: number, color: string) => {
      const group = get().groups[`${id}`];
      if (group) {
        set(state => {
          return {
            groups: { ...state.groups, [`${id}`]: { ...group, color } },
          };
        });
      }
    },
  },
}));

export const useSelectedGroupId = () =>
  groupStore(state => state.selectedGroupId);

export const useGroups = () => groupStore(state => state.groups);
export const useGroup = (id: number) =>
  groupStore(state => state.groups[`${id}`]);
export const useGroupColor = (id: number) =>
  groupStore(state => state.groups[`${id}`]?.color);
export const useSelectedGroupIdActions = () =>
  groupStore(state => state.actions, shallow);
