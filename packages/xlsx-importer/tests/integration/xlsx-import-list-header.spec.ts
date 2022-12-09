import path = require('path');
import { ImportType } from '../../src/config/ImportType';
import { ImporterFactory } from '../../src/ImporterFactory';

type Order = {
  oderNo: string;
  quantity: number;
  unitPrice: number;
  sub: number;
};

const headers = [
  {
    key: 'sub',
    title: 'sub',
    mapper: (value: any) => parseFloat(parseFloat(value).toFixed(1)),
  },
  {
    key: 'orderNo',
    title: 'Order',
  },
  {
    key: 'unitPrice',
    title: 'unit price',
    mapper: (value: any) => parseFloat(value),
  },
  {
    key: 'quantity',
    title: 'quantity',
    mapper: (value: any) => parseFloat(value),
  },
];

const config = {
  list: {
    type: ImportType.ListHeader,
    headers,
    headerRowIndex: 2,
    rowCount: 6,
    exactMatch: false,
  },
};

const headerPartial = [
  {
    key: 'unitPrice',
    title: 'price',
    mapper: (value: any) => parseFloat(value),
  },
];

let file: string;

beforeAll(() => {
  file = path.resolve(__dirname, '../data/list.xlsx');
});

describe('xlsx-import list', () => {
  it('getAllItems return array items [Exact match mode]', async () => {
    const factory = new ImporterFactory();
    const importer = await factory.from(file);
    const result = importer.getAllItems<Order>(config.list);
    expect(result.length).toEqual(6);
    expect(result[2].quantity).toEqual(3);
    expect(result[2].unitPrice).toEqual(0.3);
    expect(result[2].sub).toEqual(0.9);
    expect(result[5].quantity).toEqual(6);
    expect(result[5].unitPrice).toEqual(0.6);
    expect(result[5].sub).toEqual(3.6);
  });
  it('getAllItems return array items [Partial match mode]', async () => {
    const factory = new ImporterFactory();
    const importer = await factory.from(file);
    config.list.headers = headerPartial;
    const result = importer.getAllItems<Order>(config.list);
    expect(result.length).toEqual(6);
    expect(result[2].unitPrice).toEqual(0.3);
    expect(result[5].unitPrice).toEqual(0.6);
  });
  it('getAllItems return array items [Exact match mode]', async () => {
    const factory = new ImporterFactory();
    const importer = await factory.from(file);
    config.list.exactMatch = true;
    config.list.headers = headerPartial;
    const result = importer.getAllItems<Order>(config.list);
    expect(result.length).toEqual(6);
    expect(result[2].unitPrice).toBeUndefined();
    expect(result[5].unitPrice).toBeUndefined();
  });
});
