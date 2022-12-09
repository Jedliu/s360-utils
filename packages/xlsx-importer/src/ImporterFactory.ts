import { Buffer, Workbook } from '@s360-utils/exceljs';

import { IImporter } from './IImporter';
import { Importer } from './Importer';

export class ImporterFactory {
  public async from(path: string): Promise<IImporter> {
    const wb = new Workbook();
    await wb.xlsx.readFile(path);
    return new Importer(wb);
  }

  public async fromBuffer(buffer: Buffer): Promise<IImporter> {
    const wb = new Workbook();
    await wb.xlsx.load(buffer);
    return new Importer(wb);
  }
}
