import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});
const Token = mongoose.model('Token', tokenSchema);

export default Token;
