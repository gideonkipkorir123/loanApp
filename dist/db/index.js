"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = exports.invalidateSession = exports.getSession = void 0;
const sessions = {};
const getSession = (sessionId) => {
    const session = sessions[sessionId];
    return session && session.valid ? session : null;
};
exports.getSession = getSession;
const invalidateSession = (sessionId) => {
    const session = sessions[sessionId];
    if (session) {
        sessions[sessionId].valid = false;
    }
    return sessions[sessionId] || null;
};
exports.invalidateSession = invalidateSession;
const createSession = (user) => {
    const sessionId = generateUniqueSessionId();
    const session = { sessionId, user, valid: true };
    sessions[sessionId] = session;
    return session;
};
exports.createSession = createSession;
const generateUniqueSessionId = () => {
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).slice(2, 8);
    // vs code says that substr is depreciated
    return `${timestamp}-${randomString}`;
};
