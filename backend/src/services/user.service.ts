import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SignupSchema, LoginSchema } from "../dtos/user.dto";
import { HttpException } from "../exceptions/http-exception";
import {
  createUser,
  findUserByEmail,
} from "../repositories/user.repository";
import { findUserById } from "../repositories/user.repository";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"];

/**
 * REGISTER USER
 */
export const registerUser = async (data: unknown) => {
  // 1. Validate input
  const validatedData = SignupSchema.parse(data);

  const { fullName, email, role, password } = validatedData;

  // 2. Check if user exists (via repository)
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new HttpException(400, "Email already exists");
  }

  // 3. Hash password (business logic layer)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 4. Create user via repository
  const user = await createUser({
    fullName,
    email,
    role,
    password: hashedPassword,
  });

  // 5. Return safe response
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
};

/**
 * LOGIN USER
 */
export const loginUser = async (data: unknown) => {
  // 1. Validate input
  const validatedData = LoginSchema.parse(data);

  const { email, password } = validatedData;

  // 2. Find user via repository
  const user = await findUserByEmail(email);

  if (!user) {
    throw new HttpException(404, "User not found");
  }

  // 3. Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new HttpException(401, "Invalid credentials");
  }

  // 4. Generate JWT
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  // 5. Return response
  return {
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
};