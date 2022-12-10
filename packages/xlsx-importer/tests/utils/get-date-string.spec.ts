import { getDateString } from './get-date-string';

describe('Test getDateString()', () => {
  it('should see correct date', async () => {
    expect(getDateString(new Date('Thu Jan 30 2022'))).toEqual('2022-01-30');
    expect(
      getDateString(
        new Date(
          'Thu Oct 08 2020 02:00:00 GMT+0200 (Central European Summer Time)'
        )
      )
    ).toEqual('2020-10-08');
  });
});
