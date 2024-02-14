import express from 'express';
import {
    createLoanController,
    getAllLoansController,
    getLoanByIdController,
    updateLoanByIdController,
    deleteLoanByIdController,
} from '../controllers/loan';
import { ROLES, authRole } from '../middleware/requireUser';

const loanRouter = express.Router();

// Create a new loan
loanRouter.post('/', authRole(ROLES.user), createLoanController);

// Get all 
loanRouter.get('/', getAllLoansController);

// Get a loan by ID
loanRouter.get('/:loanId', getLoanByIdController);

// Update a loan by ID
loanRouter.put('/:loanId', updateLoanByIdController);

// Delete a loan by ID
loanRouter.delete('/:loanId', deleteLoanByIdController);

export default loanRouter;
