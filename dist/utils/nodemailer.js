"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const nodemailer_sendgrid_1 = __importDefault(require("nodemailer-sendgrid"));
const transport = nodemailer_1.default.createTransport((0, nodemailer_sendgrid_1.default)({
    apiKey: process.env.SENDGRID_API_KEY
}));
const sendEmail = async (params) => {
    return transport.sendMail({
        from: process.env.DEV_EMAIL,
        to: params.email,
        subject: params.subject,
        html: params.data
    });
};
exports.sendEmail = sendEmail;
