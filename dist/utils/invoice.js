"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvoice = exports.updateInvoiceByMpesaIDsc2b = exports.updateInvoiceByMpesaIDsB2c = void 0;
const invoice_1 = __importDefault(require("../models/invoice"));
// Create a new invoice
const createInvoice = async (data) => {
    try {
        const invoiceData = Object.assign({ CustomerMessage: "Placeholder message", OriginatorConversationID: "PlaceholderOriginatorConversationID", MerchantRequestID: "PlaceholderMerchantRequestID" }, data);
        const newInvoice = new invoice_1.default(invoiceData);
        const savedInvoice = await newInvoice.save();
        return savedInvoice;
    }
    catch (error) {
        throw new Error(`Error creating invoice: ${error.message}`);
    }
};
exports.createInvoice = createInvoice;
const updateInvoiceByMpesaIDsB2c = async (conversationId, OriginatorConversationID, data) => {
    try {
        const updatedInvoice = await invoice_1.default.findOneAndUpdate({
            "mpesaResponse.OriginatorConversationID": OriginatorConversationID,
            "mpesaResponse.ConversationID": conversationId,
        }, {
            $set: {
                status: data.status,
            },
            Result: data.Result,
        }, { new: true });
        if (!updatedInvoice) {
            throw new Error("Invoice not found");
        }
        return updatedInvoice;
    }
    catch (error) {
        throw new Error(`Error updating invoice by Mpesa IDs: ${error.message}`);
    }
};
exports.updateInvoiceByMpesaIDsB2c = updateInvoiceByMpesaIDsB2c;
const updateInvoiceByMpesaIDsc2b = async (merchantRequestId, CheckoutRequestID, data) => {
    try {
        const updatedInvoice = await invoice_1.default.findOneAndUpdate({
            "mpesaResponse.MerchantRequestID": merchantRequestId,
            "mpesaResponse.CheckoutRequestID": CheckoutRequestID,
        }, {
            $set: { status: data.status },
            mpesaResponseCallback: data.mpesaResponseCallback,
        }, { new: true });
        if (!updatedInvoice) {
            throw new Error("Invoice not found");
        }
        return updatedInvoice;
    }
    catch (error) {
        throw new Error(`Error updating invoice by Mpesa IDs: ${error.message}`);
    }
};
exports.updateInvoiceByMpesaIDsc2b = updateInvoiceByMpesaIDsc2b;
