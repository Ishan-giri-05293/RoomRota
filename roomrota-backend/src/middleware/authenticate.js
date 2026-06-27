const { admin } = require("../config/firebase");
const ApiError = require("../utils/ApiError");

const authenticate = async (req, _res, next) => {
  try {
    const authorization = req.get("authorization") || "";
    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new ApiError(401, "A Firebase ID token is required", "UNAUTHENTICATED");
    }

    req.user = await admin.auth().verifyIdToken(token);
    next();
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(401, "Invalid or expired authentication token", "UNAUTHENTICATED"));
  }
};

module.exports = authenticate;
