import { Cell, DocRange, ValueType } from '@s360-utils/exceljs';

import { ICellCoord } from '../ICellCoord';
import { Scope } from '../Scope';
import { BaseCell } from './BaseCell';

/* tslint:disable:variable-name */
/**
 * Pattern: `#! FOR_EACH [TARGET] [SOURCE]`
 * Iterate through `vm[SOURCE]` and store current item in readonly `vm[TARGET]`.
 * `vm[TARGET]` has additional fields:
 *
 * * `__from` - keeps `SOURCE` parameter's value
 * * `__index` - current 1-based iteration index (`vm[TARGET]` is `vm[SOURCE][__index-1]`)
 * * `__start` - template foreach start cell
 * * `__end` - template loop's end cell, it is undefined before first `END_LOOP`
 * * `__iterated` - iteration has been finished
 * * `__last` - is this last element of a collection
 * * `__insertRows` - second and next iterations have to insert new rows
 * * `__startOutput` - first output cell
 * * `__endOutput` - last output cell
 * * `__last` - boolean if it is last element of collection - useful for: `#! FINISH item.__last`
 */
export class ForEachCell extends BaseCell {
  public static override match(cell: Cell): boolean {
    return (
      cell &&
      cell.type === ValueType.String &&
      typeof cell.value === 'string' &&
      cell.value.substring(0, 11) === '#! FOR_EACH'
    );
  }

  protected static getTargetParam(scope: Scope): string {
    return scope.getCurrentTemplateString().split(' ')[2];
  }

  protected static shiftMergedCells(
    __end: ICellCoord,
    __start: ICellCoord,
    scope: Scope
  ) {
    const shiftByR = __end.r - __start.r;
    const outputWorksheet = scope.output.worksheets[scope.outputCell.ws] as any;
    // TODO fix ts-ignore ( @see https://github.com/Siemienik/xlsx-renderer/issues/46 )
    const merges = outputWorksheet._merges;
    outputWorksheet._merges = Object.keys(merges).reduce((val: any, key) => {
      if (merges[key].top > __end.r) {
        let { top, bottom } = merges[key].model;
        const { left, right, sheetName } = merges[key].model;
        top += shiftByR;
        bottom += shiftByR;
        const newRange = new DocRange();
        newRange.setTLBR(top, left, bottom, right, sheetName);
        val[newRange.tl] = newRange;
      } else {
        val[key] = merges[key];
      }
      return val;
    }, {});
  }

  public override apply(scope: Scope): ForEachCell {
    const target = ForEachCell.getTargetParam(scope);
    const __from = this.getSourceParam(scope);

    // TODO refactoring
    const __index = ((scope.vm[target] && scope.vm[target].__index) || 0) + 1;
    if (__index === 1) {
      super.apply(scope);
    }

    // TODO set types
    const __start: ICellCoord =
      (scope.vm[target] && scope.vm[target].__start) || scope.templateCell;
    const __startOutput =
      (scope.vm[target] && scope.vm[target].__startOutput) ||
      scope.outputCell.r + 1;
    const __end: ICellCoord = scope.vm[target] && scope.vm[target].__end;
    const __last =
      typeof __from.split('.').reduce((p, c) => p[c] || {}, scope.vm)[
        __index
      ] === 'undefined';
    let __endOutput = scope.vm[target] && scope.vm[target].__endOutput;
    let __insertRows =
      (scope.vm[target] && scope.vm[target].__insertRows) || false;

    let next = __from.split('.').reduce((p, c) => p[c] || {}, scope.vm)[
      __index - 1
    ];

    let __iterated = scope.vm[target] && scope.vm[target].__iterated;
    __iterated = typeof __iterated !== 'undefined' && __iterated;

    scope.setCurrentOutputValue(null);

    if (!__iterated && !next) {
      __iterated = true;
      scope.freezeOutput();
    }

    next = next || {};

    if (__insertRows) {
      __insertRows = false;
      if (!scope.isFrozen()) {
        for (let i = __end.r; i > __start.r; i--) {
          scope.output.worksheets[scope.outputCell.ws].spliceRows(
            // todo refactoring
            scope.outputCell.r + 1,
            0,
            []
          );
        }

        ForEachCell.shiftMergedCells(__end, __start, scope);
      }
    }

    if (__iterated) {
      __endOutput = __endOutput || scope.outputCell.r;
    }

    scope.incrementRow();

    scope.vm[target] = Object.freeze({
      ...next,
      __from,
      __index,
      __start,
      __end,
      __iterated,
      __insetRows: __insertRows, // todo deprecate and remove further, it was a typo
      __insertRows,
      __startOutput,
      __endOutput,
      __last,
    });

    return this;
  }

  protected getSourceParam(scope: Scope): string {
    return scope.getCurrentTemplateString().split(' ')[3];
  }
}
