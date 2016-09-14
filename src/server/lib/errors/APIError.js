class APIError extends Error {
  constructor(values={}) {
    super(values.message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = values.message;
    this.code = values.code;
  }
}

export default APIError;