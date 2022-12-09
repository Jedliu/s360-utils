import path = require('path');

import { ImporterFactory } from '../../src/ImporterFactory';

const configs = {
  large: {
    worksheet: 'Sheet1',
    columns: [
      { index: 1, key: 'id', mapper: (v: string) => Number.parseInt(v) },
      { index: 2, key: 'factor', mapper: (v: string) => Number.parseFloat(v) },
    ],
    rowOffset: 0,
  },
};

describe('64k rows', () => {
  it('getAllItems return 64k correct items', async () => {
    const factory = new ImporterFactory();
    const importer = await factory.from(
      path.resolve(__dirname, '../data/large-64.xlsx')
    );
    const result = importer.getAllItems<{ id: number; factor: number }>(
      configs.large
    );

    expect(result.length).toEqual(64000);
    expect(result[9].id).toEqual(10);
    expect(result[9].factor).toEqual(1.1);
    expect(result[399].id).toEqual(400);
    expect(result[399].factor).toEqual(1.0025);
  });
});
