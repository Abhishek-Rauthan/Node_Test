import express, { Application, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { userRouter } from "./users/users.router";
import dotenv from "dotenv";
import cors from "cors";
import { AppError } from "./utils/appError";
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

mongoose.connect(process.env.MONGODB_URL!);

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);

app.use("*", (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found!!`, 404));
});

app.use(function (
  error: AppError,
  request: Request,
  response: Response,
  next: NextFunction
) {
  response.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack,
  });
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
