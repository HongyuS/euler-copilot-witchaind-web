import request from '@/utils/request';
import qs from 'qs';

class dataSetAPI {
  // 获取数据集管理数据
  static queryDataSetList(data: any) {
    return request({
      url: `/dataset/list`,
      method: 'post',
      data,
    });
  }

  /** 创建数据集管理 */
  static createDataSet(data: any) {
    return request({
      url: `/dataset`,
      method: 'post',
      data,
    });
  }

  /** 删除数据集管理*/
  static delDataSet(data: string[]) {
    return request({
      url: `/dataset`,
      method: 'delete',
      data,
    });
  }

  /**更新数据集管理 */
  static updateDataSet(
    params: { databaseId: string },
    data: { datasetName?: string; description?: string }
  ) {
    return request({
      url: `/dataset`,
      method: 'put',
      params,
      data,
    });
  }

  /**获取单个数据集的详情数据 */
  static querySingleDataSetInfo(data: any) {
    return request({
      url: `/dataset/data`,
      method: 'post',
      data,
    });
  }
  /**更新数据集内的详情数据 */
  static updateDataSetInfo(params: { dataId: string }, data: { answer: string; question: string }) {
    return request({
      url: `/dataset/data`,
      method: 'put',
      params,
      data,
    });
  }
  /**删除数据集内的问答数据 */
  static deleteDataInfo(data: any) {
    return request({
      url: `/dataset/data`,
      method: 'delete',
      data,
    });
  }

  /**获取数据集任务状态 */
  static queryDataSetTask() {
    return request({
      url: `/dataset/task`,
      method: 'get',
    });
  }

  /** 下载数据集 */
  static downloadDataSet(taskId: string) {
    return request({
      url: `/dataset/download`,
      method: 'get',
      data: { taskId },
    });
  }

  /**生成数据集 */
  static generateDataSet(data: any) {
    return request({
      url: `/dataset/generate`,
      method: 'post',
      params: data,
    });
  }

  /**导入数据集 */
  static importDataSet(payload: { data: any; params: any }, options: any) {
    return request({
      url: `/dataset/import?kbId=${payload.params.kbId}`,
      method: 'post',
      data: payload.data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress(e) {
        const rate = Math.floor((e.loaded / (e.total as number)) * 100);
        if (rate < 100) {
          options.onProgress(rate);
        }
      },
    });
  }

  /** 导出数据集*/
  static saveDataSet(datasetIds: string[], options: any) {
    return request({
      url: `/dataset/export`,
      method: 'post',
      params: { datasetIds },
      paramsSerializer: (params) => qs.stringify(params, { indices: false }),
      onUploadProgress(e) {
        const rate = Math.floor((e.loaded / (e.total as number)) * 100);
        if (rate < 100) {
          options.onProgress(rate);
        }
      },
    });
  }

  static queryLlmData() {
    return request({
      url: `/other/llm`,
      method: 'get',
    });
  }

  static isHaveTesting(params: { datasetId: string }) {
    return request({
      url: '/dataset/testing/exist',
      method: 'get',
      params,
    });
  }
}

export default dataSetAPI;
