import { Express, Request, Response } from "express";

import { createUserHandler, forgotPasswordHandler, resetPasswordHandler } from "../controllers/user.controller";
import { validateRequest, requiresUser } from "../middlewares";
import { createUserSchema, createUserSessionSchema, forgotPasswordSchema, resetPasswordSchema } from "../schema/user.schema";

import { createUserSessionHandler, invalidateUserSessionHandler, getUserSessionsHandler } from "../controllers/session.controller";

export default function (app: Express) {
//   app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  // Register user
  app.post("/api/users", validateRequest(createUserSchema), createUserHandler);

  // Login
  app.post("/api/sessions", validateRequest(createUserSessionSchema), createUserSessionHandler);

  // Get the user's sessions
  app.get("/api/sessions", requiresUser, getUserSessionsHandler);

  // Logout
  app.delete("/api/sessions", requiresUser, invalidateUserSessionHandler);

  // forgot password
  app.post("/api/users/forgotpassword", validateRequest(forgotPasswordSchema), forgotPasswordHandler);
  
  // reset password
  app.post("/api/users/resetpassword/:id/:passwordResetCode", validateRequest(resetPasswordSchema), resetPasswordHandler);

}