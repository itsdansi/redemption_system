import {NextFunction, Request, Response} from "express";
import {QueryFailedError, getRepository} from "typeorm";
import bcryptjs from "bcryptjs";
import {TokenExpiredError, sign, verify} from "jsonwebtoken";
import AppError from "../utils/appError";
import {User2} from "../entity/user2.entity";
import {generateOTP, sendOTPSMS} from "../helper/smsHelper";
import {OTP} from "../entity/otp.entity";
import env from "../env";

const accessSecert = env.accessTokenSecret as string;
const refreshSecert = env.refreshTokenSecret as string;

export const sendOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {phone} = req.body;
    const regex = /^[6789]\d{9}$/;
    const isValidPhone = regex.test(phone);
    if (!isValidPhone) {
      return res.status(400).send({error: "Not a valid phone phone number!"});
    }
    const otp = generateOTP();
    console.log({otp});
    const result = await getRepository(OTP).save({
      phone,
      otp_token: otp as any,
    });
    // // console.log(result);
    const sentOtp = await sendOTPSMS(
      phone,
      `${otp}} is the OTP for registering your number on Nichino Redemption Portal. OTP valid for 20 mins only. Please do not share with anyone.`
    );
    // console.log({sentOtp});
    res.send(result);
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json({
        status: "fail",
        message: "Phone number already exist",
      });
    }
    console.log(err);
    next(err);
  }
};

export const loginWithOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {otp, phone} = req.body;

    const result = await getRepository(OTP).findOne({
      where: {phone, otp_token: otp as any},
    });

    if (!result) {
      // Invalid OTP
      return res.status(400).send({message: "Invalid OTP"});
    }

    const otpCreatedTime = result.createdAt;
    const currentTime = new Date();
    const otpExpirationTime = new Date(otpCreatedTime.getTime() + 2000 * 60 * 1000); // Adding 20 minutes to OTP creation time
    if (currentTime > otpExpirationTime) {
      // OTP has expired
      return res.status(400).send({message: "OTP has expired"});
    }

    // OTP is valid, proceed with generating tokens and sending the response

    const accessToken = sign(
      {
        phone,
      },
      accessSecert,
      {expiresIn: 60 * 60}
    );

    const refreshToken = sign({phone}, refreshSecert, {expiresIn: 24 * 60 * 60});

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      path:'.nupipay.com',
      maxAge: 24 * 60 * 60 * 1000, // equivalent to 1 day
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // equivalent to 7 days
    });

    res.send({
      message: "success",
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });
  } catch (error: any) {
    next(error);
  }
};

export const refreshTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies["refreshToken"];
    const payload: any = verify(refreshToken, refreshSecert);

    if (!payload) {
      return next(new AppError(400, "Invalid email or password!"));
    }

    const accessToken = sign(
      {
        id: payload.id,
      },
      accessSecert,
      {expiresIn: 60 * 60}
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, //equivalent to 1 day
    });

    res.send({
      message: "success",
      access_token: accessToken,
    });
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      return next(new AppError(401, "Token Expired!"));
    }
    return next(new AppError(401, "Invalid auth credential!"));
  }
};

export const logoutHandler = async (req: Request, res: Response) => {
  if (req.cookies["accessToken"]) {
    res.cookie("accessToken", "", {maxAge: 0});
    res.cookie("refreshToken", "", {maxAge: 0});
    return res.status(200).json({message: "Logout successfully!"});
  }
  return res.status(400).json({message: "Already logout!"});
};
