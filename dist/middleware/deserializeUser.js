"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("../utils/jwt");
const db_1 = require("../db");
function deserializeUser(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        console.log(req.headers, 'req.headers');
        console.log(accessToken, 'request access token');
        if (!accessToken) {
            return next();
        }
        const { payload, expired } = (0, jwt_1.verifyJWT)(accessToken);
        console.log(payload, expired, 'payload');
        // For a valid access token
        if (payload) {
            req.user = payload; // Assuming payload is of type UserInterface
            console.log(payload, 'payload');
            return next();
        }
        // Expired but valid access token
        const { payload: refresh } = expired ? (0, jwt_1.verifyJWT)(req.headers.refresh_token) : { payload: null };
        if (!refresh) {
            return next();
        }
        const session = (0, db_1.getSession)(refresh.sessionId);
        // ERROR
        console.log(session);
        if (!session) {
            return next();
        }
        const newAccessToken = (0, jwt_1.signJWT)(session, '30d');
        // Set the new access token in the headers
        res.setHeader('Authorization', `Bearer ${newAccessToken}`);
        req.user = (0, jwt_1.verifyJWT)(newAccessToken).payload;
        return next();
    });
}
exports.default = deserializeUser;
