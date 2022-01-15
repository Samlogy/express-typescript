import { Express } from "express";

import { registerHandler, forgotPasswordHandler, resetPasswordHandler, verificationAccountHandler } from "../controllers/user.controller";
import { RegisterSchema, LoginSchema, forgotPasswordSchema, resetPasswordSchema } from "../schema/user.schema";
import { loginHandler, invalidateUserSessionHandler, getUserSessionsHandler } from "../controllers/session.controller";
import { validateRequest } from "../middlewares";
import { requiresUser, userRole } from "../middlewares/user.middleware";

export default function (app: Express) {
  // app.get('/check-health', (req, res) => res.send('its working'))
  
  // Register user
  app.post("/api/users", validateRequest(RegisterSchema), userRole('user'), registerHandler);

  // Login
  app.post("/api/sessions", validateRequest(LoginSchema), loginHandler);

  // Get the user's sessions
  app.get("/api/sessions", requiresUser, getUserSessionsHandler);

  // Logout
  app.delete("/api/sessions", requiresUser, invalidateUserSessionHandler);

  // forgot password
  app.post("/api/users/forgot-password", validateRequest(forgotPasswordSchema), forgotPasswordHandler);
  
  // reset password
  app.post("/api/users/reset-password/:passwordResetCode/:email", validateRequest(resetPasswordSchema), resetPasswordHandler);

  // user account verification
  app.get("/api/users/verification-account/:verificationCode/:email", verificationAccountHandler);
}