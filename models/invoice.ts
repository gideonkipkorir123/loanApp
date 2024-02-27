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

            },
            CheckoutRequestID: {
                type: String,

            },
            ResponseCode: {
                type: Number,

            },
            ResponseDescription: {
                type: String,

            },
            CustomerMessage: {
                type: String,

            },
            OriginatorConversationID: {
                type: String,

            },
            ConversationID: {
                type: String,

            }
        },

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
