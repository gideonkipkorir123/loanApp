"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLoanById = exports.updateLoanById = exports.getLoanById = exports.getAllLoans = exports.createLoan = void 0;
const loan_1 = __importDefault(require("../models/loan"));
// Create a new loan
const createLoan = async (invoice) => {
    var _a, _b;
    try {
        const userId = (_b = (_a = invoice.user) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString();
        const amount = invoice.amount;
        const duration = invoice.duration;
        const newLoan = new loan_1.default({
            userId,
            amount,
            duration,
            status: 'approved',
        });
        await newLoan.save();
        return newLoan;
    }
    catch (error) {
        throw new Error(`Error creating loan: ${error.message}`);
    }
};
exports.createLoan = createLoan;
// Get all loans
const getAllLoans = async () => {
    try {
        const loans = await loan_1.default.find();
        return loans;
    }
    catch (error) {
        throw new Error(`Error getting loans: ${error.message}`);
    }
};
exports.getAllLoans = getAllLoans;
// Get loan by ID
const getLoanById = async (loanId) => {
    try {
        const loan = await loan_1.default.findById(loanId);
        return loan;
    }
    catch (error) {
        throw new Error(`Error getting loan by ID: ${error.message}`);
    }
};
exports.getLoanById = getLoanById;
// Update loan by ID
const updateLoanById = async (loanId, updateData) => {
    try {
        const loan = await loan_1.default.findByIdAndUpdate(loanId, updateData, { new: true });
        return loan;
    }
    catch (error) {
        throw new Error(`Error updating loan by ID: ${error.message}`);
    }
};
exports.updateLoanById = updateLoanById;
// Delete loan by ID
const deleteLoanById = async (loanId) => {
    try {
        await loan_1.default.findByIdAndDelete(loanId);
    }
    catch (error) {
        throw new Error(`Error deleting loan by ID: ${error.message}`);
    }
};
exports.deleteLoanById = deleteLoanById;
