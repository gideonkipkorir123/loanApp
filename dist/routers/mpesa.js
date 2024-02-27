"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const moment_1 = __importDefault(require("moment"));
const invoice_1 = require("../utils/invoice");
const requireUser_1 = require("../middleware/requireUser");
const transaction_1 = require("../utils/transaction");
const mpesaRouter = express_1.default.Router();
// CUSTOMER TO BUSINESS IMPELEMTATION
mpesaRouter.post('/callback', async (req, res) => {
    var _a, _b, _c, _d;
    try {
        const mpesaBody = req.body;
        console.log('Mpesa Callback Body:', mpesaBody);
        const stkCallback = (_a = mpesaBody === null || mpesaBody === void 0 ? void 0 : mpesaBody.Body) === null || _a === void 0 ? void 0 : _a.stkCallback;
        const resultCode = stkCallback === null || stkCallback === void 0 ? void 0 : stkCallback.ResultCode;
        if (resultCode === 0) {
            const merchantRequestID = stkCallback === null || stkCallback === void 0 ? void 0 : stkCallback.MerchantRequestID;
            const checkoutRequestID = stkCallback === null || stkCallback === void 0 ? void 0 : stkCallback.CheckoutRequestID;
            // Update the invoice
            const invoice = await (0, invoice_1.updateInvoiceByMpesaIDsc2b)(merchantRequestID, checkoutRequestID, { status: 'confirmed', mpesaResponseCallback: mpesaBody });
            const userId = (_c = (_b = invoice.user) === null || _b === void 0 ? void 0 : _b._id) === null || _c === void 0 ? void 0 : _c.toString();
            console.log(invoice, 'invoice ');
            // Convert ObjectId to string
            const invoiceId = (_d = invoice._id) === null || _d === void 0 ? void 0 : _d.toString();
            await (0, transaction_1.createTransaction)(userId, "mpesa", invoiceId);
            return res.status(200).json({ message: 'Payment successful', merchantRequestID, checkoutRequestID });
        }
        else {
            const errorMessage = stkCallback === null || stkCallback === void 0 ? void 0 : stkCallback.ResultDesc;
            console.error('Mpesa Payment Failed:', errorMessage);
            return res.status(400).json({ error: 'Payment failed', errorMessage });
        }
    }
    catch (error) {
        console.error('Error processing Mpesa callback:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
mpesaRouter.post('/c2b', requireUser_1.requireUser, async (req, res, next) => {
    var _a, _b;
    try {
        const { amount, phoneNumber } = req.body;
        // Validate and sanitize user inputs
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const consumerKey = process.env.MPESA_CUSTOMER_CONSUMER_KEY;
        const consumerSecret = process.env.MPESA_CUSTOMER_CONSUMER_SECRET;
        const lipaNaMpesaOnlinePasskey = process.env.MPESA_CUSTOMER_PASSKEY;
        const lipaNaMpesaOnlineShortcode = Number(process.env.MPESA_CUSTOMER_SHORT_CODE);
        const lipaNaMpesaOnlineCallbackUrl = `${process.env.BASE_URL}/mpesa/callback`;
        const PartyB = process.env.MPESA_PARTY_B;
        // Generate token for authorization
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
        const date = (0, moment_1.default)();
        const timestamp = date.format('YYYYMMDDhhmmss');
        const password = Buffer.from(`${lipaNaMpesaOnlineShortcode}${lipaNaMpesaOnlinePasskey}${timestamp}`).toString('base64');
        const { data: { access_token: accessToken } } = await axios_1.default.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        const { data } = await axios_1.default.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
            BusinessShortCode: lipaNaMpesaOnlineShortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount,
            PartyA: phoneNumber,
            PartyB: PartyB,
            PhoneNumber: phoneNumber,
            CallBackURL: lipaNaMpesaOnlineCallbackUrl,
            AccountReference: "Loan APP",
            TransactionDesc: "Payment of Loan",
        }, {
            headers: {
                Authorization: "Bearer " + accessToken
            },
        });
        // create invoice
        await (0, invoice_1.createInvoice)({ phoneNumber, user: userId, amount, mpesaResponse: data });
        res.status(200).json(data);
        next();
    }
    catch (error) {
        console.error('Error initiating payment:', ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message);
        // Provide a more detailed error message or handle specific error cases
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
// BUSINESS TO CUSTOMER IMPLEMENTATION 
mpesaRouter.post('/queue', async (req, res) => {
    try {
        const body = req.body;
        console.log('Queue Callback Body:', body);
        return res.status(200).send('Received');
    }
    catch (error) {
        console.error('Error processing /queue callback:', error);
        return res.status(500).send('Internal server error');
    }
});
mpesaRouter.post('/ResultURL', async (req, res) => {
    var _a, _b, _c;
    try {
        const body = req.body;
        const Result = body === null || body === void 0 ? void 0 : body.Body;
        console.log(Result, "result body");
        const ResultType = Result === null || Result === void 0 ? void 0 : Result.ResultType;
        const ReferenceData = Result === null || Result === void 0 ? void 0 : Result.ReferenceData;
        console.log({ ReferenceData }, "reference data");
        if (ResultType === 0) {
            const OriginatorConversationID = Result === null || Result === void 0 ? void 0 : Result.OriginatorConversationID;
            const ConversationID = Result === null || Result === void 0 ? void 0 : Result.ConversationID;
            if (OriginatorConversationID && ConversationID) {
                // Assuming that updateInvoiceByMpesaIDsB2c returns the updated invoice
                const invoice = await (0, invoice_1.updateInvoiceByMpesaIDsB2c)(OriginatorConversationID, ConversationID, { status: "confirmed", body });
                if (!invoice) {
                    // Handle the case when the invoice is not found or not updated
                    console.error('Invoice not found or not updated');
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                const userId = (_b = (_a = invoice.user) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString();
                console.log(invoice, 'invoice');
                const invoiceId = (_c = invoice._id) === null || _c === void 0 ? void 0 : _c.toString();
                // Assuming that createTransaction handles the transaction creation
                await (0, transaction_1.createTransaction)(userId, "mpesa", invoiceId);
                return res.status(200).json({ message: 'Payment successful', OriginatorConversationID, ConversationID });
            }
        }
        return res.status(200).send('Received');
    }
    catch (error) {
        console.error('Error processing /ResultURL callback:', error);
        return res.status(500).send('Internal server error');
    }
});
// Function to generate OriginatorConversationID
function generateOriginatorConversationID() {
    const uuid = (0, uuid_1.v4)();
    return uuid;
}
mpesaRouter.post('/b2c', requireUser_1.requireUser, async (req, res, next) => {
    var _a, _b, _c;
    try {
        const { Amount, PartyB, duration, startDate } = req.body;
        const consumerKey = process.env.MPESA_CUSTOMER_CONSUMER_KEY;
        const consumerSecret = process.env.MPESA_CUSTOMER_CONSUMER_SECRET;
        const QueueTimeOutURL = `${process.env.BASE_URL}/mpesa/queue`;
        const ResultURL = `${process.env.BASE_URL}/mpesa/ResultURL`;
        const SecurityCredential = process.env.MPESA_SECURITY_CREDENTILAS;
        const PartyA = process.env.MPESA_PARTY_A;
        // Generate OriginatorConversationID using UUID
        const OriginatorConversationID = generateOriginatorConversationID();
        // Generate token for authorization
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
        const { data: { access_token: accessToken } } = await axios_1.default.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        const { data } = await axios_1.default.post('https://sandbox.safaricom.co.ke/mpesa/b2c/v3/paymentrequest', {
            OriginatorConversationID,
            InitiatorName: "testapi",
            SecurityCredential,
            CommandID: "BusinessPayment",
            Amount,
            PartyA,
            PartyB,
            QueueTimeOutURL,
            ResultURL,
            Remarks: "Test remarks",
            Occasion: "Test occasion",
            duration,
            startDate,
        }, {
            headers: {
                Authorization: "Bearer " + accessToken
            },
        });
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const mpesaResponse = data;
        await (0, invoice_1.createInvoice)({ mpesaResponse, phoneNumber: PartyB, user: userId, amount: Amount });
        res.status(200).json(data);
        next();
    }
    catch (error) {
        console.error('Error initiating payment:', ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message);
        return res.status(((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) || 500).json({ error: 'Internal Server Error' });
    }
});
exports.default = mpesaRouter;
