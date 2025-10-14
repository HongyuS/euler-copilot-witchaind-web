import request from '@/utils/request';

class GroupAPI {
  /** 团队列表接口*/
  static teamList(data: any) {
    return request({
      url: `/team/list`,
      method: 'post',
      data,
    });
  }

  /** 新建团队接口*/
  static createTeam(data: any) {
    return request({
      url: `/team`,
      method: 'post',
      data,
    });
  }

  /** 更新团队信息接口*/
  static updateTeam(params: any, data: any) {
    return request({
      url: `/team`,
      method: 'put',
      params,
      data,
    });
  }

  /** 解散团队接口*/
  static deleteTeam(data: { teamId: string }) {
    return request({
      url: `/team`,
      method: 'delete',
      params: data,
    });
  }

  /** 获取团队用户列表接口*/
  static getTeamUsers(data: {
    teamId: string;
    userSub?: string;
    userName?: string;
    page: number;
    pageSize: number;
  }) {
    return request({
      url: `/team/usr`,
      method: 'post',
      data,
    });
  }

  /** 获取团队消息/动态接口*/
  static getTeamMessages(data: {
    teamId: string;
    page: number;
    pageSize: number;
    language: string;
  }) {
    return request({
      url: `/team/msg`,
      method: 'post',
      data,
    });
  }

  /** 获取当前用户角色信息接口*/
  static getCurrentUserRole(teamId: string) {
    return request({
      url: `/role`,
      method: 'get',
      params: { teamId },
    });
  }

  /** 获取角色列表接口*/
  static getRoleList(data: {
    teamId: string;
    isEditable: boolean;
    page: number;
    pageSize: number;
    language: string;
  }) {
    return request({
      url: `/role/list`,
      method: 'post',
      data,
    });
  }

  /** 获取角色权限操作列表接口*/
  static getRoleActions(language?: string) {
    return request({
      url: `/role/action`,
      method: 'get',
      params: language ? { language } : undefined,
    });
  }

  /** 创建角色接口*/
  static createRole(data: {
    roleName: string;
    actions: string[];
  }, teamId: string) {
    return request({
      url: `/role`,
      method: 'post',
      params: { teamId },
      data,
    });
  }

  /** 更新角色接口*/
  static updateRole(data: {
    roleName: string;
    actions: string[];
  }, roleId: string) {
    return request({
      url: `/role`,
      method: 'put',
      params: { roleId },
      data,
    });
  }

  /** 删除角色接口*/
  static deleteRole(roleId: string) {
    return request({
      url: `/role`,
      method: 'delete',
      params: { roleId },
    });
  }

  /** 批量删除角色接口*/
  static batchDeleteRoles(roleIds: string[]) {
    // 如果后端支持批量删除，可以使用这个接口
    // 否则前端循环调用单个删除接口
    const deletePromises = roleIds.map(roleId => this.deleteRole(roleId));
    return Promise.all(deletePromises);
  }

  /** 删除团队成员接口*/
  static deleteTeamMember(data: {
    teamId: string;
    userSub: string;
  }) {
    return request({
      url: `/team/usr`,
      method: 'delete',
      data,
    });
  }

  /** 批量删除团队成员接口*/
  static batchDeleteTeamMembers(data: {
    teamId: string;
    userSubs: string[];
  }) {
    return request({
      url: `/team/usr/batch`,
      method: 'delete',
      data,
    });
  }

  /** 更新团队成员角色接口*/
  static updateMemberRole(data: {
    teamId: string;
    targetUserSub: string;
    roleId: string;
  }) {
    return request({
      url: `/team/usr/role`,
      method: 'put',
      data,
    });
  }

  /** 邀请团队成员接口*/
  static inviteMembers(data: {
    teamId: string;
    members: Array<{
      userSub: string;
      roleName: string;
    }>;
  }) {
    return request({
      url: `/team/usr/invite`,
      method: 'post',
      data,
    });
  }

  /** 移交团队所有权接口*/
  static transferTeamOwnership(data: {
    teamId: string;
    newOwnerUserSub: string;
  }) {
    return request({
      url: `/team/transfer`,
      method: 'post',
      data,
    });
  }

  /** 获取用户列表接口（用于邀请成员）*/
  static getUserList(data: {
    userSub?: string;
    userName?: string;
    page: number;
    pageSize: number;
  }) {
    return request({
      url: `/user/list`,
      method: 'post',
      data,
    });
  }
}

export default GroupAPI;
