import mongoose, { Schema, } from "mongoose";

export interface LoanInterface  {
    userId: mongoose.Types.ObjectId;
    amount: number;
    interestRate: number;
    duration: number; 
    status: "pending" | "approved" | "rejected";
    startDate: Date;
    endDate: Date;
    remainingTime: string; 
}

const loanSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User", // Reference to the User model
        },
        amount: {
            type: Number,
            required: true,
        },
        interestRate: {
            type: Number,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
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
            required: true,
        },
    },
    { timestamps: true }
);

// Add virtual field for remainingTime
loanSchema.virtual('remainingTime').get(function (this: LoanInterface) {
    const now = new Date();
    const remainingMilliseconds = this.endDate.getTime() - now.getTime();

    // Assuming you want to return a string representing remaining time
    const remainingDays = Math.ceil(remainingMilliseconds / (1000 * 60 * 60 * 24));
    return `${remainingDays} days remaining`;
});

const Loan = mongoose.model<LoanInterface>("Loan", loanSchema);

export default Loan;
