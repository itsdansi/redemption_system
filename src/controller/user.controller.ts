import {NextFunction, Request, Response} from "express";
import {getRepository} from "typeorm";
import {User} from "../entity/user.entity";
import {sign, verify} from "jsonwebtoken";
import AppError from "../utils/appError";

export const authenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies["accessToken"];

    if (!accessToken) {
      return next(new AppError(401, "Access token not provided!"));
    }

    const payload: any = verify(accessToken, "access_secret");

    if (!payload) {
      return next(new AppError(401, "Invalid token!"));
    }

    const user = await getRepository(User).findOne({
      where: {
        id: payload?.id,
      },
    });

    if (!user) {
      return next(new AppError(401, "Invalid email or password!"));
    }

    const {password, ...data} = user;

    res.send(data);
  } catch (e) {
    console.log(e);
    return next(new AppError(401, "Invalid email or password!"));
  }
};
