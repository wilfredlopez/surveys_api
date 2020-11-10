import { Response, NextFunction } from "express";
import MyRequest from "../interfaces";
import { Repository } from "../app";

export async function maybeAdmin(
  req: MyRequest,
  _res: Response,
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
  return next();
}
