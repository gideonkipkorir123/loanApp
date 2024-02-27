import mongoose, { Schema, Document } from "mongoose";

export interface LoanInterface extends Document {
    userId: mongoose.Types.ObjectId;
    amount: number;
    interestRate: number;
    duration: number;
    status: "pending" | "approved" | "rejected";
    startDate: Date;
    endDate?: Date;
    remainingTime: string;
    returnedAmount: number;
}

const loanSchema: Schema = new Schema(
    {
        invoiceId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Invoice",
        },
        interestRate: {
            type: Number,
            default: 10,
        },
        status: {
            type: String,
            required: true,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
        },
    },
    { timestamps: true }
);

loanSchema.virtual("remainingTime").get(function (this: LoanInterface) {
    const now = new Date();
    const remainingMilliseconds = (this.endDate?.getTime() || 0) - now.getTime();

    if (remainingMilliseconds <= 0) {
        return "Loan expired";
    }

    const remainingDays = Math.ceil(remainingMilliseconds / (1000 * 60 * 60 * 24));
    return `${remainingDays} days remaining`;
});


loanSchema.virtual("returnedAmount").get(function (this: LoanInterface) {
    return this.amount + this.amount * (this.interestRate / 100);
});

loanSchema.pre("save", function (this: LoanInterface & Document, next) {
    if (this.isModified("startDate") || this.isModified("duration")) {
        const calculatedEndDate = new Date(this.startDate);
        calculatedEndDate.setDate(calculatedEndDate.getDate() + this.duration);
        this.endDate = calculatedEndDate;
    }
    next();
});

const Loan = mongoose.model<LoanInterface>("Loan", loanSchema);

export default Loan;
