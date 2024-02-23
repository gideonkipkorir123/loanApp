import * as admin from 'firebase-admin';
import dotenv from "dotenv";
dotenv.config();
const firebaseServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT as string;

const serviceAccount = JSON.parse(firebaseServiceAccount)

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: process.env.FIREBASE_BUCKET as string,
});

const bucket = admin.storage().bucket();

export { bucket };
