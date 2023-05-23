import {Request, Response, NextFunction} from "express";
import {verify} from "jsonwebtoken";
import {getRepository} from "typeorm";
import {User} from "../entity/user.entity";
import AppError from "../utils/appError";
import {IRequestWithUser} from "../utils/type";
import env from "../env";

const accessSecert = env.accessTokenSecret as string;

export const isAuth = async (
  req: IRequestWithUser<any, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies["accessToken"];

    if (!accessToken) {
      return next(new AppError(401, "Access token not provided!"));
    }

    const payload: any = verify(accessToken, accessSecert);

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

    req.user = data; // Store the authenticated user object in req.user
    next();
  } catch (e) {
    console.log(e);
    return next(new AppError(401, "Invalid email or password!"));
  }
};
