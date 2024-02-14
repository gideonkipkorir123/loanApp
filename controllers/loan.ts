import { Request, Response } from 'express';
import {
    createLoan,
    getAllLoans,
    getLoanById,
    updateLoanById,
    deleteLoanById,
} from '../utils/loan'; 

// Create a new loan
export const createLoanController = async (req: Request, res: Response): Promise<void> => {
    try {
        const loanData = req.body;
        const  userId = req.user?._id
        
        const newLoan = await createLoan({...loanData, userId});
        res.status(201).json(newLoan);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get all loans
export const getAllLoansController = async (req: Request, res: Response): Promise<void> => {
    try {
        const loans = await getAllLoans();
        res.status(200).json(loans);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get a loan by ID
export const getLoanByIdController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { loanId } = req.params;
        const loan = await getLoanById(loanId);
        if (loan) {
            res.status(200).json(loan);
        } else {
            res.status(404).json({ message: 'Loan not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Update a loan by ID
export const updateLoanByIdController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { loanId } = req.params;
        const updateData = req.body;
        const updatedLoan = await updateLoanById(loanId, updateData);
        if (updatedLoan) {
            res.status(200).json(updatedLoan);
        } else {
            res.status(404).json({ message: 'Loan not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a loan by ID
export const deleteLoanByIdController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { loanId } = req.params;
        await deleteLoanById(loanId);
        res.status(204).send(); // No content
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
