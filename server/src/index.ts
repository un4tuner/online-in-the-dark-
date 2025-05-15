import dotenv from 'dotenv';
import { createServer } from 'http';
import mongoose from 'mongoose';
import { deleteExpiredGuestUsers } from './controllers/user-controller';
import { logger } from './logger';
import { GameModel } from './models/game';
import { UserModel } from './models/user';
import { IOServer } from './servers/io-server';
import RestServer from './servers/rest-server';
import userRouter from './routes/user-router';
import cron from 'node-cron';
import booksRouter from './routes/books-router';
import imagesRouter from './routes/images-router';

initialize();

async function initialize() {
  // Env variables
  dotenv.config();

  if (!process.env.DB_URI) return console.error('DB_URI not set');

  logger.info('Connecting to MongoDB ...');
  await mongoose.connect(process.env.DB_URI);

  if (false) {
    await UserModel.deleteMany({});
    await GameModel.deleteMany({});
    logger.info('Deleted all users and games');
  }

  const guestsCount = await UserModel.countDocuments({ isGuest: true });
  const registeredUsersCount = await UserModel.countDocuments({
    isGuest: false
  });
  logger.info('Connected to MongoDB', {
    guestsCount,
    registeredUsersCount,
    gamesCount: await GameModel.countDocuments()
  });

  // Start the guest user cleanup job
  cleanupGuests();
  setInterval(cleanupGuests, 1000 * 60 * 60); // Run every hour

  // Scheduled job: delete games after 90 days of inactivity
  cron.schedule('0 0 * * *', async () => { // every day at midnight
    const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const result = await GameModel.deleteMany({ lastActive: { $lt: cutoff } });
    if (result.deletedCount > 0) {
      logger.info(`Deleted ${result.deletedCount} inactive games (90+ days)`);
    }
  });

  // Start REST server
  const restServer = RestServer.getInstance();
  const app = restServer.getApp();

  // Start SocketIO server
  const ioServer = IOServer.getInstance();
  const server = createServer(app);
  ioServer.start(server);

  app.use('/user', userRouter);
  app.use('/books', booksRouter);
  app.use('/images', imagesRouter);

  const port = process.env.PORT || 3005;
  server.listen(port, () => {
    logger.info(`Server running on port ${port}`);
  });
}

function cleanupGuests() {
  const days = parseInt(process.env.GUEST_USER_EXPIRATION_DAYS) || 7;
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() - days);
  deleteExpiredGuestUsers(expirationDate);
}
