// import { User } from "../models/userSchema.js";
// import { catchAsyncErrors } from "./catchAsyncError.js";
// import ErrorHandler from "./error.js";
// import jwt from "jsonwebtoken";

// export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
//   const { token } = req.cookies;
//   if (!token) {
//     return next(new ErrorHandler("User Not Authorized", 401));
//   }
//   const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//   req.user = await User.findById(decoded.id);

//   next();
// });
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  console.log("Checking authentication...");
  console.log("Cookies received:", req.cookies);

  const { token } = req.cookies;
  if (!token) {
    console.log("No token found. User is not authorized.");
    return next(new ErrorHandler("User Not Authorized", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorHandler("User not found", 404));
    }

    console.log("User authenticated:", req.user.email);
    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
});
