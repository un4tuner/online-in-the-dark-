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
import path from 'path';
import booksRouter from '../routes/books-router';
import imagesRouter from '../routes/images-router';

export const origin = [
  'http://localhost:5173',
  'http://localhost:4173',
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
        origin: true,
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

    // Mount API routers BEFORE static middleware
    this.app.use('/images', imagesRouter);
    this.app.use('/books', booksRouter);

    // Static serving (must come after routers)
    this.app.use('/images', express.static(path.join(__dirname, '../../Images')));
    this.app.use('/books', express.static(path.join(__dirname, '../../Books')));

    // Serve static files from the client/dist directory
    this.app.use(express.static(path.join(__dirname, '../../../client/dist')));
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../../../client/dist', 'index.html'));
    });
  }

  static getInstance() {
    if (!RestServer.instance) RestServer.instance = new RestServer();
    return RestServer.instance;
  }

  public getApp() {
    return this.app;
  }
}
