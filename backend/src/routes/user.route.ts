import { Router } from "express";
import { register, login } from "../controllers/user.controller";

const router = Router();

/**
  REGISTER USER
  POST /api/users/register
 */
router.post("/register", register);

/**
  LOGIN USER
  POST /api/users/login
 */
router.post("/login", login);

export default router;