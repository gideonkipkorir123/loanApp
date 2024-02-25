import mongoose, { Schema } from 'mongoose';

// Create the Transaction schema
const transactionSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        invoice: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Invoice',
        },
        paymentType: {
            type: String,
            enum: ['mpesa', 'credit_card', 'bank_transfer'],
            required: true,
        },

    },
    { timestamps: true }
);

const TransactionModel = mongoose.model('Transaction', transactionSchema);

export default TransactionModel;
