import { IColumnHeaderConfig } from './IColumnHeaderConfig';
import { ISourceConfig } from './ISourceConfig';

export interface IListHeaderSourceConfig extends ISourceConfig {
  headers: IColumnHeaderConfig[];
  headerRowIndex: number;
  rowCount?: number;
  exactMatch?: boolean;
  stopOnEmptyColumn?: string;
}
