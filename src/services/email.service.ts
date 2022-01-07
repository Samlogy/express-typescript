const sgMail = require('@sendgrid/mail');
import config from "../../config/default";

sgMail.setApiKey(config.sendgridApiKey);


export const sendEmail = async (message: any) => {
    try{
        await sgMail.send(message);
        return true;
    } catch(err: any) {
        console.error(err.message);
        return false;
    }
};