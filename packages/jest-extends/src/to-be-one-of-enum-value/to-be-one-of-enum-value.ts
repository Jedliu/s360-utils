export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeOneOfEnumValue(argument: { [s: string]: string }): R;
    }
    interface Expect {
      toBeOneOfEnumValue(argument: { [s: string]: string }): any;
    }
  }
}

expect.extend({
  toBeOneOfEnumValue(received: string, argument: { [s: string]: string }) {
    try {
      const result = Object.keys(argument).find(
        (key) => argument[key] === received
      );
      if (!result) throw new Error();
      return {
        message: () =>
          `expected ${received} not to be one of Enum value ${JSON.stringify(
            argument
          )}`,
        pass: true,
      };
    } catch (error) {
      return {
        message: () =>
          `expected ${received} to be one of Enum value ${JSON.stringify(
            argument
          )}`,
        pass: false,
      };
    }
  },
});
