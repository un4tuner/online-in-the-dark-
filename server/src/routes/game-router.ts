import { HttpStatusCode } from 'axios';
import { Router } from 'express';
import { ActiveGame } from '../controllers/active-game';
import { logger } from '../logger';
import authenticate from '../middleware/authenticate';
import identifyUser, { identifyGame } from '../middleware/identify';
import { GameDocument, GameModel, PlayerRole } from '../models/game';
import { UserDocument } from '../models/user';
import { makeGameInviteCode } from '../util/names';

const router = Router();

// New Game
router.post('/new', authenticate, identifyUser, async (req: any, res: any) => {
  const user = req.user as UserDocument;
  const { gameName, coverImage, codex } = req.body;
  if (!gameName || !coverImage)
    return res.status(HttpStatusCode.BadRequest).send('Invalid data');

  try {
    const game = await GameModel.create({
      name: gameName,
      coverImage,
      dateCreated: new Date(),
      players: {
        [user.id]: {
          username: user.username,
          portrait: user.portrait,
          isGuest: user.isGuest,
          isOnline: false,
          role: PlayerRole.GM
        }
      },
      data: null,
      inviteCode: makeGameInviteCode(),
      codex
    });
    await game.save();
    user.games.push(game._id);
    await user.save();

    const games = await GameModel.find({
      _id: { $in: user.games }
    });

    logger.info('New game created', {
      gameId: game._id,
      userId: user._id
    });
    return res.status(HttpStatusCode.Ok).json(games);
  } catch (err) {
    logger.error('Error creating game', { error: err.message });
    return res.status(HttpStatusCode.BadRequest).send('Invalid data');
  }
});

// Remove a user from a game
router.post(
  '/:gameId/leave',
  authenticate,
  identifyUser,
  identifyGame,
  async (req: any, res: any) => {
    const user = req.user as UserDocument;
    const game = req.game as GameDocument;

    try {
      // Remove the user from the gamestate
      const gameIdToLeave = game._id.toString();
      const activeGame = await ActiveGame.activateGame(gameIdToLeave);
      activeGame.removeUser(user._id.toString());
      await activeGame.save();

      // Add game to user's list of games
      user.games = user.games.filter(
        (gameId) => gameId.toString() !== gameIdToLeave
      );

      await user.save();

      return res.status(HttpStatusCode.Ok).send();
    } catch (err) {
      logger.error('Error leaving game', { error: err.message });
    }

    return res.status(HttpStatusCode.Ok).send('Left game');
  }
);

// Send a game patch to the backend
router.patch(
  '/:gameId',
  authenticate,
  identifyUser,
  identifyGame,
  async (req: any, res: any) => {
    const user = req.user as UserDocument;
    const game = req.game as GameDocument;
    if (!game.players[user.id])
      return res.status(HttpStatusCode.Forbidden).send('Unauthorized');

    const patches = req.body;

    try {
      const gameIdToPatch = game._id.toString();
      const activeGame = await ActiveGame.activateGame(gameIdToPatch);
      activeGame.addToPatchQueue(patches);
    } catch (err) {
      logger.error('Error patching game', { error: err.message });
    }

    return res.status(HttpStatusCode.Ok).send('Patched game');
  }
);

export default router;
