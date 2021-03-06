import { Application } from 'express';
import examplesRouter from './api/controllers/examples/router'
import authRouter from './api/controllers/auth/router'
import * as passportConfig from "./common/passport";


export default function routes(app: Application): void {
  app.use('/api/v1/examples', passportConfig.isAuthenticated, examplesRouter);
  app.use('/api/v1/auth', authRouter);
};