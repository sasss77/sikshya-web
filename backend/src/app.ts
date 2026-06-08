import express from "express";
import cors from "cors";
import morgan from "morgan";

import userRoutes from "./routes/user.route";
import { errorMiddleware } from "./middlewares/errror.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

/**
 * Health Check
 */
app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Sikshya Auth API Running",
  });
});

/**
 * Routes
 */
app.use("/api/users", userRoutes);

/**
 * Global Error Handler (MUST be last)
 */
app.use(errorMiddleware);

export default app;