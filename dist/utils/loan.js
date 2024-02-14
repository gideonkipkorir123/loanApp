"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLoanById = exports.updateLoanById = exports.getLoanById = exports.getAllLoans = exports.createLoan = void 0;
const loan_1 = __importDefault(require("../models/loan"));
// Create a new loan
const createLoan = (loanData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newLoan = yield loan_1.default.create(loanData);
        return newLoan;
    }
    catch (error) {
        throw new Error(`Error creating loan: ${error.message}`);
    }
});
exports.createLoan = createLoan;
// Get all loans
const getAllLoans = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loans = yield loan_1.default.find();
        return loans;
    }
    catch (error) {
        throw new Error(`Error getting all loans: ${error.message}`);
    }
});
exports.getAllLoans = getAllLoans;
// Get a loan by ID
const getLoanById = (loanId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loan = yield loan_1.default.findById(loanId);
        return loan;
    }
    catch (error) {
        throw new Error(`Error getting loan by ID: ${error.message}`);
    }
});
exports.getLoanById = getLoanById;
// Update a loan by ID
const updateLoanById = (loanId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedLoan = yield loan_1.default.findByIdAndUpdate(loanId, updateData, { new: true });
        return updatedLoan;
    }
    catch (error) {
        throw new Error(`Error updating loan by ID: ${error.message}`);
    }
});
exports.updateLoanById = updateLoanById;
// Delete a loan by ID
const deleteLoanById = (loanId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield loan_1.default.findByIdAndDelete(loanId);
    }
    catch (error) {
        throw new Error(`Error deleting loan by ID: ${error.message}`);
    }
});
exports.deleteLoanById = deleteLoanById;
