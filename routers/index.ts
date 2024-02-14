import express from 'express';
import userRouter from './user';
import loanRouter from './loan';
import authRouter from './auth';
import { requireUser } from '../middleware/requireUser';
const router = express.Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/loans', requireUser, loanRouter);

export default router;
