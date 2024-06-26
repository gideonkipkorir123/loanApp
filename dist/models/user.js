"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
        required: false
    },
    frontIdURL: {
        type: String,
        required: false
    },
    backIdURL: {
        type: String,
        required: false
    },
    signatureURL: {
        type: String,
        required: false
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
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
