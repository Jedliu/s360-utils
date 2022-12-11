import './to-be-one-of-enum-value';

enum SampleEnum {
  key1 = 'value1',
  key2 = 'value2',
}

const res = {
  type: expect.toBeOneOfEnumValue(SampleEnum),
};

describe('Test jest-extends/to-be-one-of-enum', () => {
  it('should pass if the value is one of enum', async () => {
    expect(SampleEnum.key1).toBeOneOfEnumValue(SampleEnum);
    expect('value2').toBeOneOfEnumValue(SampleEnum);
    expect({ type: SampleEnum.key1 }).toEqual(expect.objectContaining(res));
    expect({ type: 'value1' }).toEqual(expect.objectContaining(res));
  });

  it('should see error if the value is not one of enum', async () => {
    try {
      expect('value3').toBeOneOfEnumValue(SampleEnum);
    } catch (error: any) {
      expect(error.message).toContain('to be one of Enum');
    }

    try {
      expect({ type: 'value3' }).toEqual(expect.objectContaining(res));
    } catch (error: any) {
      expect(error.message).toContain('toBeOneOfEnumValue');
    }
  });
});
