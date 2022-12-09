import { Workbook } from '@s360-utils/exceljs';

import { IMPORT_TYPE_DEFAULT, ImportType } from './config/ImportType';
import { ISourceConfig } from './config/ISourceConfig';
import { IImporter } from './IImporter';
import { getStrategyByType } from './strategies';

export class Importer implements IImporter {
  constructor(private wb: Workbook) {}

  public getAllItems<T>(config: ISourceConfig): T[] {
    const { worksheet } = config;
    const type = (config.type as ImportType) || IMPORT_TYPE_DEFAULT;
    const ws = this.wb.getWorksheet(worksheet ?? 1);

    if (!ws) throw new Error(`Worksheet '${worksheet}' not found`);

    return getStrategyByType(type)(config, ws);
  }

  public getFirstItem<T>(config: ISourceConfig): T {
    const wsData: T[] = this.getAllItems(config);
    return wsData[0];
  }
}
