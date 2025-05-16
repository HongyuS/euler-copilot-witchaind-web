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
}

export default GroupAPI;
