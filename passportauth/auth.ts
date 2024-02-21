// auth.ts

import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github';
import { Request } from 'express';
import dotenv from 'dotenv';
import User from '../models/user';
import OAuth2Strategy from 'passport-oauth2';
import { createUser } from '../utils/user';

dotenv.config();

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    callbackURL: 'http://localhost:3000/auth/github/callback',
}, async (accessToken: string, refreshToken: string,profile: GitHubStrategy.Profile,
     done: OAuth2Strategy.VerifyCallback) => {
    let user = await User.findOne({ githubEmail: profile.emails });
    if(user){
        return 'USER ALREADY EXISTS PLEASE LOGIN TO YOUR ACCOUNT'
    }
    await User.create({
        fullName: profile.username,
        _id: profile.id,



    })
    return done(null, profile);
}));

passport.serializeUser((user: any, done) => {
    done(null, user);
});

passport.deserializeUser((obj: any, done) => {
    done(null, obj);
});

export const authenticateGitHub = passport.authenticate('github');
export const authenticateGitHubCallback = passport.authenticate('github', { failureRedirect: '/' });

export const ensureAuthenticated = (req: Request, res: any, next: any) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};
