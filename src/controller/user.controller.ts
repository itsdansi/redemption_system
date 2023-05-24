import {NextFunction, Request, Response} from "express";
import {getRepository} from "typeorm";
// import {User} from "../entity/user.entity";
import {TokenExpiredError, sign, verify} from "jsonwebtoken";
import AppError from "../utils/appError";
import env from "../env";
import {OTP} from "../entity/otp.entity";
import {User2} from "../entity/user2.entity";

const accessSecert = env.accessTokenSecret as string;

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

    const payload: any = verify(accessToken, accessSecert);
    console.log({payload});

    if (!payload) {
      return next(new AppError(401, "Invalid token!"));
    }

    const user = await getRepository(User2).findOne({
      where: {
        phone: payload?.phone,
      },
    });

    // console.log("HEllo--------------", user);

    if (!user) {
      return next(new AppError(401, "Invalid phone number!"));
    }

    const {phone, ...data} = user;

    console.log({phone, data});

    res.send(data);
  } catch (e) {
    console.log(e);
    if (e instanceof TokenExpiredError) {
      return next(new AppError(401, "Token Expired!"));
    }
    return next(new AppError(401, "Invalid phone number!"));
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies["accessToken"];

    if (!accessToken) {
      return next(new AppError(401, "Access token not provided!"));
    }

    const payload: any = verify(accessToken, accessSecert);

    console.log({payload});

    if (!payload) {
      return next(new AppError(401, "Invalid token!"));
    }

    const user = await getRepository(OTP).findOne({
      where: {
        phone: payload?.phone,
      },
    });

    // console.log("Hello----------------->");
    // console.log({user});

    if (!user) {
      return next(new AppError(401, "Invalid auth credential!"));
    }

    const {phone, ...data} = user;

    const {firstName, lastName, dob, email} = req.body;

    const newUser = await getRepository(User2).save({
      firstName,
      lastName,
      dob,
      email,
      phone,
    });
    res.send(newUser);
  } catch (e) {
    // console.log(e);
    if (e instanceof TokenExpiredError) {
      return next(new AppError(401, "Token Expired!"));
    }
    return next(new AppError(401, "Invalid auth credential!"));
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies["accessToken"];

    if (!accessToken) {
      return next(new AppError(401, "Access token not provided!"));
    }

    const payload: any = verify(accessToken, accessSecert);

    console.log({payload});

    if (!payload) {
      return next(new AppError(401, "Invalid token!"));
    }

    const user = await getRepository(OTP).findOne({
      where: {
        phone: payload?.phone,
      },
    });

    // console.log("Hello----------------->");
    // console.log({user});

    if (!user) {
      return next(new AppError(401, "Invalid auth credential!"));
    }

    const {phone, ...data} = user;

    const {firstName, lastName, dob, email} = req.body;

    const newUser = await getRepository(User2).save({
      firstName,
      lastName,
      dob,
      email,
      phone,
    });
    res.send(newUser);
  } catch (e) {
    // console.log(e);
    if (e instanceof TokenExpiredError) {
      return next(new AppError(401, "Token Expired!"));
    }
    return next(new AppError(401, "Invalid auth credential!"));
  }
};
