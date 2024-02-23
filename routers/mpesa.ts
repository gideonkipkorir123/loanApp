import axios from "axios";
import { NextFunction, Request, Response } from "express";
import express from 'express';
import moment from 'moment'
import updateInvoiceByMpesaIDs, { createInvoice } from "../utils/invoice";
import { requireUser } from "../middleware/requireUser";

const mpesaRouter = express.Router();
mpesaRouter.post('/callback', async (req: Request, res: Response) => {
    try {
        const mpesaBody = req.body;
        console.log('Mpesa Callback Body:', mpesaBody);

        // Use optional chaining to handle potential undefined properties
        const stkCallback = mpesaBody?.Body?.stkCallback;
        console.log('Stk Callback:', stkCallback);

        // Use optional chaining for ResultCode
        const resultCode = stkCallback?.ResultCode;
        console.log('Result Code:', resultCode);

        if (resultCode === 0) {
            // Payment successful
            const merchantRequestID = stkCallback?.MerchantRequestID;
            const checkoutRequestID = stkCallback?.CheckoutRequestID;

            await updateInvoiceByMpesaIDs(merchantRequestID, checkoutRequestID, { status: 'confirmed', mpesaResponseCallback: mpesaBody });

            return res.status(200).json({ message: 'Payment successful', merchantRequestID, checkoutRequestID });
        } else {
            // Payment failed
            const errorMessage = stkCallback?.ResultDesc;

            // Handle the failed payment, log the error, etc.
            console.error('Mpesa Payment Failed:', errorMessage);

            return res.status(400).json({ error: 'Payment failed', errorMessage });
        }
    } catch (error: any) {
        console.error('Error processing Mpesa callback:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


mpesaRouter.post('/initiate-payment', requireUser, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { amount, phoneNumber } = req.body;
        // Validate and sanitize user inputs

        const userId = req.user?._id;
        const consumerKey = process.env.MPESA_CUSTOMER_CONSUMER_KEY;
        const consumerSecret = process.env.MPESA_CUSTOMER_CONSUMER_SECRET;
        const lipaNaMpesaOnlinePasskey = process.env.MPESA_CUSTOMER_PASSKEY as string;
        const lipaNaMpesaOnlineShortcode = Number(process.env.MPESA_CUSTOMER_SHORT_CODE);
        const lipaNaMpesaOnlineCallbackUrl = `${process.env.BASE_URL}/mpesa/callback`;

        const PartyB = process.env.MPESA_PARTYB;

        // Generate token for authorization
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
        const date = moment()
        const timestamp = date.format('YYYYMMDDhhmmss')

        const password = Buffer.from(`${lipaNaMpesaOnlineShortcode}${lipaNaMpesaOnlinePasskey}${timestamp}`).toString('base64');

        const { data: { access_token: accessToken } } = await axios.get(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',

            {
                headers: {
                    Authorization: `Basic ${auth}`,
                },
            }
        );

        const { data } = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
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
            },
            {
                headers: {
                    Authorization: "Bearer " + accessToken
                },
            }
        );
        // create invoice
        await createInvoice({ phoneNumber, user: userId, amount, mpesaResponse: data });

        res.status(200).json(data);

        next();
    } catch (error: any) {
        console.error('Error initiating payment:', error.response?.data || error.message);

        // Provide a more detailed error message or handle specific error cases
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default mpesaRouter;
