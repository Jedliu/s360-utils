import { ValueMapper } from '../abstracts/ValueMapper';

export interface IColumnConfig {
  index: number;
  key: string;
  mapper?: ValueMapper<any>;
}
