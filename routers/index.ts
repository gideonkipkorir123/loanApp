import express, { Request, Response } from 'express';
import userRouter from './user';
import loanRouter from './loan';
import authRouter from './auth';
import mpesaRouter from './mpesa';
import { requireUser } from '../middleware/requireUser';
const router = express.Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/mpesa', mpesaRouter);
router.use('/loans', requireUser, loanRouter);
router.get('/resetPasswordPage',(req:Request,res:Response)=>{
    res.send('Reset Password Page')

});

export default router;
