/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import moment from 'moment';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_TIME_FORMAT_T = 'YYYY-MM-DD[T]HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD ';

export function formatToDateTime(
  date: moment.MomentInput = null,
  format = DATE_TIME_FORMAT
): string {
  const m = moment(date);
  return m.format(format) || m.format(DATE_TIME_FORMAT) || m.format(DATE_TIME_FORMAT_T);
}

export function formatToDate(date: moment.MomentInput = null, format = DATE_FORMAT): string {
  return moment(date).format(format);
}

export const dateUtil = moment;
