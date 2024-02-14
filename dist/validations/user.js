"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordValidationSchema = exports.userValidationSchema = void 0;
const Joi = require("joi");
exports.userValidationSchema = Joi.object({
    fullName: Joi.string()
        .alphanum() // Allow alphanumeric characters
        .min(3) // Minimum length of 3
        .max(30) // Maximum length of 30
        .required(), // Required field
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "org"] } }) // Validate as email with specific domain requirements
        .required(),
    password: Joi.string()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})")) // Enforce password complexity
        .required(),
    address: Joi.array().required(),
    phoneNumber: Joi.string()
        .pattern(new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]+$"))
        .required(),
});
exports.passwordValidationSchema = Joi.object({
    password: Joi.string()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})")) // Enforce password complexity
        .required(),
});
