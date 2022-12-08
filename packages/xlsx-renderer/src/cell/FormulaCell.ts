import { Cell, CellFormulaValue, ValueType } from '@s360-utils/exceljs';

import { Scope } from '../Scope';
import { BaseCell } from './BaseCell';

export class FormulaCell extends BaseCell {
  public static override match(cell: Cell): boolean {
    return cell && cell.type === ValueType.Formula;
  }

  public override apply(scope: Scope): FormulaCell {
    super.apply(scope);

    const shift = scope.outputCell.r - scope.templateCell.r;

    const regex = /([a-zA-Z]+)([1-9][0-9]*)/g;
    const value = scope.getCurrentTemplateValue() as CellFormulaValue;
    let formula = value.formula;

    // todo extract method match addresses
    const addresses = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const matches = regex.exec(formula);
      if (matches === null) {
        break;
      }

      addresses.push({
        index: matches.index,
        col: matches[1],
        row: +matches[2],
        len: matches[0].length,
      });
    }
    addresses.reverse();

    // todo extract method getShiftedFormula
    const formulaChars = Array.from(formula);
    addresses.forEach((a) =>
      formulaChars.splice(a.index, a.len, `${a.col}${a.row + shift}`)
    );
    formula = formulaChars.join('');

    scope.setCurrentOutputValue({ formula } as CellFormulaValue);

    scope.incrementCol();

    return this;
  }
}
