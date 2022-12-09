import path = require('path');
import { ImportType } from '../../src/config/ImportType';
import { ImporterFactory } from '../../src/ImporterFactory';

type Order = {
  oderNo: string;
  quantity: number;
  unitPrice: number;
  sub: number;
};
const config = {
  list: {
    type: ImportType.List,
    columns: [
      { index: 2, key: 'orderNo' },
      { index: 3, key: 'quantity', mapper: (value: any) => parseFloat(value) },
      { index: 4, key: 'unitPrice', mapper: (value: any) => parseFloat(value) },
      {
        index: 5,
        key: 'sub',
        mapper: (value: any) => parseFloat(parseFloat(value).toFixed(1)),
      },
    ],
    rowOffset: 2,
    rowCount: 6,
  },
};

describe('xlsx-import list', () => {
  it('getAllItems return array items', async () => {
    const factory = new ImporterFactory();
    const importer = await factory.from(
      path.resolve(__dirname, '../data/list.xlsx')
    );
    const result = importer.getAllItems<Order>(config.list);
    expect(result.length).toEqual(6);
    expect(result[2].quantity).toEqual(3);
    expect(result[2].unitPrice).toEqual(0.3);
    expect(result[2].sub).toEqual(0.9);
    expect(result[5].quantity).toEqual(6);
    expect(result[5].unitPrice).toEqual(0.6);
    expect(result[5].sub).toEqual(3.6);
  });
});
