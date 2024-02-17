"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../utils/jwt");
const db_1 = require("../db");
async function deserializeUser(req, res, next) {
    const { accessToken, refreshToken } = req.cookies;
    // console.log(req.cookies, 'req.cookies')
    if (!accessToken) {
        return next();
    }
    try {
        const { payload, expired } = (0, jwt_1.verifyJWT)(accessToken);
        // For a valid access token
        if (payload && typeof payload !== 'string') {
            req.user = payload;
            return next();
        }
        // expired but valid access token
        const { payload: refresh } = expired && refreshToken ? (0, jwt_1.verifyJWT)(refreshToken) : { payload: null };
        if (!refresh || typeof refresh === 'string') {
            // Handle the case when the refresh token is a string (not a payload)
            return next();
        }
        const session = (0, db_1.getSession)(refresh.sessionId); // Assuming session ID is directly in the payload
        if (!session) {
            return next();
        }
        const newAccessToken = (0, jwt_1.signJWT)(session, "1d");
        res.cookie("accessToken", newAccessToken, {
            maxAge: 2.678e+12, // 31 days
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV !== 'development'
        });
        req.user = (0, jwt_1.verifyJWT)(newAccessToken).payload;
        return next();
    }
    catch (error) {
        console.error('Error decoding/verifying tokens:', error);
        return next();
    }
}
exports.default = deserializeUser;
