import { Cell, ValueType } from '@s360-utils/exceljs';

import { Scope } from '../Scope';
import { BaseCell } from './BaseCell';

export class NormalCell extends BaseCell {
  /**
   * @inheritDoc
   * @param {Cell} cell
   * @returns {boolean}
   */
  public static override match(cell: Cell): boolean {
    return (
      cell &&
      cell.type === ValueType.String &&
      typeof cell.value === 'string' &&
      !['##', '#!', '#=', '#`'].includes(cell.value.substring(0, 2)) // todo documentation: describe prefixes in a documentation
    );
  }

  /**
   * @inheritDoc
   * @param {Scope} scope
   * @returns {NormalCell}
   */
  public override apply(scope: Scope): NormalCell {
    super.apply(scope);

    scope.incrementCol();

    return this;
  }
}
