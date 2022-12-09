import { Worksheet } from '@s360-utils/exceljs';

import { ISourceConfig } from '../config/ISourceConfig';

export type ImportStrategy = <T>(cfg: ISourceConfig, ws: Worksheet) => T[];
