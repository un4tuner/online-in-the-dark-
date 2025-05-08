import cors from 'cors';
import express, { Application } from 'express';
import { logger } from '../logger';
import logRequest from '../middleware/log-request';
import slow from '../middleware/slow';
import authRouter from '../routes/auth-router';
import gameRouter from '../routes/game-router';
import inviteRouter from '../routes/invite-router';
import userRouter from '../routes/user-router';
import { version } from '../version.json';

export const origin = [
  'http://localhost:5173',
];

export default class RestServer {
  private static instance: RestServer;
  private app: Application;
  private constructor() {
    this.app = express();
    this.app.use(express.json());
    if (process.env.SLOW_MODE) this.app.use(slow);
    this.app.use(logRequest);

    logger.info('Allowed origins', { origin });

    this.app.use(
      cors({
        origin,
        credentials: true
      })
    );

    // Routes
    this.app.get('/version', (req, res) => {
      res.send(version);
    });

    this.app.use('/account', userRouter);
    this.app.use('/auth', authRouter);
    this.app.use('/game', gameRouter);
    this.app.use('/invite', inviteRouter);
  }

  static getInstance() {
    if (!RestServer.instance) RestServer.instance = new RestServer();
    return RestServer.instance;
  }

  public getApp() {
    return this.app;
  }
}
