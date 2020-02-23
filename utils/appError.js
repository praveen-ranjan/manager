class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true; /* Operational error  */

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

/*
Two types of errors
1) Operational errors
    a) Invalid Path
    b) Invalid user input
    c) Failed to connect Server
    d) Failed to connect database
    e) Request Timeout etc...
2) Programming errors
    a) Bugs
    b) Reading properties of undefined
    c) Passing a number where Object is required
    d) etc

*/
