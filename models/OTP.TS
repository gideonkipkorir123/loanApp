import mongoose, { Schema } from 'mongoose';

const OTPSchema = new Schema({
    phoneNumber: {
        type: String,
        required: true,
    },
    OTP: {
        type: Number,
        required: true,
    },
});

// OTP Model creation
const OTPModel = mongoose.model('OTP', OTPSchema);

export default OTPModel;
