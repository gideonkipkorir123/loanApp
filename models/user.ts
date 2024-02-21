import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        unique: true,
    },
    resetPasswordToken: {
        type: String,

    },
    profileImageURL: {
        type: String,
        required: true
    },
    frontIdURL: {
        type: String,
        required: true
    },
    backIdURL: {
        type: String,
        required: true
    },
    signatureURL: {
        type: String,
        required: true
    },
    profileImageUpdatedAt: {
        type: Date,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,

    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    phoneVerified: {
        type: Boolean,
        default: false
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user']
    },
    status: {
        type: Boolean,
        default: true,
    },
    address: [
        {
            location: {
                type: String,
                required: true

            },
            apartmentName: {
                type: String,

            },
            houseNumber: {
                type: String,

            },
        },
    ],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
