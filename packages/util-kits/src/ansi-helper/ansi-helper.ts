/**
 * Get RegExp to get ansi escape codes
 * ```ts
 * some_string.replace(ansiRegex(), '');
 * ```
 * @param flags
 * @returns
 */
export const getAnsiRegex = (flags = 'g') => {
  const pattern = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))'
  ].join('|');

  return new RegExp(pattern, flags);
};

/**
 * Get ansi escape codes from string
 * @param str
 * @returns
 */
export const stripAnsi = (str: string) => {
  return str.replace(getAnsiRegex(), '');
};
