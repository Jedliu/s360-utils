import path = require('path');

import { ImportType } from '../../src/config/ImportType';
import { ImporterFactory } from '../../src/ImporterFactory';
import { getDateString } from '../utils';

const config = {
  user: {
    type: ImportType.Object,
    fields: [
      { row: 2, col: 'B', key: 'id', mapper: Number.parseInt },
      { row: 3, col: 'B', key: 'firstName' },
      { row: 4, col: 'B', key: 'lastName' },
      { row: 5, col: 'B', key: 'email' },
      { row: 6, col: 'B', key: 'roles' },
      {
        row: 7,
        col: 'B',
        key: 'salary',
        mapper: (value: string) => parseFloat(parseFloat(value).toFixed(2)),
      },
      {
        row: 8,
        col: 'B',
        key: 'birthday',
        mapper: (value: any) => getDateString(new Date(value)),
      },
    ],
  },
};

describe('xlsx-import object', () => {
  let file: string;
  beforeAll(() => {
    file = path.resolve(__dirname, '../data/object.xlsx');
  });

  describe('getAllItems should return one correct object', () => {
    describe.each([
      {
        config,
        message: 'when NOT pass the worksheet name',
      },
      {
        config: { user: { ...config.user, worksheet: 'Sheet1' } },
        message: 'when pass the worksheet name',
      },
    ])('', ({ config, message }) => {
      it(message, async () => {
        const factory = new ImporterFactory();
        const importer = await factory.from(file);
        const result = importer.getAllItems(config.user);
        expect(result).toEqual([
          {
            id: 99,
            firstName: 'Jason',
            lastName: '',
            email: 'jason@gmail.com',
            roles: 'project-creator,project-assignee,employee',
            salary: 8888.09,
            birthday: '1986-06-11',
          },
        ]);
      });
    });
  });

  describe('if worksheet name does NOT exist', () => {
    it('Should see error message tells worksheet not found', async () => {
      const unknownSheetName = 'unknown';
      const configError = {
        user: {
          ...config.user,
          worksheet: unknownSheetName,
        },
      };
      const factory = new ImporterFactory();
      const importer = await factory.from(file);
      try {
        importer.getAllItems(configError.user);
      } catch ({ message }) {
        expect(message).toEqual(`Worksheet '${unknownSheetName}' not found`);
      }
    });
  });
});
