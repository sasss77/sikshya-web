import mongoose, { Schema, Document } from "mongoose";
import { UserRole } from "../types/user.type";

/**
  User Document Interface
 */
export interface IUserDocument extends Document {
  fullName: string;
  email: string;
  role: UserRole;
  password: string;
}

//  schema 

const userSchema = new Schema<IUserDocument>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["student", "tutor"],
      required: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  {
    timestamps: true,
  }
);

/**
  Export model
 */
export const UserModel = mongoose.model<IUserDocument>(
  "User",
  userSchema
);