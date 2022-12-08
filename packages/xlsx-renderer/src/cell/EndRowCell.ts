import { Cell, ValueType } from '@s360-utils/exceljs';

import { Scope } from '../Scope';
import { BaseCell } from './BaseCell';

export class EndRowCell extends BaseCell {
  public static override match(cell: Cell): boolean {
    return (
      cell &&
      cell.type === ValueType.String &&
      typeof cell.value === 'string' &&
      cell.value === '#! END_ROW'
    );
  }

  public override apply(scope: Scope): EndRowCell {
    super.apply(scope);

    scope.setCurrentOutputValue(null);
    scope.incrementRow();

    return this;
  }
}
