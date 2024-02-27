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
    invoice: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Invoice",
    },
    interestRate: {
        type: Number,
        default: 10,
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
    returnedAmount: {
        type: Number,
        default: 0,
    },
    endDate: {
        type: Date,
    },
}, { timestamps: true });
loanSchema.virtual("remainingTime").get(function () {
    var _a;
    const now = new Date();
    const remainingMilliseconds = (((_a = this.get("endDate")) === null || _a === void 0 ? void 0 : _a.getTime()) || 0) - now.getTime();
    if (remainingMilliseconds <= 0) {
        return "Loan expired";
    }
    const remainingDays = Math.ceil(remainingMilliseconds / (1000 * 60 * 60 * 24));
    return `${remainingDays} days remaining`;
});
loanSchema.pre("save", function (next) {
    var _a;
    const now = new Date();
    if (!this.get("startDate") || this.isNew) {
        this.set("startDate", now);
    }
    // Calculate endDate
    const calculatedEndDate = new Date(this.get("startDate"));
    calculatedEndDate.setDate(calculatedEndDate.getDate() + (((_a = this.get("endDate")) === null || _a === void 0 ? void 0 : _a.getDate()) || 0));
    this.set("endDate", calculatedEndDate);
    // Calculate returnedAmount
    this.set("returnedAmount", this.get("amount") * (1 + this.get("interestRate") / 100));
    next();
});
const Loan = mongoose_1.default.model("Loan", loanSchema);
exports.default = Loan;
