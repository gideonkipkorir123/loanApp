"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const loan_1 = require("../controllers/loan");
const requireUser_1 = require("../middleware/requireUser");
const loanRouter = express_1.default.Router();
// Create a new loan
loanRouter.post('/', (0, requireUser_1.authRole)(requireUser_1.ROLES.user), loan_1.createLoanController);
// Get all 
loanRouter.get('/', loan_1.getAllLoansController);
// Get a loan by ID
loanRouter.get('/:loanId', loan_1.getLoanByIdController);
// Update a loan by ID
loanRouter.put('/:loanId', loan_1.updateLoanByIdController);
// Delete a loan by ID
loanRouter.delete('/:loanId', loan_1.deleteLoanByIdController);
exports.default = loanRouter;
