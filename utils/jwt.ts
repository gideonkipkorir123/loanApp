import jwt, { VerifyErrors, JwtPayload as JsonWebTokenPayload } from 'jsonwebtoken';

export interface JwtPayload extends JsonWebTokenPayload {
    _id?: string;
}

// sign jwt
export function signJWT(payload: JwtPayload, expiresIn: string): string {
    return jwt.sign(payload, process.env.PRIVATE_KEY as string, { expiresIn });
}

// verify tokens issued
export function verifyJWT(token: string): { payload: JwtPayload | null; expired: boolean } {
    try {
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY as string) as JwtPayload;
        return { payload: decoded, expired: false };
    } catch (error) {
        const jwtError = error as VerifyErrors;
        return { payload: null, expired: jwtError.name === 'TokenExpiredError' };
    }
}
