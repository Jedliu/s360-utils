import { IColumnConfig } from './IColumnConfig';
import { ISourceConfig } from './ISourceConfig';

export interface IListSourceConfig extends ISourceConfig {
  columns: IColumnConfig[];
  rowOffset: number;
  rowCount?: number;
}
