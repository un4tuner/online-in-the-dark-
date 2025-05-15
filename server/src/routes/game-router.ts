import { HttpStatusCode } from 'axios';
import { Router } from 'express';
import { ActiveGame } from '../controllers/active-game';
import { logger } from '../logger';
import authenticate from '../middleware/authenticate';
import identifyUser, { identifyGame } from '../middleware/identify';
import { GameDocument, GameModel, PlayerRole } from '../models/game';
import { UserDocument, UserModel } from '../models/user';
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
      gms: [user.id], // Creator is the first GM
      lastActive: new Date(),
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
      // Update lastActive
      game.lastActive = new Date();
      await game.save();
    } catch (err) {
      logger.error('Error patching game', { error: err.message });
    }

    return res.status(HttpStatusCode.Ok).send('Patched game');
  }
);

// Get all games (for admin panel)
router.get('/all', async (req, res) => {
  try {
    const games = await GameModel.find();
    res.json(games);
  } catch (err) {
    res.status(500).send('Error fetching games');
  }
});

// Admin: Add a GM to a game
router.post('/add-gm', authenticate, identifyUser, async (req: any, res: any) => {
  try {
    if (!req.user || req.user.role !== 'superuser') {
      return res.status(403).send('Forbidden');
    }
    const { gameId, gmId } = req.body;
    const game = await GameModel.findById(gameId);
    if (!game) return res.status(404).send('Game not found');
    if (!game.gms) game.gms = [];
    if (!game.gms.includes(gmId)) game.gms.push(gmId);
    // Ensure the user is in players as GM
    if (!game.players) game.players = {};
    if (!game.players[gmId]) {
      // Try to get username from UserModel
      let username = 'GM';
      let portrait = '';
      try {
        const user = await UserModel.findById(gmId);
        if (user) {
          username = user.username;
          portrait = user.portrait;
        }
      } catch {}
      game.players[gmId] = {
        username,
        portrait,
        isGuest: false,
        isOnline: false,
        role: PlayerRole.GM
      };
    } else {
      game.players[gmId].role = PlayerRole.GM;
    }
    game.lastActive = new Date();
    await game.save();
    logger.info('Added GM to game', { gameId, gmId });
    res.status(200).send('GM added');
  } catch (err) {
    logger.error('Error adding GM', { error: err.message });
    res.status(500).send('Error adding GM');
  }
});

// Admin: Remove a GM from a game
router.post('/remove-gm', authenticate, identifyUser, async (req: any, res: any) => {
  try {
    if (!req.user || req.user.role !== 'superuser') {
      return res.status(403).send('Forbidden');
    }
    const { gameId, gmId } = req.body;
    const game = await GameModel.findById(gameId);
    if (!game) return res.status(404).send('Game not found');
    if (!game.gms) game.gms = [];
    game.gms = game.gms.filter((id: string) => id !== gmId);
    game.lastActive = new Date();
    await game.save();
    logger.info('Removed GM from game', { gameId, gmId });
    res.status(200).send('GM removed');
  } catch (err) {
    logger.error('Error removing GM', { error: err.message });
    res.status(500).send('Error removing GM');
  }
});

// Add a guest player to a game if not already present
router.post('/:gameId/add-guest', async (req, res) => {
  try {
    const { userId, username, portrait } = req.body;
    const { gameId } = req.params;
    if (!userId || !gameId) return res.status(400).send('Missing userId or gameId');
    const game = await GameModel.findById(gameId);
    if (!game) return res.status(404).send('Game not found');
    if (!game.players) game.players = {};
    if (!game.players[userId]) {
      game.players[userId] = {
        username: username || 'Guest',
        portrait: portrait || '',
        isGuest: true,
        isOnline: true,
        role: PlayerRole.PLAYER
      };
      await game.save();
    }
    // Add game to user's games array if not present
    const user = await UserModel.findById(userId);
    if (user && (!user.games || !user.games.map(id => id.toString()).includes(gameId))) {
      user.games = user.games || [];
      user.games.push(gameId);
      await user.save();
    }
    res.status(200).json(game);
  } catch (err) {
    res.status(500).send('Error adding guest to game');
  }
});

// Remove a player from a game (superuser only)
router.post('/:gameId/remove-player', authenticate, identifyUser, async (req: any, res) => {
  try {
    if (!req.user || req.user.role !== 'superuser') {
      return res.status(403).send('Forbidden');
    }
    const { gameId } = req.params;
    const { playerId } = req.body;
    const game = await GameModel.findById(gameId);
    if (!game) {
      logger.error('Remove player: Game not found', { gameId });
      return res.status(404).send('Game not found');
    }
    let removedFromPlayers = false;
    let removedFromGMs = false;
    if (game.players && game.players[playerId]) {
      delete game.players[playerId];
      removedFromPlayers = true;
    }
    if (game.gms && game.gms.includes(playerId)) {
      game.gms = game.gms.filter((id: string) => id !== playerId);
      removedFromGMs = true;
    }
    await game.save();
    logger.info('Player removed from game', { gameId, playerId, removedFromPlayers, removedFromGMs });
    res.status(200).send('Player removed');
  } catch (err) {
    logger.error('Error removing player', { error: err.message });
    res.status(500).send('Error removing player');
  }
});

// Delete a game (superuser only)
router.delete('/:gameId', authenticate, identifyUser, async (req: any, res) => {
  try {
    if (!req.user || req.user.role !== 'superuser') {
      return res.status(403).send('Forbidden');
    }
    const { gameId } = req.params;
    const game = await GameModel.findById(gameId);
    if (!game) return res.status(404).send('Game not found');
    await game.deleteOne();
    // Remove gameId from all users' games arrays
    const UserModel = require('../models/user').UserModel;
    await UserModel.updateMany(
      { games: gameId },
      { $pull: { games: gameId } }
    );
    res.status(200).send('Game deleted');
  } catch (err) {
    res.status(500).send('Error deleting game');
  }
});

export default router;
