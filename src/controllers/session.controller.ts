import { get } from "lodash";
import { Request, Response } from "express";

import config from "config";
import { validatePassword } from "../services/user.service";
import {
  createSession,
  createAccessToken,
  updateSession,
  findSessions,
} from "../services/session.service";
import { sign } from "../utils/jwt.utils";

export async function loginHandler(req: Request, res: Response) {
  // validate the email and password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send({
      success: false,
      message: "Invalid username or password"
    });
  }

  // Create a session
  const session = await createSession(user._id, req.get("user-agent") || "");

  // create access token
  const accessToken = createAccessToken({ user, session });

  // create refresh token
  const refreshToken = sign(session, {
    expiresIn: config.get("refreshTokenTtl"), // 1 year
  });

  // send refresh & access token back
  return res.status(200).send({
    success: true,
    data: { accessToken, refreshToken }
  });
};

export async function invalidateUserSessionHandler(req: Request, res: Response) {
  const sessionId = get(req, "user.session");

  await updateSession({ _id: sessionId }, { valid: false });

  return res.status(200).send({
    success: true
  });
};

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = get(req, "user._id");

  const sessions = await findSessions({ user: userId, valid: true });

  return res.status(200).send({
    success: true,
    data: sessions
  });
};