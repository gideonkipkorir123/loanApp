import { Request, Response } from 'express';
import {
    createUser,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser,
} from '../utils/user';
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import { passwordValidationSchema, userValidationSchema } from '../validations/user';

// Controller for creating a new user
export const createUserController = async (
    req: Request,
    res: Response,
) => {

    const { phoneNumber, fullName, address, email, password ,role} = req.body;

    const { error, value } = userValidationSchema.validate(req.body);
    if (error) {
        return res.status(400).json(error.message);
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await createUser({
            phoneNumber,
            fullName,
            address,
            email,
            role,
            password: hashedPassword,
        });
        return res.status(201).json({ message:"user created successfully" });

    } catch (error: any) {
        return res.status(500).json(error.message);
    }
};


// Controller for getting a user by ID
export const getUserByIdController = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;

    try {
        const user = await getUserById(userId);

        if (user) {
            res.json(user);

        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Controller for getting all users
export const getAllUsersController = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Controller for updating a user by ID
export const updateUserByIdController = async (req: Request, res: Response) => {
    try {
        const { id: userId } = req.params;
        const { password, ...otherFields } = req.body;
        let args: any = { ...otherFields };

        if (password) {
            const { error, value } = passwordValidationSchema.validate({ password });
            if (error) {
                return res.status(400).json(error.message);
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            args.password = hashedPassword;
        }

        const user = await updateUser(userId, args);
        // console.log(user, 'User')

        if (!user) {
            return res
                .status(404)
                .json({ message: "User not found or doesn't exist" });
        }

        return res.status(200).json(user);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

// Controller for deleting a user by ID
export const deleteUserController = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;

    try {
        await deleteUser(userId);
        res.json({ message: 'User deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
