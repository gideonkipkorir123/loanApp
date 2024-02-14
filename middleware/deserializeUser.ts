import { signJWT, verifyJWT, JwtPayload } from "../utils/jwt";
import { getSession } from "../db";
import { NextFunction, Request, Response } from "express";

async function deserializeUser(req: Request, res: Response, next: NextFunction) {
    const { accessToken, refreshToken } = req.cookies;
    // console.log(req.cookies, 'req.cookies')
    if (!accessToken) {
        return next();
    }

    try {
        const { payload, expired } = verifyJWT(accessToken);

        // For a valid access token
        if (payload && typeof payload !== 'string') {
            req.user = payload as JwtPayload;
            return next();
        }

        // expired but valid access token
        const { payload: refresh } = expired && refreshToken ? verifyJWT(refreshToken) : { payload: null };

        if (!refresh || typeof refresh === 'string') {
            // Handle the case when the refresh token is a string (not a payload)
            return next();
        }

        const session = getSession(refresh.sessionId); // Assuming session ID is directly in the payload
        if (!session) {
            return next();
        }

        const newAccessToken = signJWT(session, "1d");
        res.cookie("accessToken", newAccessToken, {
            maxAge: 2.678e+12, // 31 days
            httpOnly: true,
            sameSite: 'none',
            secure: process.env.NODE_ENV !== 'development'
        });

        req.user = verifyJWT(newAccessToken).payload as JwtPayload;
        return next();
    } catch (error) {
        console.error('Error decoding/verifying tokens:', error);
        return next();
    }
}

export default deserializeUser;
