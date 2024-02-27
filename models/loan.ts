import mongoose, { Schema, Document } from "mongoose";

export interface LoanInterface  {
    interestRate: number;
    status: "pending" | "approved" | "rejected";
    endDate?: Date;
    remainingTime: string;
    returnedAmount: number;
}

const loanSchema: Schema = new Schema(
    {
        invoice: {
            type: Schema.Types.ObjectId,
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
        returnedAmount: {
            type: Number,
            default: 0,
        },
        endDate: {
            type: Date,
        },
    },
    { timestamps: true }
);

loanSchema.virtual("remainingTime").get(function (this: LoanInterface & Document) {
    const now = new Date();
    const remainingMilliseconds = (this.get("endDate")?.getTime() || 0) - now.getTime();

    if (remainingMilliseconds <= 0) {
        return "Loan expired";
    }

    const remainingDays = Math.ceil(remainingMilliseconds / (1000 * 60 * 60 * 24));
    return `${remainingDays} days remaining`;
});

loanSchema.pre("save", function (this: LoanInterface & Document, next) {
    const now = new Date();

    if (!this.get("startDate") || this.isNew) {
        this.set("startDate", now);
    }

    // Calculate endDate
    const calculatedEndDate = new Date(this.get("startDate"));
    calculatedEndDate.setDate(calculatedEndDate.getDate() + (this.get("endDate")?.getDate() || 0));
    this.set("endDate", calculatedEndDate);

    // Calculate returnedAmount
    this.set("returnedAmount", this.get("amount") * (1 + this.get("interestRate") / 100));

    next();
});

const Loan = mongoose.model<LoanInterface>("Loan", loanSchema);

export default Loan;
