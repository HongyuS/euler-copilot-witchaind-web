export interface ModelForm {
  max_tokens?: number;
  model_name?: string;
  openai_api_base?: string;
  openai_api_key?: string;
  [property: string]: any;
}
