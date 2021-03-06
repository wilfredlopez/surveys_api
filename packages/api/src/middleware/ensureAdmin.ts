import { Response, NextFunction } from "express";
import MyRequest from "../interfaces";
import { Repository } from "../app";

export async function ensureAdmin(
  req: MyRequest,
  res: Response,
  next: NextFunction
) {
  if (req.userId) {
    const admin = await Repository.userRepository.findOne({
      id: req.userId,
    });
    if (admin && admin.isAdmin) {
      req.admin = admin;
      return next();
    }
  }
  return res
    .status(401)
    .json({
      error: "Unauthorized",
    })
    .end();
}
