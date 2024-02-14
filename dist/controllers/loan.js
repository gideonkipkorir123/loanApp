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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLoanByIdController = exports.updateLoanByIdController = exports.getLoanByIdController = exports.getAllLoansController = exports.createLoanController = void 0;
const loan_1 = require("../utils/loan");
// Create a new loan
const createLoanController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loanData = req.body;
        const newLoan = yield (0, loan_1.createLoan)(loanData);
        res.status(201).json(newLoan);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createLoanController = createLoanController;
// Get all loans
const getAllLoansController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loans = yield (0, loan_1.getAllLoans)();
        res.status(200).json(loans);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllLoansController = getAllLoansController;
// Get a loan by ID
const getLoanByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { loanId } = req.params;
        const loan = yield (0, loan_1.getLoanById)(loanId);
        if (loan) {
            res.status(200).json(loan);
        }
        else {
            res.status(404).json({ message: 'Loan not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getLoanByIdController = getLoanByIdController;
// Update a loan by ID
const updateLoanByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { loanId } = req.params;
        const updateData = req.body;
        const updatedLoan = yield (0, loan_1.updateLoanById)(loanId, updateData);
        if (updatedLoan) {
            res.status(200).json(updatedLoan);
        }
        else {
            res.status(404).json({ message: 'Loan not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateLoanByIdController = updateLoanByIdController;
// Delete a loan by ID
const deleteLoanByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { loanId } = req.params;
        yield (0, loan_1.deleteLoanById)(loanId);
        res.status(204).send(); // No content
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteLoanByIdController = deleteLoanByIdController;
