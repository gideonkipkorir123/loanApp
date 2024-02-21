"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
// Import the functions you need from the SDKs you need
const app_1 = require("firebase/app");
const storage_1 = require("@firebase/storage");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API,
    authDomain: process.env.FIREBASE_AUTH_ADMIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};
// Initialize Firebase
const firebaseApp = (0, app_1.initializeApp)(firebaseConfig);
exports.default = firebaseApp;
const storage = (0, storage_1.getStorage)(firebaseApp);
exports.storage = storage;
