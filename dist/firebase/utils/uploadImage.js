"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const firebase_1 = require("../firebase");
const storage_1 = require("@firebase/storage");
const uploadImage = async (file) => {
    const storageRef = (0, storage_1.ref)(firebase_1.storage, `images/${file.originalname}`);
    await (0, storage_1.uploadBytes)(storageRef, file.buffer);
    const downloadURL = await (0, storage_1.getDownloadURL)(storageRef);
    const timestamp = Date.now();
    return { downloadURL, timestamp };
};
exports.uploadImage = uploadImage;
