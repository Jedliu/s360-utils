import { Worksheet } from '@s360-utils/exceljs';

import { IColumnConfig } from '../config';
import { IListHeaderSourceConfig } from '../config/IListHeaderSourceConfig';
import { ISourceConfig } from '../config/ISourceConfig';
import { MAPPER_DEFAULT } from '../mappers';
import { ImportStrategy } from './ImportStrategy';

export const listHeaderVerticalStrategy: ImportStrategy = <T>(
  cfg: ISourceConfig,
  ws: Worksheet
): T[] => {
  const listCfg = cfg as IListHeaderSourceConfig;
  const result: T[] = [];
  let count = 0;
  const row = ws.getRow(listCfg.headerRowIndex);
  const rowMappings: IColumnConfig[] = [];
  const stopOnEmptyColumn = listCfg.stopOnEmptyColumn;

  for (let i = 1; i <= ws.columnCount; i++) {
    listCfg.headers.forEach((header) => {
      const cellValue = row.getCell(i).text;
      if (cellValue && header.title) {
        if (
          (listCfg.exactMatch && cellValue == header.title) ||
          (!listCfg.exactMatch &&
            cellValue.toLowerCase().indexOf(header.title.toLowerCase()) >= 0)
        ) {
          rowMappings.push({
            key: header.key,
            index: i,
            mapper: header.mapper,
          });
        }
      }
    });
  }
  for (let j = listCfg.headerRowIndex + 1; j <= ws.rowCount; j++) {
    const item: { [id: string]: any } = {};

    count++;
    if (listCfg.rowCount && count > listCfg.rowCount) break;

    rowMappings.forEach((rowMapping) => {
      const mapper = rowMapping.mapper || MAPPER_DEFAULT;
      item[rowMapping.key] = mapper(
        ws.getRow(j).getCell(rowMapping.index).text
      );
    });

    // when stopOnEmptyColumn is set
    // stops when it is empty on certain row
    // to avoid empty row
    if (stopOnEmptyColumn && (item[stopOnEmptyColumn] as string).trim() === '')
      break;

    result.push(item as T);
  }
  return result as T[];
};
