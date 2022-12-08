import { Cell } from '@s360-utils/exceljs';

import { BaseCell } from '../../../src/cell/BaseCell';

describe('BaseCell unit tests', () => {
  it('Abstract class `BaseCell` should be never instanced by keyword `new`', async () => {
    expect(() => new BaseCell()).toThrow(
      "Cannot construct BaseCell instances directly. It's abstract."
    );
  });

  it('`BaseCell.match` should always return false', async () => {
    expect(BaseCell.match({} as Cell)).toEqual(false);
    expect(BaseCell.match({ value: '## asds' } as Cell)).toEqual(false);
    expect(BaseCell.match({ value: '#! FOR_EACH' } as Cell)).toEqual(false);
    expect(BaseCell.match({ value: 'some' } as Cell)).toEqual(false);
    expect(BaseCell.match({ value: '' } as Cell)).toEqual(false);
  });
});
