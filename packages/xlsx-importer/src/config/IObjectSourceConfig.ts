import { IFieldConfig } from './IFieldConfig';
import { ISourceConfig } from './ISourceConfig';

export interface IObjectSourceConfig extends ISourceConfig {
  fields: IFieldConfig[];
}
