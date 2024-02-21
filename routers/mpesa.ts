import axios from "axios";
import { NextFunction, Request, Response } from "express";
import express from 'express';
import moment from 'moment'

const mpesaRouter = express.Router();

mpesaRouter.post('/callback', async (req: Request, res: Response, next: NextFunction) => {
    const mpesaBody = req.body.Body
    console.log(mpesaBody);
    return res.json(mpesaBody)
})

mpesaRouter.post('/initiate-payment', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { amount, phoneNumber } = req.body;
        const consumerKey = process.env.MPESA_CUSTOMER_CONSUMER_KEY;
        const consumerSecret = process.env.MPESA_CUSTOMER_CONSUMER_SECRET;
        const lipaNaMpesaOnlinePasskey = process.env.MPESA_CUSTOMER_PASSKEY as string;
        const lipaNaMpesaOnlineShortcode = Number(process.env.MPESA_CUSTOMER_SHORT_CODE);
        const lipaNaMpesaOnlineCallbackUrl = `${process.env.BASE_URL}/mpesa/callback`;
        console.log(lipaNaMpesaOnlineCallbackUrl, 'callback url');

        const PartyB = process.env.MPESA_PARTYB

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

        // Respond with the data from the API response
        console.log(data);

        res.status(200).json(data);

        next();
    } catch (error: any) {
        console.error('Error initiating payment:', error.response?.data || error.message);
        res.status(500).json({ error: 'Internal Server Error' });
        next(error);
    }

});

export default mpesaRouter;
