import Invoice from "../models/invoice";

// Create a new invoice
const createInvoice = async (data: any) => {
    try {
        const invoiceData = {
            CustomerMessage: "Placeholder message",
            OriginatorConversationID: "PlaceholderOriginatorConversationID",
            MerchantRequestID: "PlaceholderMerchantRequestID",
            ...data,
        };

        const newInvoice = new Invoice(invoiceData);
        const savedInvoice = await newInvoice.save();
        return savedInvoice;
    } catch (error: any) {
        throw new Error(`Error creating invoice: ${error.message}`);
    }
};
export const updateInvoiceByMpesaIDsB2c = async (
    conversationId: string,
    OriginatorConversationID: string,
    data: any
) => {
    try {
        const updatedInvoice = await Invoice.findOneAndUpdate(
            {
                "mpesaResponse.OriginatorConversationID": OriginatorConversationID,
                "mpesaResponse.ConversationID": conversationId,
            },
            {
                $set: {
                    status: data.status,
                },
                Result: data.Result,
            },
            { new: true }
        );

        if (!updatedInvoice) {
            throw new Error("Invoice not found");
        }

        return updatedInvoice;
    } catch (error: any) {
        throw new Error(`Error updating invoice by Mpesa IDs: ${error.message}`);
    }
};

const updateInvoiceByMpesaIDsc2b = async (
    merchantRequestId: string,
    CheckoutRequestID: string,
    data: any
) => {
    try {
        const updatedInvoice = await Invoice.findOneAndUpdate(
            {
                "mpesaResponse.MerchantRequestID": merchantRequestId,
                "mpesaResponse.CheckoutRequestID": CheckoutRequestID,
            },
            {
                $set: { status: data.status },
                mpesaResponseCallback: data.mpesaResponseCallback,
            },
            { new: true }
        );

        if (!updatedInvoice) {
            throw new Error("Invoice not found");
        }

        return updatedInvoice;
    } catch (error: any) {
        throw new Error(`Error updating invoice by Mpesa IDs: ${error.message}`);
    }
};

export { updateInvoiceByMpesaIDsc2b, createInvoice };
