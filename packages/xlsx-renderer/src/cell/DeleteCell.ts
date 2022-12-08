import { Cell, ValueType } from '@s360-utils/exceljs';

import { Scope } from '../Scope';
import { BaseCell } from './BaseCell';

export class DeleteCell extends BaseCell {
  public static override match(cell: Cell): boolean {
    return (
      cell &&
      cell.type === ValueType.String &&
      typeof cell.value === 'string' &&
      cell.value.substring(0, 9) === '#! DELETE'
    );
  }

  public override apply(scope: Scope): DeleteCell {
    super.apply(scope);

    const target = scope.getCurrentTemplateString().split(' ')[2];

    if (target !== undefined) {
      scope.vm[target] = undefined;
    }

    scope.setCurrentOutputValue(null);
    scope.incrementCol();

    return this;
  }
}
