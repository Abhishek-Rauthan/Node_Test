import { model, Schema } from "mongoose";

const userSchema = new Schema({
  // user email
  email: {
    type: Schema.Types.String,
    required: [true, "User must have an email"],
  },

  // user name
  name: {
    type: Schema.Types.String,
    required: [true, "User must have an name"],
  },

  // user password
  password: {
    type: Schema.Types.String,
    required: [true, "User must have a password"],
  },

  age: {
    type: Schema.Types.Number,
    required: [false],
  },
});

const Users = model("Users", userSchema);

export { Users };
