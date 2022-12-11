import { tpl } from './index';

describe('test apiSharedUtilsTpl', () => {
  it('should get the filled string', () => {
    expect(
      tpl(`$0 + $1 = $2\n$0&$1&$2\n$3`, 'hello', 'world', 'hello world', 12.345)
    ).toEqual('hello + world = hello world\nhello&world&hello world\n12.345');
  });
});
