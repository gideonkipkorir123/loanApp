"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const moment_1 = __importDefault(require("moment"));
const invoice_1 = __importStar(require("../utils/invoice"));
const requireUser_1 = require("../middleware/requireUser");
const mpesaRouter = express_1.default.Router();
mpesaRouter.post('/callback', async (req, res, next) => {
    try {
        const mpesaBody = req.body;
        console.log(mpesaBody, 'mpesabody');
        const stkCallback = mpesaBody.Body.stkCallback;
        console.log(stkCallback, 'stkCallback');
        const resultCode = stkCallback.ResultCode;
        console.log(resultCode, 'resultCode');
        if (resultCode === 0) {
            // Payment successful
            const merchantRequestID = stkCallback.MerchantRequestID;
            const checkoutRequestID = stkCallback.CheckoutRequestID;
            await (0, invoice_1.default)(merchantRequestID, checkoutRequestID, { status: 'confirmed', mpesaResponseCallback: mpesaBody });
            return res.status(200).json({ message: 'Payment successful', merchantRequestID, checkoutRequestID });
        }
        else {
            // Payment failed
            const errorMessage = stkCallback.ResultDesc;
            // Handle the failed payment, log the error, etc.
            console.error('Mpesa Payment Failed:', errorMessage);
            return res.status(400).json({ error: 'Payment failed', errorMessage });
        }
    }
    catch (error) {
        console.error('Error processing Mpesa callback:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
mpesaRouter.post('/initiate-payment', requireUser_1.requireUser, async (req, res, next) => {
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
        const PartyB = process.env.MPESA_PARTYB;
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
exports.default = mpesaRouter;
