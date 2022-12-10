import { dateMapper } from '../../../src/mappers';
import { getDateString } from '../../utils';

describe('UNIT TEST: src/mappers/', () => {
  const isString = (str: any): boolean => {
    return str != null && typeof str.valueOf() === 'string';
  };

  describe('dateMapper', () => {
    const dataProvider = [
      // data time
      {
        inValue:
          'Thu Oct 08 2020 02:00:00 GMT+0200 (Central European Summer Time)',
        expectedResult: 1602115200000,
      },
      {
        inValue: 'Thu Jan 30 1750 02:00:00 GMT-0900',
        expectedResult: -6939954000000,
      },
      { inValue: 'Thu Jan 30 3125', expectedResult: '3125-01-30' },
      { inValue: '3125/01/30', expectedResult: '3125-01-30' },
      { inValue: '01/30/3125', expectedResult: '3125-01-30' },

      // invalid input (out of design) - if input is not string should pass same value forward
      { inValue: 'asd', expectedResult: NaN },
      { inValue: null, expectedResult: NaN },
      { inValue: undefined, expectedResult: NaN },
      { inValue: true, expectedResult: NaN },
      { inValue: false, expectedResult: NaN },
      { inValue: 0, expectedResult: NaN },
      { inValue: 0x0, expectedResult: NaN },
    ];
    dataProvider.forEach(({ inValue, expectedResult }) => {
      it(`dateMapper for input "${inValue}" SHOULD return "${expectedResult}"`, () => {
        const time = dateMapper(inValue as string).getTime();
        if (isString(expectedResult)) {
          expect(getDateString(new Date(time))).toEqual(expectedResult);
        } else {
          expect(time).toEqual(expectedResult);
        }
      });
    });
  });
});
