"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransactionById = exports.updateTransactionById = exports.getTransactionsByUser = exports.createTransaction = void 0;
const transaction_1 = __importDefault(require("../models/transaction"));
// Create a new transaction
const createTransaction = async (paymentType, paymentDetails) => {
    try {
        const newTransaction = new transaction_1.default({
            paymentMethod: {
                type: paymentType,
                details: paymentDetails,
            },
        });
        const savedTransaction = await newTransaction.save();
        return savedTransaction;
    }
    catch (error) {
        throw new Error(`Error creating transaction: ${error.message}`);
    }
};
exports.createTransaction = createTransaction;
// Get all transactions for a user
const getTransactionsByUser = async (userId) => {
    try {
        const transactions = await transaction_1.default.find({ user: userId });
        return transactions;
    }
    catch (error) {
        throw new Error(`Error getting transactions for user: ${error.message}`);
    }
};
exports.getTransactionsByUser = getTransactionsByUser;
// Update a transaction by ID
const updateTransactionById = async (transactionId, updates) => {
    try {
        const updatedTransaction = await transaction_1.default.findByIdAndUpdate(transactionId, updates, { new: true });
        if (!updatedTransaction) {
            throw new Error('Transaction not found');
        }
        return updatedTransaction;
    }
    catch (error) {
        throw new Error(`Error updating transaction: ${error.message}`);
    }
};
exports.updateTransactionById = updateTransactionById;
// Delete a transaction by ID
const deleteTransactionById = async (transactionId) => {
    try {
        const deletedTransaction = await transaction_1.default.findByIdAndDelete(transactionId);
        if (!deletedTransaction) {
            throw new Error('Transaction not found');
        }
        return deletedTransaction;
    }
    catch (error) {
        throw new Error(`Error deleting transaction: ${error.message}`);
    }
};
exports.deleteTransactionById = deleteTransactionById;
