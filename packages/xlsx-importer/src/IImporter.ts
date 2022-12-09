import { ISourceConfig } from './config/ISourceConfig';

export interface IImporter {
  getAllItems<T>(config: ISourceConfig): T[];
  getFirstItem<T>(config: ISourceConfig): T;
}
