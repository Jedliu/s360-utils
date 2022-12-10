/**
 * Get date string from date object in format 'YYYY-MM-DD'
 * @param dt
 * @returns
 */
export const getDateString = (dt: Date): string => {
  const offset = dt.getTimezoneOffset();
  dt = new Date(dt.getTime() - offset * 60 * 1000);
  return dt.toISOString().split('T')[0];
};
