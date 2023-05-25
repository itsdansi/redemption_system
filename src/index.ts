import cookieParser from "cookie-parser";
import express, {Request, Response, NextFunction} from "express";
import cors from "cors";
import {createConnection} from "typeorm";
import indexRoute from "./routes/index";
import AppError from "./utils/appError";
import dotenv from "dotenv";
import {importUserData} from "./crawler";

dotenv.config();

const port = process.env.PORT;

createConnection().then(() => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin:["*","http://localhost:3000","https://nichinodemo.nupipay.com"],
      methods:'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      // preflightContinue:false,
      credentials: true,
    })
  );

  // ROUTES
  app.use("/api", indexRoute);

  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(404, `Route ${req.originalUrl} not found`));
  });

  // GLOBAL ERROR HANDLER
  app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
    res.status(error?.statusCode || 500).json({
      status: error?.status || "error",
      message: error?.message || "Internal Server Error",
    });
  });

  app.listen(port || 8000, async () => {
    console.log(`Server started with pid: ${process.pid} on port: ${port}`);
  });
});
