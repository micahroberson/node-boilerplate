import APIError from './APIError';

class UnauthorizedError extends APIError {
  constructor(values={}) {
    if(!values.message) {
      values.message = 'Access denied.';
    }
    super(values);
  }
}

export default UnauthorizedError;