"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRole = exports.ROLES = exports.requireUser = void 0;
const requireUser = async (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({
            message: "Invalid session"
        });
    }
    return next();
};
exports.requireUser = requireUser;
exports.ROLES = {
    admin: 'admin',
    user: 'user',
    director: 'director',
    CEO: 'CEO'
};
const authRole = (role) => {
    return (req, res, next) => {
        var _a;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== role) {
            return res.status(405).json({
                message: "Permission Denied!"
            });
        }
        return next();
    };
};
exports.authRole = authRole;
