module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // console.log(err);
  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      message: err.message,
      stack: err.stack
    });
  } else if (process.env.NODE_ENV === "production") {
    // Operational, trusted error, send to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        message: err.message
      });
      // Programming or other unknown error: don't leak error details
    } else {
      res.status(500).json({
        message: "Some thing went wrong!"
      });
    }
  }
};
