import { stripAnsi } from './ansi-helper';

describe('Test ansi-helper', () => {
  it('should see the correct stripped text', () => {
    try {
      expect({ key: 'hello' }).toEqual({ key: 'world' });
    } catch ({ message }) {
      expect(stripAnsi(message as string)).toEqual(
        `expect(received).toEqual(expected) // deep equality\n\n` +
          `- Expected  - 1\n+ Received  + 1\n\n  Object {\n-   "key": "world",\n+   "key": "hello",\n  }`
      );
    }
  });
});
