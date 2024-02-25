import mongoose, { Schema } from 'mongoose';

const InvoiceSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    mpesaResponse: {
        type: {
            MerchantRequestID: {
                type: String,
                required: true,
                unique: true,
            },
            CheckoutRequestID: {
                type: String,
                required: true,
                unique: true,
            },
            ResponseCode: {
                type: Number,
                required: true,
            },
            ResponseDescription: {
                type: String,
                required: true,
            },
            CustomerMessage: {
                type: String,
                required: true
            }
        },
        required: true,
    },
    mpesaResponseCallback: {
        type: Object
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed'],
        default: 'pending',
    },
});

const Invoice = mongoose.model('Invoice', InvoiceSchema);

export default Invoice;
