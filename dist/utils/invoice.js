"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvoice = void 0;
const invoice_1 = __importDefault(require("../models/invoice"));
// Create a new invoice
const createInvoice = async (data) => {
    try {
        const newInvoice = new invoice_1.default(data);
        const savedInvoice = await newInvoice.save();
        return savedInvoice;
    }
    catch (error) {
        throw new Error(`Error creating invoice: ${error.message}`);
    }
};
exports.createInvoice = createInvoice;
const updateInvoiceByMpesaIDs = async (merchantRequestId, checkoutRequestId, data) => {
    try {
        const updatedInvoice = await invoice_1.default.findOneAndUpdate({
            'mpesaResponse.MerchantRequestID': merchantRequestId,
            'mpesaResponse.CheckoutRequestID': checkoutRequestId,
        }, { $set: { status: data.status }, mpesaResponseCallback: data.mpesaResponseCallback }, { new: true });
        if (!updatedInvoice) {
            throw new Error('Invoice not found');
        }
        return updatedInvoice;
    }
    catch (error) {
        throw new Error(`Error updating invoice by Mpesa IDs: ${error.message}`);
    }
};
exports.default = updateInvoiceByMpesaIDs;
