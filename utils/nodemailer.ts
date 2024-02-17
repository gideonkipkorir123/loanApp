import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();
import nodemailerSendgrid from 'nodemailer-sendgrid';

const transport = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY as string,
    })
);

export const sendEmail = async (params: {
    email: string
    subject: string
    data: string

}) => {
    return transport.sendMail({
        from: process.env.DEV_EMAIL,
        to: params.email,
        subject: params.subject,
        html: params.data
    });
}