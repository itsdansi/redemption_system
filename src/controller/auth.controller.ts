// import {NextFunction, Request, Response} from "express";
// import {getRepository} from "typeorm";
// import {User} from "../entity/user.entity";
// import bcryptjs from "bcryptjs";
// import {sign, verify} from "jsonwebtoken";
// import AppError from "../utils/appError";

// export const registerHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const {name, email, password} = req.body;

//     const user = await getRepository(User).save({
//       name,
//       email: email.toLowerCase(),
//       password: await bcryptjs.hash(password, 12),
//     });

//     res.send(user);
//   } catch (err: any) {
//     if (err.code === "23505") {
//       return res.status(409).json({
//         status: "fail",
//         message: "User with that email already exist",
//       });
//     }
//     next(err);
//   }
// };

// export const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const {email, password} = req.body;

//     const user = await getRepository(User).findOne({
//       where: {
//         email: email,
//       },
//     });

//     if (!user) {
//       return next(new AppError(400, "Invalid email or password!"));
//     }

//     if (!(await bcryptjs.compare(password, user.password))) {
//       return next(new AppError(401, "Invalid email or password!"));
//     }

//     const accessToken = sign(
//       {
//         id: user.id,
//       },
//       "access_secret",
//       {expiresIn: 60 * 60}
//     );

//     const refreshToken = sign({id: user.id}, "refresh_secret", {expiresIn: 24 * 60 * 60});

//     res.cookie("accessToken", accessToken, {
//       httpOnly: true,
//       maxAge: 24 * 60 * 60 * 1000, //equivalent to 1 day
//     });

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       maxAge: 7 * 24 * 60 * 60 * 1000, //equivalent to 7 days
//     });

//     res.send({
//       message: "success",
//       tokens: {
//         access_token: accessToken,
//         refresh_token: refreshToken,
//       },
//     });
//   } catch (error: any) {
//     next(error);
//   }
// };

// export const refreshTokenHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const refreshToken = req.cookies["refreshToken"];
//     const payload: any = verify(refreshToken, "refresh_secret");

//     if (!payload) {
//       return next(new AppError(400, "Invalid email or password!"));
//     }

//     const accessToken = sign(
//       {
//         id: payload.id,
//       },
//       "access_secret",
//       {expiresIn: 60 * 60}
//     );

//     res.cookie("accessToken", accessToken, {
//       httpOnly: true,
//       maxAge: 24 * 60 * 60 * 1000, //equivalent to 1 day
//     });

//     res.send({
//       message: "success",
//       access_token: accessToken,
//     });
//   } catch (e) {
//     return next(new AppError(401, "Invalid email or password!"));
//   }
// };

// export const logoutHandler = async (req: Request, res: Response) => {
//   if (req.cookies["accessToken"]) {
//     res.cookie("accessToken", "", {maxAge: 0});
//     res.cookie("refreshToken", "", {maxAge: 0});
//     return res.status(200).json({message: "Logout successfully!"});
//   }
//   return res.status(400).json({message: "Already logout!"});
// };
