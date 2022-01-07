import { Request, Response } from "express";
// import { omit } from "lodash";

import { createUser, findUserByEmail, findUserById } from "../services/user.service";
import { sendEmail } from "../services/email.service";
import log from "../logger";
import { generateKey } from "../utils/generateKey";

export async function registerHandler(req: Request, res: Response) {
  try {
    const confirmationCode = generateKey(25);

    const data = {
      ...req.body,
      verified: false,
      verificationCode: confirmationCode
    };
    const user = await createUser(data);

    const link = `http://localhost:3000/api/users/verification-account/${confirmationCode}`

    // send email with account verification code (verificationCode)
    const message = {
      to: user.email,
      from: {
        name: "Express TS",
        email: "senanisammy@gmail.com",
      },
      subject: "Email Confirmation Account",
      text: `Confirmation Account, please click in the link below.\n${link}`,
      // html: generateEmailTemplate(obj),
    };

    await sendEmail(message);
    return res.status(201).send(user);
  } catch (err: any) {
    log.error(err);
    return res.status(409).send(err.message);
  }
};

export async function forgotPasswordHandler(req: Request, res: Response) {
  try {
    const { email } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      log.debug(`User with email ${email} does not exists`);
      return res.status(500).send(`User with email ${email} does not exists`);
    }
  
    if (!user.verified) {
      return res.send("User is not verified");
    }
  
    // generate password reset code
    const passwordResetCode = generateKey(25); 
  
    user.passwordResetCode = passwordResetCode;
  
    // update user in DB
    // await user.save();
  
    // send email
    const message = {
      to: user.email,
      from: {
        name: "Express TS",
        email: "senanisammy@gmail.com",
      },
      subject: "Reset your password",
      text: `Password reset code: ${passwordResetCode}. Id ${user._id}`,
      // html: generateEmailTemplate(obj),
    };

    await sendEmail(message);
  
    log.debug(`Password reset email sent to ${email}`);
  
    return res.status(201).send("Your forgot password link has been sent successfully");
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

    // send email
    const message = {
      to: user.email,
      from: {
        name: "Express TS",
        email: "senanisammy@gmail.com",
      },
      subject: "Reset Password",
      text: `Your password has been updated successfully`,
      // html: generateEmailTemplate(obj),
    };

    await sendEmail(message);

    return res.status(201).send("Password Successfully Reseted");

  } catch (err: any) {
    log.error(err);
    return res.status(409).send(err.message);
  }
};

export async function verificationAccountHandler(req: Request, res: Response) {
  try {
    // update user DB verified: true
  } catch(err: any) {
    log.error(err);
    return res.status(409).send(err.message);
  }
};