export interface searchPaylodInterface {
  name?: string;
  document_type_list?: string[];
  chunk_size_order?: string;
  created_time_order?: string;
  parse_status?: string[];
  created_time_start?: string;
  created_time_end?: string;
  enabled?: string;
  [property: string]: any;
}

export interface FileForm {
  chunk_size: number;
  type_id: string;
  id: string;
  name: string;
  [property: string]: any;
}

export interface DocumentType {
  id: string;
  type: string;
  [property: string]: any;
}
