import { Express } from "express";

import { registerHandler, forgotPasswordHandler, resetPasswordHandler, verificationAccountHandler } from "../controllers/user.controller";
import { validateRequest, requiresUser } from "../middlewares";
import { RegisterSchema, LoginSchema, forgotPasswordSchema, resetPasswordSchema } from "../schema/user.schema";

import { loginHandler, invalidateUserSessionHandler, getUserSessionsHandler } from "../controllers/session.controller";

export default function (app: Express) {
  
  // Register user
  app.post("/api/users", validateRequest(RegisterSchema), registerHandler);

  // Login
  app.post("/api/sessions", validateRequest(LoginSchema), loginHandler);

  // Get the user's sessions
  app.get("/api/sessions", requiresUser, getUserSessionsHandler);

  // Logout
  app.delete("/api/sessions", requiresUser, invalidateUserSessionHandler);

  // forgot password
  app.post("/api/users/forgotpassword", validateRequest(forgotPasswordSchema), forgotPasswordHandler);
  
  // reset password
  app.post("/api/users/resetpassword/:id/:passwordResetCode", validateRequest(resetPasswordSchema), resetPasswordHandler);

  // user account verification
  app.get("/api/users/verification-account/:verificationCode", verificationAccountHandler);
  
}