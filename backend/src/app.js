import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import memberRouter from './routes/member.route.js';
import unitRouter from './routes/unit.route.js';
import feePolicyRouter from './routes/feePolicy.route.js';
import feeObligationRouter from './routes/feeObligation.route.js';
import feePaymentRouter from './routes/feePayment.route.js';
import feeCashbookRouter from './routes/feeCashbook.route.js';
import feeDistributionRouter from './routes/feeDistribution.route.js';
import feeApprovalRouter from './routes/feeApproval.route.js';
import activityRouter from './routes/activity.route.js';
import reportRouter from './routes/report.route.js';
import profileRouter from './routes/profile.route.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/members', memberRouter);
app.use('/api/units', unitRouter);
app.use('/api/fee-policies', feePolicyRouter);
app.use('/api/fee-obligations', feeObligationRouter);
app.use('/api/fee-payments', feePaymentRouter);
app.use('/api/fee-cashbooks', feeCashbookRouter);
app.use('/api/fee-distributions', feeDistributionRouter);
app.use('/api/fee-approvals', feeApprovalRouter);
app.use('/api/activities', activityRouter);
app.use('/api/reports', reportRouter);
app.use('/api/profile', profileRouter);

app.get('/', (req, res) => {
  res.json({ message: 'FeeManagement API is running!' });
});

app.use(errorMiddleware);

export default app;
