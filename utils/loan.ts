import Loan, { LoanInterface } from "../models/loan"; 

// Create a new loan
export const createLoan = async (loanData: LoanInterface): Promise<LoanInterface> => {
    try {
        const newLoan = await Loan.create(loanData);
        return newLoan;
    } catch (error: any) {
        throw new Error(`Error creating loan: ${error.message}`);
    }
};

// Get all loans
export const getAllLoans = async (): Promise<LoanInterface[]> => {
    try {
        const loans = await Loan.find();
        return loans;
    } catch (error: any) {
        throw new Error(`Error getting all loans: ${error.message}`);
    }
};

// Get a loan by ID
export const getLoanById = async (loanId: string): Promise<LoanInterface | null> => {
    try {
        const loan = await Loan.findById(loanId);
        return loan;
    } catch (error: any) {
        throw new Error(`Error getting loan by ID: ${error.message}`);
    }
};

// Update a loan by ID
export const updateLoanById = async (loanId: string, updateData: Partial<LoanInterface>): Promise<LoanInterface | null> => {
    try {
        const updatedLoan = await Loan.findByIdAndUpdate(loanId, updateData, { new: true });
        return updatedLoan;
    } catch (error: any) {
        throw new Error(`Error updating loan by ID: ${error.message}`);
    }
};

// Delete a loan by ID
export const deleteLoanById = async (loanId: string): Promise<void> => {
    try {
        await Loan.findByIdAndDelete(loanId);
    } catch (error: any) {
        throw new Error(`Error deleting loan by ID: ${error.message}`);
    }
};
