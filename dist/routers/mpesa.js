"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const moment_1 = __importDefault(require("moment"));
const mpesaRouter = express_1.default.Router();
mpesaRouter.post('/callback', async (req, res, next) => {
    const mpesaBody = req.body.Body;
    console.log(mpesaBody);
    return res.json(mpesaBody);
});
mpesaRouter.post('/initiate-payment', async (req, res, next) => {
    var _a;
    try {
        const { amount, phoneNumber } = req.body;
        const consumerKey = process.env.MPESA_CUSTOMER_CONSUMER_KEY;
        const consumerSecret = process.env.MPESA_CUSTOMER_CONSUMER_SECRET;
        const lipaNaMpesaOnlinePasskey = process.env.MPESA_CUSTOMER_PASSKEY;
        const lipaNaMpesaOnlineShortcode = Number(process.env.MPESA_CUSTOMER_SHORT_CODE);
        const lipaNaMpesaOnlineCallbackUrl = `${process.env.BASE_URL}/mpesa/callback`;
        console.log(lipaNaMpesaOnlineCallbackUrl, 'callback url');
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
        // Respond with the data from the API response
        console.log(data);
        res.status(200).json(data);
        next();
    }
    catch (error) {
        console.error('Error initiating payment:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        res.status(500).json({ error: 'Internal Server Error' });
        next(error);
    }
});
exports.default = mpesaRouter;
