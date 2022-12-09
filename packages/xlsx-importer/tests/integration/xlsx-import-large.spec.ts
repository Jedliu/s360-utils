import path = require('path');
import { ImporterFactory } from '../../src/ImporterFactory';

const config = {
  large: {
    worksheet: 1,
    columns: [
      { index: 1, key: 'id', mapper: (v: string) => Number.parseInt(v) },
      { index: 2, key: 'factor', mapper: (v: string) => Number.parseFloat(v) },
    ],
    rowOffset: 0,
  },
};
describe('xlsx-import large', () => {
  describe.each([
    { worksheet: 1 },
    { worksheet: 'Sheet1' },
    { worksheet: undefined },
  ])('getAllItems should return correct items when', ({ worksheet }) => {
    it(`worksheet: ${worksheet}`, async () => {
      const factory = new ImporterFactory();
      const importer = await factory.from(
        path.resolve(__dirname, '../data/large.xlsx')
      );
      const result = importer.getAllItems<{ id: number; factor: number }>({
        ...config.large,
        worksheet,
      });

      expect(result.length).toEqual(64000);
      expect(result[9].id).toEqual(10);
      expect(result[9].factor).toEqual(1.1);
      expect(result[399].id).toEqual(400);
      expect(result[399].factor).toEqual(1.0025);
      expect(result[63999].factor).toEqual(0);
    });
  });
});
