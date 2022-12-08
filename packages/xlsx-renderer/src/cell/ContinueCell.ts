import { Cell, ValueType } from '@s360-utils/exceljs';

import { Scope } from '../Scope';
import { ForEachCell } from './ForEachCell';

export class ContinueCell extends ForEachCell {
  public static override match(cell: Cell): boolean {
    return (
      cell &&
      cell.type === ValueType.String &&
      typeof cell.value === 'string' &&
      cell.value.substring(0, 11) === '#! CONTINUE'
    );
  }

  public override getSourceParam(scope: Scope): string {
    const target = ForEachCell.getTargetParam(scope);

    return scope.vm[target] && scope.vm[target].__from;
  }
}
