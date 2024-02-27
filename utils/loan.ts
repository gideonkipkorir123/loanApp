import Loan, { LoanInterface } from "../models/loan";

// Create a new loan
export const createLoan = async (invoice: any) => {
    try {
        const userId: string = (invoice.user as any)?._id?.toString();
        const amount: number = invoice.amount;
        const duration: number = invoice.duration;

        const newLoan = new Loan({
            userId,
            amount,
            duration,
            status: 'approved',
        });

        await newLoan.save();
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
        throw new Error(`Error getting loans: ${error.message}`);
    }
};

// Get loan by ID
export const getLoanById = async (loanId: string): Promise<LoanInterface | null> => {
    try {
        const loan = await Loan.findById(loanId);
        return loan;
    } catch (error: any) {
        throw new Error(`Error getting loan by ID: ${error.message}`);
    }
};

// Update loan by ID
export const updateLoanById = async (
    loanId: string,
    updateData: Partial<LoanInterface>
): Promise<LoanInterface | null> => {
    try {
        const loan = await Loan.findByIdAndUpdate(loanId, updateData, { new: true });
        return loan;
    } catch (error: any) {
        throw new Error(`Error updating loan by ID: ${error.message}`);
    }
};

// Delete loan by ID
export const deleteLoanById = async (loanId: string): Promise<void> => {
    try {
        await Loan.findByIdAndDelete(loanId);
    } catch (error: any) {
        throw new Error(`Error deleting loan by ID: ${error.message}`);
    }
};
