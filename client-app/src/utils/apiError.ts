import axios from 'axios';

// Validation failures come back as { message: string; errors: string[] }.
// Other failures (e.g. BadRequest(result.Error)) come back as a bare JSON string.
export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (typeof data === 'string' && data) {
      return data;
    }
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      return data.errors.join(' ');
    }
    if (typeof data?.message === 'string' && data.message) {
      return data.message;
    }
  }
  return fallback;
}
