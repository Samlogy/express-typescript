const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


export const sendEmail = async (message: any) => {
    try{
        await sgMail.send(message);
        return true;
    } catch(err: any) {
        console.error(err.message);
        return false;
    }
};