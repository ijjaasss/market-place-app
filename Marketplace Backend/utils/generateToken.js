import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const sendToken = (user, cookieName, statusCode, res) => {
  const token = generateToken(user._id);

  const options = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };

  user.password = undefined;

  res
    .status(statusCode)
    .cookie(cookieName, token, options)
    .json({
      success: true,
      token,
      data: user,
    });
};