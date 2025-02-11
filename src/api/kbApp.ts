import request from "@/utils/request";
import { CreateKbRequest, QueryKbRequest, UpdateKbRequest } from "./apiType";
import { ModelForm } from "@/components/UserHeaderBar/modelConfig";

class KbAppAPI {
  /** 获取用户所有知识库*/
  static getKbLibrary(data: QueryKbRequest) {
    return request({
      url: `/kb/list`,
      method: "post",
      data: data,
    });
  }

  /** 删除用户知识库*/
  static delKbLibrary(data: { id: string; task_id: string }) {
    return request({
      url: `/kb/rm`,
      method: "post",
      data: data,
    });
  }

  /** 创建用户知识库*/
  static createKbLibrary(data: CreateKbRequest) {
    return request({
      url: `/kb/create`,
      method: "post",
      data: data,
    });
  }

  /**更新资产库 */
  static updateKbLibrary(data: UpdateKbRequest) {
    return request({
      url: `/kb/update`,
      method: "post",
      data: data,
    });
  }

  /** 获取导入知识库状态*/
  static queryKbTaskList(data: {
    types: any[];
    page_size: number;
    page_number: number;
  }) {
    return request({
      url: `/kb/task/list`,
      method: "post",
      data: data,
    });
  }

  static stopKbTaskList(data: { task_id?: string; types?: any[] }) {
    return request({
      url: `/kb/task/rm`,
      method: "post",
      data: data,
    });
  }

  /**导入资产库 */
  static importKbLibrary(payload: { data: any }, options: any) {
    return request({
      url: `/kb/import`,
      method: "post",
      data: payload.data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress(e) {
        const rate = Math.floor((e.loaded / (e.total as number)) * 100);
        if (rate < 100) {
          options.onProgress(rate);
        }
      },
    });
  }

  /**打包资产库 */

  static savebLibrary(id: string, options: any) {
    return request({
      url: `/kb/export`,
      data: {
        id,
      },
      method: "post",
      onUploadProgress(e) {
        const rate = Math.floor((e.loaded / (e.total as number)) * 100);
        if (rate < 100) {
          options.onProgress(rate);
        }
      },
    });
  }

  /**导出资产库 */
  static exportbLibrary(fileId: string) {
    return request({
      url: `/kb/download`,
      data: {
        id: fileId,
      },
      method: "post",
    });
  }

  static queryLanguageList() {
    return request({
      url: `/kb/language`,
      method: "get",
    });
  }

  static queryEmbeddingModelList() {
    return request({
      url: `/other/embedding_model`,
      method: "get",
    });
  }

  static queryParseMethodList() {
    return request({
      url: `/other/parse_method`,
      method: "get",
    });
  }

  /** 是否启用文件*/
  static addUserModel(data: ModelForm) {
    return request({
      url: `/model/update`,
      method: "post",
      data: data,
    });
  }

  static getdUserModel() {
    return request({
      url: `/model/get`,
      method: "get",
    });
  }
}

export default KbAppAPI;
