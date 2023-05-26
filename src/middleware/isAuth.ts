import {Request, Response, NextFunction} from "express";
import {TokenExpiredError, verify} from "jsonwebtoken";
import {getRepository} from "typeorm";
// import {User} from "../entity/user.entity";
import AppError from "../utils/appError";
import {IRequestWithUser} from "../utils/type";
import env from "../env";
import {User2} from "../entity/user2.entity";

const accessSecert = env.accessTokenSecret as string;

export const isAuth = async (
  req: IRequestWithUser<any, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies["accessToken"];

    // console.log({accessToken});

    if (!accessToken) {
      return next(new AppError(401, "Access token not provided!"));
    }

    const payload: any = verify(accessToken, accessSecert, {ignoreExpiration: true});
    console.log({payload});

    if (!payload) {
      return next(new AppError(401, "Invalid token!"));
    }

    const user = await getRepository(User2).findOne({
      where: {
        phone: payload?.phone,
      },
    });

    if (!user) {
      return next(new AppError(401, "User profile not completed!"));
    }

    const {phone, ...data} = user;

    req.user = data;
    next();
  } catch (e) {
    console.log(e);
    if (e instanceof TokenExpiredError) {
      return next(new AppError(401, "Token Expired!"));
    }
    return next(new AppError(401, "Invalid phone number!"));
  }
};
