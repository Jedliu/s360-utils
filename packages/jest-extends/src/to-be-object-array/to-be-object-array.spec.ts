import './to-be-object-array';
import '../to-match-file-snapshot';

import { stripAnsi } from '@s360-utils/util-kits';

describe('Test jest-extends/to-be-object-array', () => {
  it('should throw error when received is not array', async () => {
    try {
      expect({}).toBeObjectArray({
        key: expect.any(String),
        someOtherKey: expect.any(String),
      });
    } catch (error: any) {
      expect(stripAnsi(error.message)).toMatchFileSnapshot(
        'should-throw-when-received-is-not-array',
        false
      );
    }
  });

  it('should throw error when received is empty array', async () => {
    try {
      expect([]).toBeObjectArray({
        key: expect.any(String),
        someOtherKey: expect.any(String),
      });
    } catch (error: any) {
      expect(stripAnsi(error.message)).toMatchFileSnapshot(
        'should-throw-when-received-is-empty-array',
        false
      );
    }
  });

  it('should pass when received is empty array and nullable is set', async () => {
    expect([]).toBeObjectArray(
      {
        key: expect.any(String),
        someOtherKey: expect.any(String),
      },
      true
    );
  });

  it('should throw error when received has less keys', async () => {
    try {
      expect([
        { key: 'value1', someOtherKey: '' },
        { key: 'value2' },
      ]).toBeObjectArray({
        key: expect.any(String),
        someOtherKey: expect.any(String),
      });
    } catch (error: any) {
      expect(stripAnsi(error.message)).toMatchFileSnapshot(
        'should-throw-when-received-has-less-keys',
        false
      );
    }
  });

  it('should throw error when received has more keys', async () => {
    try {
      expect([
        { key: 'value1' },
        { key: 'value2', someOtherKey: 'v3' },
      ]).toBeObjectArray({
        key: expect.any(String),
      });
    } catch (error: any) {
      expect(stripAnsi(error.message)).toMatchFileSnapshot(
        'should-throw-when-received-has-more-keys',
        false
      );
    }
  });

  it('should pass when call by equal way', async () => {
    expect([{ key: 'value1' }, { key: 'value2' }]).toEqual(
      expect.toBeObjectArray({ key: expect.any(String) })
    );
  });

  it('should pass when call with not equal way', async () => {
    expect([{ key: 'value1' }, { key: 'value2' }]).not.toEqual(
      expect.toBeObjectArray({ key2: expect.any(String) })
    );
  });
});
