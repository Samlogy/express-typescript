import { Express } from "express";

import { RegisterHandler, forgotPasswordHandler, resetPasswordHandler } from "../controllers/user.controller";
import { validateRequest, requiresUser } from "../middlewares";
import { RegisterSchema, LoginSchema, forgotPasswordSchema, resetPasswordSchema } from "../schema/user.schema";

import { LoginHandler, invalidateUserSessionHandler, getUserSessionsHandler } from "../controllers/session.controller";

export default function (app: Express) {
//   app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  // Register user
  app.post("/api/users", validateRequest(RegisterSchema), RegisterHandler);

  // Login
  app.post("/api/sessions", validateRequest(LoginSchema), LoginHandler);

  // Get the user's sessions
  app.get("/api/sessions", requiresUser, getUserSessionsHandler);

  // Logout
  app.delete("/api/sessions", requiresUser, invalidateUserSessionHandler);

  // forgot password
  app.post("/api/users/forgotpassword", validateRequest(forgotPasswordSchema), forgotPasswordHandler);
  
  // reset password
  app.post("/api/users/resetpassword/:id/:passwordResetCode", validateRequest(resetPasswordSchema), resetPasswordHandler);

}