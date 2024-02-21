import express from 'express';
import {
    createUserController,
    getUserByIdController,
    getAllUsersController,
    updateUserByIdController,
    deleteUserController,
} from '../controllers/user';
import { updateUserProfileImageHandler, uploadFilesHandler } from '../controllers/uploadDocs';
const userRouter = express.Router();

// Route for creating a new user
userRouter.post('/', createUserController);

// Route for getting a user by ID
userRouter.get('/:id', getUserByIdController);

// Route for getting all users
userRouter.get('/', getAllUsersController);

// Route for updating a user by ID
userRouter.patch('/:id', updateUserByIdController);

// Route for deleting a user by ID
userRouter.delete('/:id', deleteUserController);


// user upload
userRouter.post('/upload', uploadFilesHandler, updateUserProfileImageHandler);





export default userRouter;
