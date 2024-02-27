"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const loanSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    amount: {
        type: Number,
        required: true,
        min: 1000,
    },
    interestRate: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
    },
}, { timestamps: true });
loanSchema.virtual("remainingTime").get(function () {
    var _a;
    const now = new Date();
    const remainingMilliseconds = (((_a = this.endDate) === null || _a === void 0 ? void 0 : _a.getTime()) || 0) - now.getTime();
    if (remainingMilliseconds <= 0) {
        return "Loan expired";
    }
    const remainingDays = Math.ceil(remainingMilliseconds / (1000 * 60 * 60 * 24));
    return `${remainingDays} days remaining`;
});
loanSchema.pre("save", function (next) {
    if (this.isModified("startDate") || this.isModified("duration")) {
        const calculatedEndDate = new Date(this.startDate);
        calculatedEndDate.setDate(calculatedEndDate.getDate() + this.duration);
        this.endDate = calculatedEndDate;
    }
    next();
});
const Loan = mongoose_1.default.model("Loan", loanSchema);
exports.default = Loan;
