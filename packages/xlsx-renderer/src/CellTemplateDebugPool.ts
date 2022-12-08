import { Cell } from '@s360-utils/exceljs';

import { BaseCell } from './cell/BaseCell';
import { CellTemplatePool } from './CellTemplatePool';
/* tslint:disable:no-console */
export class CellTemplateDebugPool extends CellTemplatePool {
  /**
   * do normal match and log in console result.
   */
  public override match(cell: Cell): BaseCell {
    const result = super.match(cell);

    console.log(cell?.fullAddress, result, cell?.value);

    return result;
  }
}
