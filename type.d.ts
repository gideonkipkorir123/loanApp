import { Request as ExpressRequest } from 'express-serve-static-core';

interface Address {
    location?: string;
    houseNumber?: string;
    apartmentName?: string;
}

export interface UserInterface {
    _id?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    status?: boolean;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
    address?: Address[];
    phoneVerified?: boolean;
    emailVerified?: boolean;
    signEmailToken?: string;
    role?: string;
    profileImageURL?: string;
    frontIdURL?: string;  
    backIdURL?: string;  
    signatureURL?: string;
    resetPasswordToken?: string;
}

declare module 'express-serve-static-core' {
    interface Request extends ExpressRequest {
        user?: UserInterface;
    }
}
