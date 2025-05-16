export interface CreateKbRequest {
  defaultChunkSize: number;
  defaultParseMethod: string;
  description: string;
  docTypes: string[];
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
  page_number: number;
  page_size: number;
  [property: string]: any;
}

export interface DocListRequest {
  chunk_size_order?: string;
  created_time_order?: string;
  document_type?: string;
  kb_id: string;
  name?: string;
  page_number: number;
  page_size: number;
  parse_status?: string;
  [property: string]: any;
}

export interface DocRenameRequest {
  chunk_size: number;
  document_type: object;
  id: string;
  name: string;
  [property: string]: any;
}

export interface DocDownload {
  id: string;
  name: string;
}

export interface ChunkRequest {
  document_id: string;
  page_number: number;
  page_size: number;
  text?: string;
  [property: string]: any;
}
