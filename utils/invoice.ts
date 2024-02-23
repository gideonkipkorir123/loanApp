import Invoice from '../models/invoice';

// Create a new invoice
const createInvoice = async (data: any) => {
    try {
        const newInvoice = new Invoice(data);
        const savedInvoice = await newInvoice.save();
        return savedInvoice;
    } catch (error: any) {
        throw new Error(`Error creating invoice: ${error.message}`);
    }
};


const updateInvoiceByMpesaIDs = async (merchantRequestId: string, checkoutRequestId: string, data: any) => {
    try {
        const updatedInvoice = await Invoice.findOneAndUpdate(
            {
                'mpesaResponse.MerchantRequestID': merchantRequestId,
                'mpesaResponse.CheckoutRequestID': checkoutRequestId,
            },
            { $set: { status: data.status }, mpesaResponseCallback: data.mpesaResponseCallback  },
            { new: true }
        );

        if (!updatedInvoice) {
            throw new Error('Invoice not found');
        }

        return updatedInvoice;
    } catch (error: any) {
        throw new Error(`Error updating invoice by Mpesa IDs: ${error.message}`);
    }
};

export default updateInvoiceByMpesaIDs;


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

export {
    createInvoice,
//     getAllInvoices,
//     getInvoiceById,
//     updateInvoiceById,
    // deleteInvoiceById,
};
