import { ImportType } from './ImportType';

export interface ISourceConfig {
  type?: ImportType | string;
  worksheet?: string | number;
}
