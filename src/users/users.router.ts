import { Router } from "express";
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  patchUserById,
  updateUserById,
} from "./user.controller";

const userRouter = Router();

userRouter.route("/").get(getAllUsers).post(createUser);

userRouter
  .route("/:id")
  .get(getUserById)
  .delete(deleteUserById)
  .put(updateUserById)
  .patch(patchUserById);

export { userRouter };
