import { ObjectId } from 'mongoose';
import TransactionModel from '../models/transaction';
import Invoice from '../models/invoice';

// Create a new transaction
// Assuming your createTransaction function looks like this
const createTransaction = async (userId: string, paymentMethodType: string, invoiceId: string) => {
    try {
        const transactionData = {
            user: userId,
            invoice: invoiceId,
            paymentMethod: {
                type: paymentMethodType,
                details: {} 
            },
        };

        // Save the transaction
        const transaction = new TransactionModel(transactionData);
        await transaction.save();

        console.log('Transaction created successfully');
    } catch (error: any) {
        throw new Error(`Error creating transaction: ${error.message}`);
    }
};

// Get all transactions for a user
const getTransactionsByUser = async (userId: string): Promise<any> => {
    try {
        const transactions = await TransactionModel.find({ user: userId });
        return transactions;
    } catch (error: any) {
        throw new Error(`Error getting transactions for user: ${error.message}`);
    }
};

// Update a transaction by ID
const updateTransactionById = async (transactionId: string, updates: any): Promise<any> => {
    try {
        const updatedTransaction = await TransactionModel.findByIdAndUpdate(
            transactionId,
            updates,
            { new: true }
        );

        if (!updatedTransaction) {
            throw new Error('Transaction not found');
        }

        return updatedTransaction;
    } catch (error: any) {
        throw new Error(`Error updating transaction: ${error.message}`);
    }
};

// Delete a transaction by ID
const deleteTransactionById = async (transactionId: string): Promise<any> => {
    try {
        const deletedTransaction = await TransactionModel.findByIdAndDelete(transactionId);

        if (!deletedTransaction) {
            throw new Error('Transaction not found');
        }

        return deletedTransaction;
    } catch (error: any) {
        throw new Error(`Error deleting transaction: ${error.message}`);
    }
};

export { createTransaction, getTransactionsByUser, updateTransactionById, deleteTransactionById };
