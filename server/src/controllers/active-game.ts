import { Operation, applyPatch } from 'fast-json-patch';
import { logger } from '../logger';
import { GameModel, PlayerRole } from '../models/game';
import { UserModel } from '../models/user';
import { IOServer } from '../servers/io-server';

export enum OperationType {
  ADD = 'add',
  REMOVE = 'remove',
  REPLACE = 'replace'
}

export class ActiveGame {
  public static activeGames: ActiveGame[] = [];

  public gameId: string; // Game ID is used as the room name as well
  public state: any = {}; // The current game's state, gets loaded from the database, and gets updated with patches
  private patchQueue: Operation[] = []; // Patches to be applied to the game state on the next tick

  constructor(gameId: string) {
    this.gameId = gameId;
  }

  public static async activateGame(gameId: string) {
    const game = ActiveGame.activeGames.find((game) => game.gameId === gameId);
    if (game) {
      return game;
    }

    const newGame = new ActiveGame(gameId);
    await newGame.load();
    ActiveGame.activeGames.push(newGame);
    return newGame;
  }

  public static deactivateGame(gameId: string) {
    const game = ActiveGame.activeGames.find((game) => game.gameId === gameId);
    if (!game) {
      logger.warn('Game not found while deactivating', { gameId });
      return;
    }

    game.save();
    ActiveGame.activeGames = ActiveGame.activeGames.filter(
      (game) => game.gameId !== gameId
    );

    logger.info('Game deactivated', { gameId });
  }

  public async addUser(userId: string) {
    if (this.state.players[userId]) return;

    const user = await UserModel.findById({ _id: userId });

    this.applyPatchesAndBroadcast([
      {
        op: OperationType.ADD,
        path: `/players/${userId}`,
        value: {
          id: user._id,
          portrait: user.portrait,
          username: user.username,
          isGuest: user.isGuest,
          isOnline: false,
          role: PlayerRole.PLAYER
        }
      }
    ]);
  }

  public removeUser(userId: string) {
    if (!this.state.players[userId]) return;

    this.applyPatchesAndBroadcast([
      {
        op: OperationType.REMOVE,
        path: `/players/${userId}`
      }
    ]);
  }

  public applyPatchesAndBroadcast(patches: Operation[]) {
    try {
      // Auto-create player if missing for any /players/{userId}/... patch
      patches.forEach((patch) => {
        const match = patch.path.match(/^\/players\/([^/]+)/);
        if (match) {
          const userId = match[1];
          if (!this.state.players[userId]) {
            this.state.players[userId] = {
              username: 'Guest',
              portrait: '',
              isGuest: true,
              isOnline: true,
              role: PlayerRole.PLAYER
            };
          }
        }
      });
      logger.info('Applying patches', {
        patches: patches.map((patch) => `[${patch.op}] ${patch.path}`)
      });
      this.state = applyPatch(this.state, patches).newDocument;
      IOServer.getInstance().broadcast(this.gameId, {
        type: 'patch',
        patches
      });
    } catch (error) {
      logger.error('Error applying patch', {
        gameId: this.gameId,
        patches: patches.map((patch) => `[${patch.op}] ${patch.path}`)
      });
    }
  }

  public addToPatchQueue(patch: Operation | Operation[]) {
    if (!patch) return;
    if (Array.isArray(patch)) this.patchQueue.push(...patch);
    else this.patchQueue.push(patch);
  }

  public applyPatchQueueAndBroadcast() {
    if (this.patchQueue.length === 0) return;
    this.applyPatchesAndBroadcast(this.patchQueue);
    this.patchQueue = [];
  }

  public async load() {
    logger.info('Loading game from MongoDB', { gameId: this.gameId });
    const gameModel = await GameModel.findById({ _id: this.gameId });

    if (!gameModel) {
      logger.error('Game not found in MongoDB', { gameId: this.gameId });
      return;
    }

    this.applyPatchesAndBroadcast([
      {
        op: OperationType.REPLACE,
        path: '',
        value: gameModel.toObject()
      }
    ]);
  }

  public async save() {
    try {
      const gameModel = await GameModel.findById({ _id: this.gameId });
      // Only set allowed fields
      const allowedFields = [
        'name', 'coverImage', 'dateCreated', 'inviteCode', 'players',
        'gms', 'lastActive', 'data', 'codex'
      ];
      for (const key of allowedFields) {
        if (this.state[key] !== undefined) {
          gameModel.set(key, this.state[key]);
        }
      }
      await gameModel.save();
      // logger.info('Game saved to MongoDB', { gameId: this.gameId });
    } catch (error) {
      logger.error(`Error saving game to database`, {
        gameId: this.gameId,
        error: error.message || error
      });
    }
  }
}
