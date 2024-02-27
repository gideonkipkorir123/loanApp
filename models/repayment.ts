import mongoose, { Schema } from 'mongoose';

export interface RepaymentInterface {
    loan: mongoose.Types.ObjectId;
    amount: number;
    paymentDate: Date;
    paymentType: 'regular' | 'fine';
}

const repaymentSchema: Schema = new Schema(
    {
        loan: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Loan',
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentDate: {
            type: Date,
            required: true,
        },
        paymentType: {
            type: String,
            required: true,
            enum: ['regular', 'fine'],
            default: 'regular',
        },
    },
    { timestamps: true }
);

const Repayment = mongoose.model('Repayment', repaymentSchema);

export default Repayment;
