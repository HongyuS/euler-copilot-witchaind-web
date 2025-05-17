export interface CreateKbRequest {
  defaultChunkSize: number;
  defaultParseMethod: string;
  description: string;
  docTypes: any[];
  embeddingModel: string;
  kbName: string;
  [property: string]: any;
}

export interface UpdateKbRequest {
  defaultChunkSize: number;
  defaultParseMethod: string;
  description: string;
  docTypes: object[];
  embeddingModel: string;
  teamId?: string;
  kbName: string;
  [property: string]: any;
}

export interface QueryKbRequest {
  created_time_order?: string;
  document_count_order?: string;
  name?: string;
  page: number;
  pageSize: number;
  [property: string]: any;
}

export interface DocListRequest {
  chunk_size_order?: string;
  created_time_order?: string;
  document_type?: string;
  kbId: string;
  name?: string;
  page: number;
  pageSize: number;
  parse_status?: string;
  [property: string]: any;
}

export interface DocRenameRequest {
  chunkSize?: number;
  docTypeId?: string;
  docId?: string;
  docName?: string;
  [property: string]: any;
}

export interface DocDownload {
  id: string;
  name: string;
}

export interface ChunkRequest {
  docId: string;
  page: number;
  pageSize: number;
  text?: string;
  type?: string;
  [property: string]: any;
}
