export class ApiError extends Error {
  constructor(statusCode, message, errors = [], data) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;
    this.data = data;
  }
}
