import { Request, Response, NextFunction } from "express";
// import { get } from "lodash";

// const AppError = require('../utils/appError')
import { createUser, findUserByEmail } from "../services/user.service";
import { sendEmail } from "../services/email.service";
import log from "../logger";
import { generateCode } from "../utils/generateKey";

export async function registerHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const confirmationCode = generateCode(25);

    const data = {
      ...req.body,
      verified: false,
      verificationCode: confirmationCode
    };
    const user = await createUser(data);

    const link = `http://localhost:3000/api/users/verification-account/${confirmationCode}/${user.email}`;

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

export async function forgotPasswordHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      log.debug(`User with email ${email} does not exists`);
      return res.status(500).send({
        success: false,
        message: `User with email ${email} does not exists`
      });
    }
  
    if (!user.verified) {
      return res.status(403).send({
        success: false,
        message: "User is not verified"
      });
    }
  
    // generate password reset code
    const passwordResetCode = generateCode(25); 
    user.passwordResetCode = passwordResetCode;

    const link = `http://localhost:3000/api/users/reset-password/${passwordResetCode}/${email}`;
  
    // update user in DB
    await user.save();
  
    // send email
    const message = {
      to: user.email,
      from: {
        name: "Express TS",
        email: "senanisammy@gmail.com",
      },
      subject: "Reset your password",
      text: `Password Reset Account, please click in the link below.\n${link}`,
      // html: generateEmailTemplate(obj),
    };
    await sendEmail(message);
  
    log.debug(`Password reset email sent to ${email}`);
  
    return res.status(201).send({
      success: true,
      message: "Your forgot password link has been sent successfully"
    });
  } catch (err: any) {
    log.error(err);
    return res.status(409).send({
      success: false,
      message: err.message
    });
  }
};

export async function resetPasswordHandler(req: Request, res: Response, next: NextFunction) {
  try {    
    const user = await findUserByEmail(req.params.email);
    const codeUrl = req.params.passwordResetCode;

    if (!user || !user.passwordResetCode || codeUrl == user.passwordResetCode) {
      return res.status(400).send("Could not reset user password");
    }
    const { password } = req.body;

    user.passwordResetCode = null;
    user.password = password; // hash password

    await user.save(); // update user in DB

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

    return res.status(201).send({
      success: true,
      message: "Password Successfully Reseted"
    });

  } catch (err: any) {
    log.error(err);
    return res.status(409).send({
      success: false,
      message: err.message
    });
  }
};

export async function verificationAccountHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await findUserByEmail(req.params.email);

    const codeUrl = req.params.verificationCode;

    if (codeUrl == user.verificationCode) {
      user.verified = true;
      await user.save(); // update user DB verified: true
      return res.status(200).send({
        success: true,
        message: "Account Confirmed Successfully"
      });
    }
    return res.status(403).send({
      success: false,
      message: "wrong code verification !"
    })
    
  } catch(err: any) {
    log.error(err);
    return res.status(409).send({
      success: false,
      message: err.message
    });
  }
};