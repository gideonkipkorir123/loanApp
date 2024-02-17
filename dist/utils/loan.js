"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLoanById = exports.updateLoanById = exports.getLoanById = exports.getAllLoans = exports.createLoan = void 0;
const loan_1 = __importDefault(require("../models/loan"));
// Create a new loan
const createLoan = async (loanData) => {
    try {
        const newLoan = await loan_1.default.create(loanData);
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
        throw new Error(`Error getting all loans: ${error.message}`);
    }
};
exports.getAllLoans = getAllLoans;
// Get a loan by ID
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
// Update a loan by ID
const updateLoanById = async (loanId, updateData) => {
    try {
        const updatedLoan = await loan_1.default.findByIdAndUpdate(loanId, updateData, { new: true });
        return updatedLoan;
    }
    catch (error) {
        throw new Error(`Error updating loan by ID: ${error.message}`);
    }
};
exports.updateLoanById = updateLoanById;
// Delete a loan by ID
const deleteLoanById = async (loanId) => {
    try {
        await loan_1.default.findByIdAndDelete(loanId);
    }
    catch (error) {
        throw new Error(`Error deleting loan by ID: ${error.message}`);
    }
};
exports.deleteLoanById = deleteLoanById;
