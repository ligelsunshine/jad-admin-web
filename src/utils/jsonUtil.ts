import jsonlint from '/@/utils/jsonlint.min';
import { isString } from '/@/utils/is';

export function validateJson(value: string | object | any): {
  value: string;
  error: boolean;
  message: string;
} {
  const result = {
    value: '',
    error: false,
    message: '',
  };
  try {
    result.value =
      jsonlint.parse(value) && isString(value)
        ? JSON.stringify(JSON.parse(value), null, 2)
        : JSON.stringify(value, null, 2);
  } catch (e) {
    if (e.name === 'Error') {
      result.error = true;
      result.message = e.message;
    }
    result.value = value as string;
  }
  return result;
}
