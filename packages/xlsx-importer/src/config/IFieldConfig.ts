import { ValueMapper } from '../abstracts/ValueMapper';

export interface IFieldConfig {
  row: number;
  col: number | string;
  key: string;
  mapper?: ValueMapper<any>;
}
