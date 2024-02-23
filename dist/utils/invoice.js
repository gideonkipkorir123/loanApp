"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvoice = exports.deleteInvoiceByMpesaIDs = exports.updateInvoiceByMpesaIDs = void 0;
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
exports.updateInvoiceByMpesaIDs = updateInvoiceByMpesaIDs;
const deleteInvoiceByMpesaIDs = async (merchantRequestId, checkoutRequestId) => {
    try {
        const deletedInvoice = await invoice_1.default.findOneAndDelete({
            'mpesaResponse.MerchantRequestID': merchantRequestId,
            'mpesaResponse.CheckoutRequestID': checkoutRequestId,
        });
        if (!deletedInvoice) {
            throw new Error('Invoice not found');
        }
        return deletedInvoice;
    }
    catch (error) {
        throw new Error(`Error deleting invoice by Mpesa IDs: ${error.message}`);
    }
};
exports.deleteInvoiceByMpesaIDs = deleteInvoiceByMpesaIDs;
// // Get all invoices
// const getAllInvoices = async () => {
//     try {
//         const invoices = await Invoice.find();
//         return invoices;
//     } catch (error) {
//         throw new Error(`Error getting invoices: ${error.message}`);
//     }
// };
// // Get invoice by ID
// const getInvoiceById = async (id) => {
//     try {
//         const invoice = await Invoice.findById(id);
//         return invoice;
//     } catch (error) {
//         throw new Error(`Error getting invoice by ID: ${error.message}`);
//     }
// };
// // Update invoice by ID
// const updateInvoiceById = async (id, data) => {
//     try {
//         const updatedInvoice = await Invoice.findByIdAndUpdate(id, data, { new: true });
//         return updatedInvoice;
//     } catch (error) {
//         throw new Error(`Error updating invoice by ID: ${error.message}`);
//     }
// };
// // Delete invoice by ID
// const deleteInvoiceById = async (id) => {
//     try {
//         const deletedInvoice = await Invoice.findByIdAndDelete(id);
//         return deletedInvoice;
//     } catch (error) {
//         throw new Error(`Error deleting invoice by ID: ${error.message}`);
//     }
// };
