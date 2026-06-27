const ApiError = require("../utils/ApiError");

const notFound = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`, "NOT_FOUND"));
};

const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const isServerError = statusCode >= 500;

  if (isServerError) console.error(error);

  res.status(statusCode).json({
    error: {
      code: error.code || "INTERNAL_ERROR",
      message: isServerError ? "An unexpected error occurred" : error.message,
    },
  });
};

module.exports = { notFound, errorHandler };
