import APIError from './APIError';

class UnauthorizedAccessError extends APIError {
  constructor(values={}) {
    if(!values.message) {
      values.message = 'Access denied.';
    }
    super(values);
  }
}

export default UnauthorizedAccessError;