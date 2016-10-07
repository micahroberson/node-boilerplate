class APIError extends Error {
  constructor(values={}) {
    if(typeof values === 'string') {
      values = {message: values};
    }
    super(values.message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = values.message;
    this.code = values.code;
  }
}

export default APIError;

export class ParametersInvalidError extends APIError {}

export class NotFoundError extends APIError {}

export class UnauthorizedAccessError extends APIError {
  constructor(values={}) {
    if(!values.message) {
      values.message = 'Access denied.';
    }
    super(values);
  }
}