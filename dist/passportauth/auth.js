"use strict";
// auth.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = exports.authenticateGitHubCallback = exports.authenticateGitHub = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_github_1 = require("passport-github");
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("../models/user"));
dotenv_1.default.config();
passport_1.default.use(new passport_github_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/github/callback',
}, async (accessToken, refreshToken, profile, done) => {
    let user = await user_1.default.findOne({ githubEmail: profile.emails });
    if (user) {
        return 'USER ALREADY EXISTS PLEASE LOGIN TO YOUR ACCOUNT';
    }
    await user_1.default.create({
        fullName: profile.username,
        _id: profile.id,
    });
    return done(null, profile);
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((obj, done) => {
    done(null, obj);
});
exports.authenticateGitHub = passport_1.default.authenticate('github');
exports.authenticateGitHubCallback = passport_1.default.authenticate('github', { failureRedirect: '/' });
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};
exports.ensureAuthenticated = ensureAuthenticated;
