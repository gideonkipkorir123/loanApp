"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_2 = require("../validations/user");
// Controller for creating a new user
const createUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { phoneNumber, fullName, address, email, password } = req.body;
    const { error, value } = user_2.userValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json(error.message);
    }
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = yield (0, user_1.createUser)({
            phoneNumber,
            fullName,
            address,
            email,
            password: hashedPassword,
        });
        const jwtTokenSecret = process.env.JWT_TOKEN_SECRET;
        const accessToken = jsonwebtoken_1.default.sign({
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
        }, jwtTokenSecret, {
            expiresIn: "1h",
        });
        const refreshToken = jsonwebtoken_1.default.sign({
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
        }, jwtTokenSecret, {
            expiresIn: "7d",
        });
        console.log((_a = req.user) === null || _a === void 0 ? void 0 : _a.address);
        return res.status(201).json({ user, accessToken, refreshToken });
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
});
exports.createUserController = createUserController;
// Controller for getting a user by ID
const getUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const user = yield (0, user_1.getUserById)(userId);
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
});
exports.getUserByIdController = getUserByIdController;
// Controller for getting all users
const getAllUsersController = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, user_1.getAllUsers)();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllUsersController = getAllUsersController;
// Controller for updating a user by ID
const updateUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userId } = req.params;
        const _b = req.body, { password } = _b, otherFields = __rest(_b, ["password"]);
        let args = Object.assign({}, otherFields);
        if (password) {
            const { error, value } = user_2.passwordValidationSchema.validate({ password });
            if (error) {
                return res.status(400).json(error.message);
            }
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPassword = yield bcrypt_1.default.hash(password, salt);
            args.password = hashedPassword;
        }
        const user = yield (0, user_1.updateUser)(userId, args);
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
});
exports.updateUserByIdController = updateUserByIdController;
// Controller for deleting a user by ID
const deleteUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        yield (0, user_1.deleteUser)(userId);
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteUserController = deleteUserController;
