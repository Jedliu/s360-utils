import { stripAnsi, tpl } from '@s360-utils/util-kits';
import * as colors from 'colors';

export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeObjectArray(
        argument: object,
        nullable?: boolean,
        exactKeyMatch?: boolean
      ): R;
    }
    interface Expect {
      toBeObjectArray(
        argument: object,
        nullable?: boolean,
        exactKeyMatch?: boolean
      ): any;
    }
  }
}

expect.extend({
  toBeObjectArray(
    received: any,
    expected: object,
    nullable = false,
    exactKeyMatch = true
  ) {
    if (!Array.isArray(received)) {
      return {
        message: () =>
          getErrorMessage(
            colors.red('+ Received: value must be an object array.')
          ),
        pass: false,
      };
    }

    if (received.length === 0) {
      if (nullable) {
        return { message: () => '', pass: true };
      } else {
        return {
          message: () =>
            getErrorMessage(
              colors.red('+ Received: should not be empty array.')
            ),
          pass: false,
        };
      }
    }

    let currentItem: any = null;
    try {
      let exactKeyPass = true;
      received.forEach((item) => {
        currentItem = item;
        expect(item).toEqual(expect.objectContaining(expected));
        // check if all the keys are present
        if (
          exactKeyMatch &&
          Object.keys(item).length !== Object.keys(expected).length
        ) {
          exactKeyPass = false;
        }
      });

      if (!exactKeyPass) {
        return {
          message: () => getErrorMessageWithInvalidKeys(expected, currentItem),
          pass: false,
        };
      }

      return {
        message: () => '',
        pass: true,
      };
    } catch (error) {
      return {
        message: () => getErrorMessageWithInvalidKeys(expected, currentItem),
        pass: false,
      };
    }
  },
});

const defaultArgs = [
  colors.grey('expect'),
  colors.red('received'),
  colors.green('expected'),
];

const getErrorMessage = (
  msg: string,
  tplString = '$0($1).toBeObjectArray($2)\n\n$3'
) => {
  const args = [...defaultArgs, msg];
  return tpl(tplString, ...args);
};

const getErrorMessageWithInvalidKeys = (expected: any, item: any) => {
  return tpl(
    `$0($1).toBeObjectArray($2)\n\n$3\n$4\n\n$5\n$6`,
    ...defaultArgs,
    colors.green('- Expected -'),
    colors.red('+ Received +'),
    colors.green(getExpectedToString(expected)),
    colors.red(getReceivedToString(item))
  );
};

const getExpectedToString = (expected: object) => {
  let message = '';

  try {
    expect({}).toMatchObject(expected);
  } catch (e: any) {
    let index = 0;
    stripAnsi(e.message)
      .split('\n')
      .map((m) => {
        if (m.substring(0, 1) === '-') {
          if (index > 0) {
            message += m + '\n';
          }
          index++;
        }
      });
  }

  return message.replace(/\n$/, '');
};

const getReceivedToString = (received: any) => {
  return JSON.stringify(received, null, 2)
    .split('\n')
    .map((s, i) => (i === 0 ? '+  Object ' : '+ ') + s)
    .join('\n');
};
