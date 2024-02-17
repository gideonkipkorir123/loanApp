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
exports.deleteUserController = exports.updateUserByIdController = exports.getAllUsersController = exports.getUserByIdController = exports.createUserController = void 0;
const user_1 = require("../utils/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_2 = require("../validations/user");
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
