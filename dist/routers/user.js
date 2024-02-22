"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const uploadDocs_1 = require("../controllers/uploadDocs");
const userRouter = express_1.default.Router();
// Route for creating a new user
userRouter.post('/', user_1.createUserController);
// Route for getting a user by ID
userRouter.get('/:id', user_1.getUserByIdController);
// Route for getting all users
userRouter.get('/', user_1.getAllUsersController);
// Route for updating a user by ID
userRouter.patch('/:id', user_1.updateUserByIdController);
// Route for deleting a user by ID
userRouter.delete('/:id', user_1.deleteUserController);
// user upload
userRouter.post('/upload', uploadDocs_1.uploadFilesHandler, uploadDocs_1.updateUserProfileImageHandler);
exports.default = userRouter;
