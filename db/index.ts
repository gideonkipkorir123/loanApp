import { UserInterface } from "../type";

interface Session {
    sessionId: string;
    user: UserInterface;
    valid: boolean;
}

const sessions: { [sessionId: string]: Session } = {};

export const getSession = (sessionId: string): Session | null => {
    const session = sessions[sessionId];
    return session && session.valid ? session : null;
};

export const invalidateSession = (sessionId: string): Session | null => {
    const session = sessions[sessionId];
    if (session) {
        sessions[sessionId].valid = false;
    }
    return sessions[sessionId] || null;
};

export const createSession = (user: UserInterface): Session => {
    const sessionId = generateUniqueSessionId();
    const session: Session = { sessionId, user, valid: true };
    sessions[sessionId] = session;
    return session;
};

const generateUniqueSessionId = (): string => {
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).slice(2, 8);
    return `${timestamp}-${randomString}`;
};
