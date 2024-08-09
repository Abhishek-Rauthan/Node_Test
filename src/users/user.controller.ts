import { NextFunction, Request, Response } from "express";
import { Users } from "./user.schema";
import { AppError } from "../utils/appError";
import { hashPassword } from "../utils/passwordCrypt";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await Users.find();
    res.json({
      route: "/users",
      method: "GET",
      data: {
        users,
      },
    });
  } catch (error) {
    next(new AppError("Unable to get users", 404));
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email: string = req.body.email;
  const name: string = req.body.name;
  const password: string = req.body.password;
  const age = req.body.age;

  const hashedPassword = await hashPassword(password);

  if (!hashedPassword) {
    next(new AppError("Password couldn't be hashed!!\nTry again later", 200));
  } else {
    try {
      let user = await Users.findOne({ email: email });
      if (user) {
        return next(
          new AppError(`User with email: '${email}' already Exists`, 409)
        );
      }
      user = await Users.create({ email, name, password: hashedPassword, age });
      res.send({
        route: "/users",
        method: "POST",
        data: {
          user,
        },
      });
    } catch (error) {
      next(new AppError(`Unable to find user with email: '${email}'`, 404));
    }
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    const user = await Users.findById(id);
    res.json({
      route: `users${req.url}`,
      method: "GET",
      id,
      data: {
        user,
      },
    });
  } catch (error) {
    next(new AppError(`Unable to find user with id '${id}'`, 404));
  }
};

export const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    const user = await Users.findById(id);
    if (user) {
      user.deleteOne();
    } else {
      return next(new AppError(`Unable to find user with id '${id}'`, 404));
    }
    res.json({
      route: `users${req.url}`,
      method: "DELETE",
      id,
      data: {
        message: `Deleted user with id: '${id}'`,
      },
    });
  } catch (error) {
    next(new AppError(`Unable to delete user with id '${id}'`, 404));
  }
};

export const updateUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const password = req.body.password;
  const email = req.body.email;
  const hashedPassword = await hashPassword(password);

  try {
    const user = await Users.findById(id);
    const userWithEmail = await Users.findOne({ email: email });
    if (!user) {
      return next(new AppError(`Unable to find user with id '${id}'`, 404));

      // Checking if a different user already exists with same email id
    } else if (userWithEmail && user.id != userWithEmail.id) {
      return next(
        new AppError(`User with email: '${email}' already exists`, 409)
      );
    }
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = hashedPassword;
    user.age = req.body.age;
    user.save();
    res.json({
      route: `users${req.url}`,
      method: "PUT",
      id,
      data: {
        user,
      },
    });
  } catch (error) {
    next(new AppError(`Error Occurred while updating!!`, 500));
  }
};

export const patchUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let id = req.params.id;
  let email = req.body.email;
  try {
    let user = await Users.findById(id);
    const userWithEmail = await Users.findOne({ email: email });
    if (!user) {
      return next(new AppError(`Unable to find user with id '${id}'`, 404));

      // Checking if a different user already exists with same email id
    } else if (userWithEmail && user.id != userWithEmail.id) {
      return next(
        new AppError(`User with email: '${email}' already exists`, 409)
      );
    }

    for (const key in req.body) {
      if (key in user) {
        if (key === "password") {
          let password = await hashPassword(req.body[key]);
          user[key] = password;
        } else {
          // @ts-ignore
          user[key] = req.body[key];
        }
      }
    }
    user.save();
    res.send({
      route: `users${req.url}`,
      method: "PATCH",
      id,
      data: {
        user,
      },
    });
  } catch (error) {
    next(new AppError(`Error Occurred while updating!!`, 500));
  }
};
