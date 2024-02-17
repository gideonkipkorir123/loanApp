"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLoanByIdController = exports.updateLoanByIdController = exports.getLoanByIdController = exports.getAllLoansController = exports.createLoanController = void 0;
const loan_1 = require("../utils/loan");
// Create a new loan
const createLoanController = async (req, res) => {
    var _a;
    try {
        const loanData = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const newLoan = await (0, loan_1.createLoan)(Object.assign(Object.assign({}, loanData), { userId }));
        res.status(201).json(newLoan);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createLoanController = createLoanController;
// Get all loans
const getAllLoansController = async (req, res) => {
    try {
        const loans = await (0, loan_1.getAllLoans)();
        res.status(200).json(loans);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllLoansController = getAllLoansController;
// Get a loan by ID
const getLoanByIdController = async (req, res) => {
    try {
        const { loanId } = req.params;
        const loan = await (0, loan_1.getLoanById)(loanId);
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
};
exports.getLoanByIdController = getLoanByIdController;
// Update a loan by ID
const updateLoanByIdController = async (req, res) => {
    try {
        const { loanId } = req.params;
        const updateData = req.body;
        const updatedLoan = await (0, loan_1.updateLoanById)(loanId, updateData);
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
};
exports.updateLoanByIdController = updateLoanByIdController;
// Delete a loan by ID
const deleteLoanByIdController = async (req, res) => {
    try {
        const { loanId } = req.params;
        await (0, loan_1.deleteLoanById)(loanId);
        res.status(204).send(); // No content
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteLoanByIdController = deleteLoanByIdController;
