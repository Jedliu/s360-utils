import { ValueMapper } from '../abstracts/ValueMapper';

export interface IColumnHeaderConfig {
  key: string;
  title: string;
  mapper?: ValueMapper<any>;
}
