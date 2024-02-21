"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./user"));
const loan_1 = __importDefault(require("./loan"));
const auth_1 = __importDefault(require("./auth"));
const requireUser_1 = require("../middleware/requireUser");
const router = express_1.default.Router();
router.use('/users', user_1.default);
router.use('/auth', auth_1.default);
router.use('/loans', requireUser_1.requireUser, loan_1.default);
router.get('/resetPasswordPage', (req, res) => {
    res.send('Reset Password Page');
});
router.get('/verifyEmailPage', (req, res) => {
    res.send('http:localhost:3000/auth/verifyEmailPage');
});
exports.default = router;
