import User from '../models/user';
import { UserInterface } from '../type';

// CREATE (Insert a new user)
export async function createUser(user: UserInterface) {
    try {
        const newUser = new User(user);
        const createdUser = await newUser.save()
        return createdUser;
    } catch (error: any) {
        throw new Error(`Error creating user: ${error.message}`);
    }
}

// READ (Get a user by ID)
export async function getUserById(userId: string): Promise<UserInterface | null> {
    try {
        const user = await User.findById(userId).lean() as UserInterface;
        return user ; //error
    } catch (error: any) {
        throw new Error(`Error getting user by ID: ${error.message}`);
    }
}

// READ (Get all users)
export async function getAllUsers(): Promise<UserInterface[]> {
    try {
        const users = await User.find().lean() as UserInterface[];
        return users;
    } catch (error: any) {
        throw new Error(`Error getting all users: ${error.message}`);
    }
}

// UPDATE (Update a user by ID)
export async function updateUser(userId: string, updatedUser: UserInterface): Promise<UserInterface | null> {
    try {
        const user = await User.findByIdAndUpdate(userId, updatedUser, { new: true }).lean() as UserInterface;
        return user;
    } catch (error: any) {
        throw new Error(`Error updating user: ${error.message}`);
    }
}

// DELETE (Delete a user by ID)
export async function deleteUser(userId: string): Promise<void> {
    try {
        await User.findByIdAndDelete(userId);
    } catch (error: any) {
        throw new Error(`Error deleting user: ${error.message}`);
    }
}
