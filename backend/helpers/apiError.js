/** Error carrying the HTTP status the controller should answer with. */
export class ApiError extends Error {
  constructor(statusCode, message, extra = {}) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    Object.assign(this, extra);
  }
}

export default ApiError;
