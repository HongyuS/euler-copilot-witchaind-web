import request from "@/utils/request";
import {
  ChunkRequest,
  DocDownload,
  DocListRequest,
  DocRenameRequest,
} from "./apiType";

class KfAppAPI {
  /** 获取资产库里的文件*/
  static getKbLibraryFile(data: DocListRequest) {
    return request({
      url: `/doc/list`,
      method: "post",
      data: data,
    });
  }
  /** 修改资产库里的文件*/
  static updateLibraryFile(data: DocRenameRequest) {
    return request({
      url: `/doc/update`,
      method: "post",
      data: data,
    });
  }

  /** 是否启用文件*/
  static switchLibraryFile(data: { enabled: boolean; id: string }) {
    return request({
      url: `/doc/switch`,
      method: "post",
      data: data,
    });
  }

  /** 是否删除文件*/
  static delLibraryFile(data: { ids: any[] }) {
    return request({
      url: `/doc/rm`,
      method: "post",
      data: data,
    });
  }

  /** 是否重启/取消文件*/
  static runLibraryFile(data: { ids: string[]; run: string }) {
    return request({
      url: `/doc/run`,
      method: "post",
      data: data,
    });
  }

  /**导入资产库文档 */
  static importKbLibraryFile(
    payload: { data: any; params: any },
    options: any
  ) {
    return request({
      url: `/doc/upload?kb_id=${payload.params.kb_id}`,
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

  /** 下载文件*/
  static downloadLibraryFile(data: { ids: string[] }) {
    return request({
      url: `/doc/download`,
      method: "post",
      data: data,
    });
  }

  /** 获取导入知识库状态*/
  static queryKfTaskList(data: { type: string }) {
    return request({
      url: `/doc/task/list`,
      method: "post",
      data: data,
    });
  }

  static stopKfTaskList(data: { id: string }) {
    return request({
      url: `/doc/task/stop`,
      method: "post",
      data: data,
    });
  }

  /** 查询文档预览内容*/
  static chunkLibraryFile(data: ChunkRequest) {
    return request({
      url: `/chunk/list`,
      method: "post",
      data: data,
    });
  }

  /** 是否启用文件*/
  static switchLibraryFileSection(data: {
    enabled: boolean;
    ids: string[];
    document_id: string;
  }) {
    return request({
      url: `/chunk/switch`,
      method: "post",
      data: data,
    });
  }
}

export default KfAppAPI;
