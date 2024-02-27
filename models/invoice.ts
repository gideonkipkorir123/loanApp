import mongoose, { Schema } from 'mongoose';

export interface InvoiceInterface {
    user?: Schema.Types.ObjectId;
    phoneNumber?: string;
    duration?: number,
    amount?: number;
    mpesaResponse?: {
        MerchantRequestID?: string;
        CheckoutRequestID?: string;
        ResponseCode?: number;
        ResponseDescription?: string;
        CustomerMessage?: string;
        OriginatorConversationID?: string;
        ConversationID?: string;
    };
    mpesaResponseCallback?: object;
    status?: 'pending' | 'confirmed';
}

const InvoiceSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    amount: {
        type: Number,
        required: true,
    },
    duration: {
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
