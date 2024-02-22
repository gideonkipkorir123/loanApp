import * as admin from 'firebase-admin';
import dotenv from "dotenv";
dotenv.config();
import * as serviceAccount from '../../firebase_service_account.json';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: process.env.FIREBASE_BUCKET,
});

const bucket = admin.storage().bucket();

export { bucket };
