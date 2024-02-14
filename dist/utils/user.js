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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.getUserById = exports.createUser = void 0;
const user_1 = __importDefault(require("../models/user"));
// CREATE (Insert a new user)
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newUser = new user_1.default(user);
            const createdUser = yield newUser.save();
            return createdUser;
        }
        catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    });
}
exports.createUser = createUser;
// READ (Get a user by ID)
function getUserById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_1.default.findById(userId).lean();
            console.log(user, "user");
            return user; //error
        }
        catch (error) {
            throw new Error(`Error getting user by ID: ${error.message}`);
        }
    });
}
exports.getUserById = getUserById;
// READ (Get all users)
function getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield user_1.default.find().lean();
            return users;
        }
        catch (error) {
            throw new Error(`Error getting all users: ${error.message}`);
        }
    });
}
exports.getAllUsers = getAllUsers;
// UPDATE (Update a user by ID)
function updateUser(userId, updatedUser) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_1.default.findByIdAndUpdate(userId, updatedUser, { new: true }).lean();
            return user;
        }
        catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    });
}
exports.updateUser = updateUser;
// DELETE (Delete a user by ID)
function deleteUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield user_1.default.findByIdAndDelete(userId);
        }
        catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    });
}
exports.deleteUser = deleteUser;
