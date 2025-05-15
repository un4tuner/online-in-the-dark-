import { HttpStatusCode } from 'axios';
import { Router } from 'express';
import { ActiveGame } from '../controllers/active-game';
import { logger } from '../logger';
import authenticate from '../middleware/authenticate';
import identifyUser from '../middleware/identify';
import { GameModel } from '../models/game';
import { UserDocument } from '../models/user';

const router = Router();

// Accept invite to a game
router.post(
  '/:inviteCode',
  authenticate,
  identifyUser,
  async (req: any, res: any) => {
    const user = req.user as UserDocument;
    const { inviteCode } = req.params;
    if (!inviteCode)
      return res.status(HttpStatusCode.BadRequest).send('Invalid data');

    try {
      const gameModel = (await GameModel.findOne({ inviteCode })).toObject();
      if (!gameModel)
        return res.status(HttpStatusCode.NotFound).send('Game not found');

      // Add the new user to the gamestate
      const gameId = gameModel._id.toString();
      const activeGame = await ActiveGame.activateGame(gameId);
      await activeGame.addUser(user._id.toString());
      await activeGame.save();

      // Add game to user's list of games
      if (!user.games.map(id => id.toString()).includes(gameId)) {
        user.games.push(gameId);
        await user.save();
      }

      return res.status(HttpStatusCode.Ok).json({ gameId });
    } catch (err) {
      logger.error('Error joining game', { error: err.message });
      return res.status(HttpStatusCode.BadRequest).send('Invalid data');
    }
  }
);

export default router;
