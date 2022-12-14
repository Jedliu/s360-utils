import { Worksheet } from '@s360-utils/exceljs';

import { IListSourceConfig } from '../config/IListSourceConfig';
import { ISourceConfig } from '../config/ISourceConfig';
import { MAPPER_DEFAULT } from '../mappers';
import { ImportStrategy } from './ImportStrategy';

export const listVerticalStrategy: ImportStrategy = <T>(
  cfg: ISourceConfig,
  ws: Worksheet
): T[] => {
  const listCfg = cfg as IListSourceConfig;
  const result: T[] = [];
  let count = 0;
  ws.eachRow((row, i) => {
    if (i <= listCfg.rowOffset) {
      return;
    }

    count++;
    if (listCfg.rowCount && count > listCfg.rowCount) {
      return;
    }

    const item: { [id: string]: any } = {};

    listCfg.columns.forEach((colCfg) => {
      const mapper = colCfg.mapper || MAPPER_DEFAULT;
      item[colCfg.key] = mapper(row.getCell(colCfg.index).text);
    });

    result.push(item as T);
  });
  return result as T[];
};
