import { store } from '@/store';

export const useGroupStore = defineStore(
  'group',
  () => {
    let navGroup = ref([{ name: '数据治理', path: '/group', query: {} }]);
    let groupMenu = ref('knowledge');

    let handleSwitchMenu = (menu: string) => {
      groupMenu.value = menu;
    };
    let delNav = (value: number) => {
      navGroup.value.splice(value);
    };
    return {
      navGroup,
      groupMenu,
      handleSwitchMenu,
      delNav,
    };
  },
  {
    // 持久化存储
    persist: {
      key: 'group_data',
      storage: sessionStorage,
      pick: ['navGroup', 'groupMenu'],
    },
  }
);

export function useGroupStoreHook() {
  return useGroupStore(store);
}
