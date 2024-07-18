import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unquie: true,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      default: "user",
    },
    contact: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);
export const userModel = mongoose.model("User", userSchema);
