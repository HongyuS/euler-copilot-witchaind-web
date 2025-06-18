import request from '@/utils/request';

class EvaluateAPI {
  /** 评测列表接口*/
  static testingList(data: any) {
    return request({
      url: `/testing/list`,
      method: 'post',
      data,
    });
  }

  /** 新建评测接口*/
  static createTesting(data: any) {
    return request({
      url: `/testing`,
      method: 'post',
      data,
    });
  }

  /** 更新评测信息接口*/
  static updateTesting(params: any, data: any) {
    return request({
      url: `/testing`,
      method: 'put',
      params,
      data,
    });
  }

  /** 删除评测接口*/
  static deleteTesting(data: string[]) {
    return request({
      url: `/testing`,
      method: 'delete',
      data: data,
    });
  }

  /** 评测用例详情接口*/
  static testingCase(data: { testingId: string; page: number; pageSize: number }) {
    return request({
      url: `/testing/testcase`,
      method: 'post',
      data,
    });
  }

  /** 重启测试接口*/
  static runTesting(data: { testingId: string; run: boolean }) {
    return request({
      url: `/testing/run`,
      method: 'post',
      params: data,
    });
  }
}

export default EvaluateAPI;
