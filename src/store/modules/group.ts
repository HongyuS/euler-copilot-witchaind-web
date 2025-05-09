import { store } from '@/store';

interface TeamList {
  teamId: string;
  teamName: string;
  description: string;
  authorName: string;
  memberCount: string;
  isPublic: boolean;
}

export const useGroupStore = defineStore(
  'group',
  () => {
    let navGroup = ref([{ name: '数据治理', path: '/group', query: {} }]);
    let groupMenu = ref('knowledge');
    let knowledgeTabActive = ref('document');
    let curTeamInfo: Ref<TeamList> = ref({
      teamId: '',
      teamName: '',
      description: '',
      authorName: '',
      memberCount: '',
      isPublic: false,
    });

    let handleSwitchMenu = (menu: string) => {
      groupMenu.value = menu;
    };
    let delNav = (value: number) => {
      navGroup.value.splice(value);
    };
    let handleKnowledgeTab = (key: string) => {
      knowledgeTabActive.value = key;
    };
    let setCurTeamInfo = (value: any) => {
      curTeamInfo.value = value;
    };
    return {
      navGroup,
      groupMenu,
      knowledgeTabActive,
      curTeamInfo,
      handleSwitchMenu,
      delNav,
      handleKnowledgeTab,
      setCurTeamInfo,
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
