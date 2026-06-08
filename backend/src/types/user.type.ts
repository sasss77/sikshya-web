export type UserRole = "student" | "tutor" | "admin";

export interface IUser {
  fullName: string;
  email: string;
  role: UserRole;
  password: string;
}