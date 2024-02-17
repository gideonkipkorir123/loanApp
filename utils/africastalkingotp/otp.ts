
import AfricasTalking from 'africastalking';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.AFRICASTALKING_API_KEY as string;
const username = "sandbox";

const africasTalking = AfricasTalking({
    apiKey,
    username,
});

export const sendSMS = async (): Promise<any> => {

    const sms = africasTalking.SMS;

    const options = {
        from: "28877",
        to: '+254715134415',
        message: 'TEST',
    };

    try {
        const response = await sms.send(options);
        console.log('SMS sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw error;
    }
};
