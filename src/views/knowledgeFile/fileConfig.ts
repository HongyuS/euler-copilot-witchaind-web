export interface searchPaylodInterface {
  name?: string;
  docTypes?: string[];
  chunk_size_order?: string;
  created_time_order?: string;
  parse_status?: string[];
  created_time_start?: string;
  created_time_end?: string;
  enabled?: string;
  [property: string]: any;
}

export interface FileForm {
  chunkSize: number;
  docTypeId: string;
  docId: string;
  docName: string;
  [property: string]: any;
}

export interface DocumentType {
  id: string;
  type: string;
  [property: string]: any;
}
