import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { NextFunction, Request, Response } from "express";
import express from 'express';
import moment from 'moment'
import { createInvoice, updateInvoiceByMpesaIDsB2c, updateInvoiceByMpesaIDsc2b } from "../utils/invoice";
import { requireUser } from "../middleware/requireUser";
import { createTransaction } from "../utils/transaction";

const mpesaRouter = express.Router();
// CUSTOMER TO BUSINESS IMPELEMTATION
mpesaRouter.post('/callback', async (req: Request, res: Response) => {
    try {
        const mpesaBody = req.body;
        console.log('Mpesa Callback Body:', mpesaBody);

        const stkCallback = mpesaBody?.Body?.stkCallback;
        const resultCode = stkCallback?.ResultCode;

        if (resultCode === 0) {
            const merchantRequestID = stkCallback?.MerchantRequestID;
            const checkoutRequestID = stkCallback?.CheckoutRequestID;
            // Update the invoice
            const invoice = await updateInvoiceByMpesaIDsc2b(merchantRequestID, checkoutRequestID, { status: 'confirmed', mpesaResponseCallback: mpesaBody });
            const userId: string = (invoice.user as any)?._id?.toString();
            console.log(invoice, 'invoice ')
            // Convert ObjectId to string
            const invoiceId: string = invoice._id?.toString();

            await createTransaction(userId, "mpesa", invoiceId);

            return res.status(200).json({ message: 'Payment successful', merchantRequestID, checkoutRequestID });
        } else {
            const errorMessage = stkCallback?.ResultDesc;

            console.error('Mpesa Payment Failed:', errorMessage);

            return res.status(400).json({ error: 'Payment failed', errorMessage });
        }
    } catch (error: any) {
        console.error('Error processing Mpesa callback:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
mpesaRouter.post('/c2b', requireUser, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { amount, phoneNumber } = req.body;
        // Validate and sanitize user inputs

        const userId = req.user?._id as string;
        const consumerKey = process.env.MPESA_CUSTOMER_CONSUMER_KEY;
        const consumerSecret = process.env.MPESA_CUSTOMER_CONSUMER_SECRET;
        const lipaNaMpesaOnlinePasskey = process.env.MPESA_CUSTOMER_PASSKEY as string;
        const lipaNaMpesaOnlineShortcode = Number(process.env.MPESA_CUSTOMER_SHORT_CODE);
        const lipaNaMpesaOnlineCallbackUrl = `${process.env.BASE_URL}/mpesa/callback`;

        const PartyB = process.env.MPESA_PARTY_B;

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
// BUSINESS TO CUSTOMER IMPLEMENTATION 
mpesaRouter.post('/queue', async (req: Request, res: Response) => {
    try {
        const body = req.body;
        console.log('Queue Callback Body:', body);
        return res.status(200).send('Received');
    } catch (error) {
        console.error('Error processing /queue callback:', error);
        return res.status(500).send('Internal server error');
    }
});
mpesaRouter.post('/ResultURL', async (req: Request, res: Response) => {
    try {
        const body = req.body;

        const Result = body?.Body;
        console.log(Result, "resultbody")
        const ResultType = Result?.ResultType;
        const ReferenceData = Result?.ReferenceData
        console.log({ ReferenceData }, "referencedata")

        if (ResultType === 0) {
            const OriginatorConversationID = Result?.OriginatorConversationID;
            const ConversationID = Result?.ConversationID;


            if (OriginatorConversationID && ConversationID) {
                const invoice = await updateInvoiceByMpesaIDsB2c(OriginatorConversationID, ConversationID, { status: "confirmed", body });
                const userId: string = (invoice.user as any)?._id?.toString();
                console.log(invoice, 'invoice ');
                const invoiceId: string = invoice._id?.toString();
                await createTransaction(userId, "mpesa", invoiceId);

                return res.status(200).json({ message: 'Payment successful', OriginatorConversationID, ConversationID });
            }
        }

        return res.status(200).send('Received');
    } catch (error) {
        console.error('Error processing /ResultURL callback:', error);
        return res.status(500).send('Internal server error');
    }
});


// Function to generate OriginatorConversationID
function generateOriginatorConversationID() {
    const uuid = uuidv4();
    return uuid;
}

mpesaRouter.post('/b2c', requireUser, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { Amount, PartyB, duration, startDate } = req.body;

        const consumerKey = process.env.MPESA_CUSTOMER_CONSUMER_KEY;
        const consumerSecret = process.env.MPESA_CUSTOMER_CONSUMER_SECRET;
        const QueueTimeOutURL = `${process.env.BASE_URL}/mpesa/queue`;
        const ResultURL = `${process.env.BASE_URL}/mpesa/ResultURL`;
        const SecurityCredential = process.env.MPESA_SECURITY_CREDENTILAS as string;
        const PartyA = process.env.MPESA_PARTY_A;

        // Generate OriginatorConversationID using UUID
        const OriginatorConversationID = generateOriginatorConversationID();

        // Generate token for authorization
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

        const { data: { access_token: accessToken } } = await axios.get(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                },
            }
        );

        const { data } = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/b2c/v3/paymentrequest',
            {
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
            },
            {
                headers: {
                    Authorization: "Bearer " + accessToken
                },
            }
        );
        const userId = req.user?._id as string;
        const mpesaResponse = data;
        await createInvoice({ mpesaResponse, phoneNumber: PartyB, user: userId, amount: Amount });
        res.status(200).json(data);

        next();
    } catch (error: any) {
        console.error('Error initiating payment:', error.response?.data || error.message);

        return res.status(error.response?.status || 500).json({ error: 'Internal Server Error' });
    }
});

export default mpesaRouter;
