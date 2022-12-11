/**
 * Replace the template variables of the string with the given values.
 * @param stringWithTpl template string $0, $1, $2, ...
 * @param values
 * @returns
 */
export const tpl = (stringWithTpl: string, ...values: any): string => {
  for (let i = 0; i < values.length; i++) {
    const element = values[i];
    stringWithTpl = stringWithTpl.replace(new RegExp(`\\$` + i, 'mg'), element);
  }
  return stringWithTpl;
};
