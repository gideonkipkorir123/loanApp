import mongoose, { Schema } from 'mongoose';

// Create the Transaction schema
const transactionSchema = new Schema(
    {
        invoice: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Invoice', 
        },
        paymentMethod: {
            type: {
                type: String,
                enum: ['mpesa', 'credit_card', 'bank_transfer'],
                required: true,
            },
            details: {
                type: Schema.Types.Mixed, 
            },
        },
    },
    { timestamps: true } 
);

const TransactionModel = mongoose.model('Transaction', transactionSchema);

export default TransactionModel;
