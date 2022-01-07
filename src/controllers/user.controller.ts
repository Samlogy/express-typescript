import { Request, Response } from "express";
// import { omit } from "lodash";

import { createUser, findUserByEmail, findUserById } from "../services/user.service";
import log from "../logger";

export async function RegisterHandler(req: Request, res: Response) {
  try {
    const data = {
      ...req.body,
      verified: false
    };
    const user = await createUser(data);
    // send email with account verification code (verificationCode)
    return res.status(201).send(user);
  } catch (err: any) {
    log.error(err);
    return res.status(409).send(err.message);
  }
};

export async function forgotPasswordHandler(req: Request, res: Response) {
  try {
    const message = "If a user with that email is registered you will receive a password reset email";
    const { email } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      log.debug(`User with email ${email} does not exists`);
      return res.send(message);
    }
  
    if (!user.verified) {
      return res.send("User is not verified");
    }
  
    const passwordResetCode = "nanoid();" // generate password reset code
  
    user.passwordResetCode = passwordResetCode;
  
    // await user.save();
    // await saveUser(user); // update user in DB
  
    // await sendEmail({ // send email
    //   to: user.email,
    //   from: "test@example.com",
    //   subject: "Reset your password",
    //   text: `Password reset code: ${passwordResetCode}. Id ${user._id}`,
    // });
  
    log.debug(`Password reset email sent to ${email}`);
  
    return res.status(201).send(message);
  } catch (err: any) {
    log.error(err);
    return res.status(409).send(err.message);
  }
};

export async function resetPasswordHandler(req: Request, res: Response) {
  try {
    const { id, passwordResetCode } = req.params;

    const { password } = req.body;

    const user = await findUserById(id);

    if (!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
      return res.status(400).send("Could not reset user password");
    }

    user.passwordResetCode = null;
    user.password = password;
    // await user.save(); // update user in DB

    return res.status(201).send("Successfully updated password");

  } catch (err: any) {
    log.error(err);
    return res.status(409).send(err.message);
  }
};