class ApiError extends Error {
  constructor(raw) {
    super(raw);
    this.name = raw.name || 'ApiError';
    this.metadata = {
      request_url: raw.request_url,
      request_payload: raw.request_payload,
      response_status: raw.response_status,
      response_body: raw.response_body
    };
    this.code = raw.code;
    this.message = raw.message;
    this.user_message = raw.user_message;
    this.stack = (new Error(raw.message)).stack;
    this.raw = raw;
  }
}

export default ApiError;
