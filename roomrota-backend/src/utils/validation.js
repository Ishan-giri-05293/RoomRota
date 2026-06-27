const ApiError = require("./ApiError");

const requiredString = (value, field, { max = 200, min = 1 } = {}) => {
  if (typeof value !== "string") {
    throw new ApiError(400, `${field} must be a string`, "VALIDATION_ERROR");
  }

  const normalized = value.trim();
  if (normalized.length < min || normalized.length > max) {
    throw new ApiError(
      400,
      `${field} must be between ${min} and ${max} characters`,
      "VALIDATION_ERROR"
    );
  }

  return normalized;
};

const emailAddress = (value) => {
  const email = requiredString(value, "email", { max: 254 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, "email is invalid", "VALIDATION_ERROR");
  }
  return email.toLowerCase();
};

const password = (value) => {
  if (typeof value !== "string" || value.length < 8 || value.length > 128) {
    throw new ApiError(
      400,
      "password must be between 8 and 128 characters",
      "VALIDATION_ERROR"
    );
  }
  return value;
};

const optionalDate = (value, field = "dueDate") => {
  if (value === undefined || value === null || value === "") return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new ApiError(400, `${field} must be a valid date`, "VALIDATION_ERROR");
  }
  return date;
};

module.exports = { requiredString, emailAddress, password, optionalDate };
