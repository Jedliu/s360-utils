import { Worksheet } from '@s360-utils/exceljs';

import { IObjectSourceConfig } from '../config/IObjectSourceConfig';
import { ISourceConfig } from '../config/ISourceConfig';
import { MAPPER_DEFAULT } from '../mappers';
import { ImportStrategy } from './ImportStrategy';

export const singleObjectStrategy: ImportStrategy = <T>(
  cfg: ISourceConfig,
  ws: Worksheet
): T[] => {
  const objectCfg = cfg as IObjectSourceConfig;

  const singleton: { [id: string]: any } = {};

  objectCfg.fields.forEach((fieldCfg) => {
    const mapper = fieldCfg.mapper || MAPPER_DEFAULT;
    singleton[fieldCfg.key] = mapper(
      typeof fieldCfg.col == 'number'
        ? ws.getCell(fieldCfg.row, fieldCfg.col).text
        : ws.getCell(fieldCfg.col + '' + fieldCfg.row).text
    );
  });

  return [singleton as T];
};
