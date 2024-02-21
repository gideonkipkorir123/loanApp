"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.signEmail = exports.deleteUserController = exports.updateUserByIdController = exports.getAllUsersController = exports.getUserByIdController = exports.createUserController = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const user_1 = require("../utils/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_2 = require("../validations/user");
const nodemailer_1 = require("../utils/nodemailer");
const jwt_1 = require("../utils/jwt");
// Controller for creating a new user
const createUserController = async (req, res) => {
    const { phoneNumber, fullName, address, email, password, role } = req.body;
    const { error, value } = user_2.userValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json(error.message);
    }
    try {
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        const user = await (0, user_1.createUser)({
            phoneNumber,
            fullName,
            address,
            email,
            role,
            password: hashedPassword,
        });
        return res.status(201).json({ message: "user created successfully" });
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
};
exports.createUserController = createUserController;
// Controller for getting a user by ID
const getUserByIdController = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await (0, user_1.getUserById)(userId);
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getUserByIdController = getUserByIdController;
// Controller for getting all users
const getAllUsersController = async (_req, res) => {
    try {
        const users = await (0, user_1.getAllUsers)();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllUsersController = getAllUsersController;
// Controller for updating a user by ID
const updateUserByIdController = async (req, res) => {
    try {
        const { id: userId } = req.params;
        const _a = req.body, { password } = _a, otherFields = __rest(_a, ["password"]);
        let args = Object.assign({}, otherFields);
        if (password) {
            const { error, value } = user_2.passwordValidationSchema.validate({ password });
            if (error) {
                return res.status(400).json(error.message);
            }
            const salt = await bcrypt_1.default.genSalt(10);
            const hashedPassword = await bcrypt_1.default.hash(password, salt);
            args.password = hashedPassword;
        }
        const user = await (0, user_1.updateUser)(userId, args);
        // console.log(user, 'User')
        if (!user) {
            return res
                .status(404)
                .json({ message: "User not found or doesn't exist" });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
exports.updateUserByIdController = updateUserByIdController;
// Controller for deleting a user by ID
const deleteUserController = async (req, res) => {
    const userId = req.params.id;
    try {
        await (0, user_1.deleteUser)(userId);
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteUserController = deleteUserController;
// VERIFY EMAIL
const signEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const token = (0, jwt_1.signJWT)({ email }, '10m');
        // await createVerifyEmail(email, EmailToken)
        const subject = 'Confirm Email Address';
        const BASE_URL = process.env.BASE_URL;
        const verifyEmailLinkUrl = `${BASE_URL}/auth/signEmailPage/${token}`;
        const data = `<p>Click this Link To Confirm Your Email Address</p>
                     <a href=${verifyEmailLinkUrl}>Confirm Email Link</a>`;
        await (0, nodemailer_1.sendEmail)({ email, subject, data });
        return res.status(200).json({ message: "Email verification link sent successfully", token });
    }
    catch (error) {
        console.error(`Error generating verifyEmailLink: ${error.message}`);
        return res.status(500).json({ error: { message: "Something went wrong. Please try again." } });
    }
};
exports.signEmail = signEmail;
const verifyEmail = async (req, res) => {
    var _a;
    try {
        const { token } = req.body;
        const decodedData = (0, jwt_1.verifyJWT)(token);
        if (!decodedData || decodedData.expired === true) {
            return res.status(400).json({ message: !decodedData ? "Invalid Token" : "Token Expired" });
        }
        const email = (_a = decodedData.payload) === null || _a === void 0 ? void 0 : _a.email;
        const updatedUser = await (0, user_1.updateUserByEmail)(email, { emailVerified: true });
        return res.json(updatedUser);
    }
    catch (error) {
        return res.status(500).json({ message: `Something went wrong: ${error.message}` });
    }
};
exports.verifyEmail = verifyEmail;
