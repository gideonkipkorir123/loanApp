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
        return user; //error
    } catch (error: any) {
        throw new Error(`Error getting user by ID: ${error.message}`);
    }
}
export async function getUserByEmail(email: string): Promise<UserInterface | null> {
    try {
        const user = await User.findOne({email}).lean() as UserInterface;
        return user; 
    } catch (error: any) {
        throw new Error(`Error getting user by Email: ${error.message}`);
    }
}
export async function getUserByPhoneNumber(phoneNumber: string): Promise<UserInterface | null> {
    try {
        const user = await User.findOne({ phoneNumber }).lean() as UserInterface;
        return user; 
    } catch (error: any) {
        throw new Error(`Error getting user by phoneNumber: ${error.message}`);
    }
}
export async function getUserByResetToken(resetPasswordToken: string): Promise<UserInterface | null> {
    try {
        const user = await User.findOne({ resetPasswordToken }).lean() as UserInterface;
        return user; //error
    } catch (error: any) {
        throw new Error(`Error getting user by ID: ${error.message}`);
    }
}
// get user via reset otp sent via sms
export async function getUserByResetOTP(resetPasswordOTP: string): Promise<UserInterface | null> {
    try {
        const user = await User.findOne({ resetPasswordOTP }).lean() as UserInterface;
        return user; //error
    } catch (error: any) {
        throw new Error(`Error getting user by resetPasswordOTP: ${error.message}`);
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
export async function updateUser(userId: string, userData: UserInterface): Promise<UserInterface | null> {
    try {
        const user = await User.findByIdAndUpdate(userId, userData, { new: true }).lean() as UserInterface;
        return user;
    } catch (error: any) {
        throw new Error(`Error updating user: ${error.message}`);
    }
}

export async function updateUserByEmail(email: string, userData: UserInterface): Promise<UserInterface | null> {
    try {
        const user = await User.findOneAndUpdate({email}, userData, { new: true }).lean() as UserInterface;
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
export const emailExists = async (email: string): Promise<boolean> => {
    const unverifiedEmail = await User.findOne({ email }).lean() as UserInterface;
    return !!unverifiedEmail; // Return true if the user exists, false otherwise
};
export const getUserBySignToken = async (email: string, signEmailToken: string): Promise<any> => {
    try {
        const otpEntry = await User.findOne({ email, signEmailToken });
        return otpEntry;
    } catch (error) {
        console.error('Error getting signToken by email:', error);
        throw error;
    }
};