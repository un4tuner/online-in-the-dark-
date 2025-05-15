import { HttpStatusCode } from 'axios';
import bcrypt from 'bcrypt';
import { Router } from 'express';
import { logger } from '../logger';
import authenticate from '../middleware/authenticate';
import identifyUser from '../middleware/identify';
import { GameModel } from '../models/game';
import { UserDocument, UserModel } from '../models/user';
import { makeRandomName, makeRandomPassword } from '../util/names';
import { makeAccessToken, makeRefreshToken } from '../util/token-util';

const router = Router();

// Guest Account Creation
// Allow users to create a guest account with a random username and password
router.post('/create-guest', async (req, res) => {
  // Generate a random username and password for guest users
  try {
    const username = makeRandomName();
    const password = makeRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      username,
      password: hashedPassword,
      portrait: '791e4a6b-8f2e-41b2-8410-09fdb69d22e2', // Default portrait
      isGuest: true
    });
    await user.save();
    logger.info('Created guest account', { username });
    const refreshToken = makeRefreshToken(user._id.toString());
    const accessToken = makeAccessToken(user._id.toString());
    return res.status(HttpStatusCode.Ok).json({ refreshToken, accessToken });
  } catch (err) {
    logger.error('Error creating guest account', { error: err.message });
    return res.status(HttpStatusCode.BadRequest).send('Invalid data');
  }
});

// Account Creation
// Allow users to register a guest account with a username and password
// Payload: { username, password }
router.post(
  '/create',
  authenticate,
  identifyUser,
  async (req: any, res: any) => {
    const user: UserDocument = req.user;
    const oldName = user.username;
    let { username, password } = req.body;

    if (!user.isGuest)
      return res
        .status(HttpStatusCode.BadRequest)
        .send('This account is already registered');

    if (
      username.length < 3 ||
      username.length > 24 ||
      !/^[a-zA-Z0-9-_]+$/.test(username)
    ) {
      const errorMessageInvalidUsernameLength = `Error creating account for user ${username}: Invalid username length`;
      logger.error('Error registering account', {
        error: errorMessageInvalidUsernameLength
      });
      return res
        .status(HttpStatusCode.BadRequest)
        .send(errorMessageInvalidUsernameLength);
    }

    if (password.length < 8) {
      const errorMessageInvalidPasswordLength = `Error creating account for user ${username}: Invalid password length`;
      logger.error('Error registering account', {
        error: errorMessageInvalidPasswordLength
      });
      return res
        .status(HttpStatusCode.BadRequest)
        .send(errorMessageInvalidPasswordLength);
    }

    if (
      await UserModel.findOne({
        username: { $regex: new RegExp(username, 'i') }
      })
    ) {
      const errorMessageUsernameTaken = `That username is already taken`;
      logger.error('Error registering account', {
        error: errorMessageUsernameTaken
      });
      return res
        .status(HttpStatusCode.Conflict)
        .send(errorMessageUsernameTaken);
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.username = username;
      user.password = hashedPassword;
      user.isGuest = false;
      await user.save();
      logger.info('Registered account', { username, oldName });
      return res.status(HttpStatusCode.Ok).send();
    } catch (err) {
      logger.error('Error registering account', { error: err.message });
      return res.status(HttpStatusCode.BadRequest).send('Invalid data');
    }
  }
);

// Login
// Allow users to login to an existing account and provides a refresh token
// Payload: { username, password }
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const errorMessageInvalidUserOrPassword = `Wrong username or password`;

  // Check if username and password are provided
  if (!username || !password) {
    logger.error('Error logging in', {
      error: 'Username or password not provided'
    });

    return res
      .status(HttpStatusCode.BadRequest)
      .send(errorMessageInvalidUserOrPassword);
  }

  try {
    // Find the user by username, ignore case
    const user = await UserModel.findOne({
      username: { $regex: new RegExp(username, 'i') }
    });

    // If user doesn't exist, return error
    if (!user) {
      logger.error('Error logging in', {
        error: 'Invalid username',
        username
      });
      return res
        .status(HttpStatusCode.BadRequest)
        .send(errorMessageInvalidUserOrPassword);
    }

    // If passwords don't match, return error
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.error('Error logging in', {
        error: 'Invalid password',
        username
      });
      return res
        .status(HttpStatusCode.BadRequest)
        .send(errorMessageInvalidUserOrPassword);
    }

    logger.info('User logged in', { username });
    return res.status(HttpStatusCode.Ok).json({
      refreshToken: makeRefreshToken(user._id.toString()),
      accessToken: makeAccessToken(user._id.toString())
    });
  } catch (error) {
    logger.error('Error logging in', { error: error.message });
    return res
      .status(HttpStatusCode.InternalServerError)
      .send('Internal Server Error');
  }
});

// Logout
// Allow users to logout of their account and invalidate their access token
// Authentication: Requires a valid access token
router.post('/logout', authenticate, identifyUser, (req: any, res: any) => {
  const user = req.user as UserDocument;
  logger.info('User logged out', { username: user.username });
  res.status(HttpStatusCode.Ok).send();
});

// View Account Information
// Allow users to view their account information
// Authentication: Requires a valid access token
// Use the authenticate middleware
router.get('/me', authenticate, identifyUser, async (req: any, res: any) => {
  const { id, user } = req;
  if (!id || !user) {
    logger.error('Error fetching user information', {
      error: 'Invalid user ID',
      userId: id
    });
    return res.status(HttpStatusCode.BadRequest);
  }

  const games = await GameModel.find({
    _id: { $in: user.games }
  });

  res.status(HttpStatusCode.Ok).json({
    id,
    username: user.username,
    portrait: user.portrait,
    isGuest: user.isGuest,
    games
  });
});

// Set Portrait
// Allow users to set their portrait
// Authentication: Requires a valid access token
// Payload: { portraitId }
router.put(
  '/portrait',
  authenticate,
  identifyUser,
  async (req: any, res: any) => {
    const { portraitId } = req.body;
    if (!portraitId) {
      logger.error('Error setting portrait', {
        error: 'Portrait ID not provided'
      });
      return res.status(HttpStatusCode.BadRequest).send('Invalid data');
    }

    const { id, user } = req;
    user.portrait = portraitId;
    await user.save();
    res.status(HttpStatusCode.Ok).send();
  }
);

// Change Password
// Allow users to change their password
// Authentication: Requires a valid access token
// Payload: { oldPassword, newPassword }
router.put(
  '/password',
  authenticate,
  identifyUser,
  async (req: any, res: any) => {
    const { password, newPassword } = req.body;
    if (!password || !newPassword) {
      logger.error('Error changing password', {
        error: 'Password not provided'
      });
      return res.status(HttpStatusCode.BadRequest).send('Invalid data');
    }

    const { user } = req;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.error('Error changing password', {
        error: 'Invalid password',
        userId: user._id,
        username: user.username
      });
      return res.status(HttpStatusCode.BadRequest).send('Invalid password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    logger.info('Password changed', {
      userId: user._id,
      username: user.username
    });
    res.status(HttpStatusCode.Ok).send();
  }
);

// Change Username
// Allow users to change their username
// Authentication: Requires a valid access token
// Payload: { newUsername }
router.put(
  '/username',
  authenticate,
  identifyUser,
  async (req: any, res: any) => {
    const { newUsername } = req.body;
    const { user } = req;

    if (
      newUsername.length < 3 ||
      newUsername.length > 24 ||
      !/^[a-zA-Z0-9-_]+$/.test(newUsername)
    ) {
      const errorMessageInvalidUsernameLength = `Error changing username for user ${user.username}: Invalid username length`;
      logger.error('Error changing username', {
        error: errorMessageInvalidUsernameLength,
        userId: user._id
      });
      return res
        .status(HttpStatusCode.BadRequest)
        .send(errorMessageInvalidUsernameLength);
    }

    if (
      await UserModel.findOne({
        username: { $regex: new RegExp(newUsername, 'i') }
      })
    ) {
      const errorMessageUsernameTaken = `That username is already taken`;
      logger.error('Error changing username', {
        error: errorMessageUsernameTaken,
        userId: user._id
      });
      return res
        .status(HttpStatusCode.Conflict)
        .send(errorMessageUsernameTaken);
    }

    user.username = newUsername;
    await user.save();

    logger.info('Username changed', {
      userId: user._id,
      newUsername
    });

    res.status(HttpStatusCode.Ok).send();
  }
);

// Delete Account
// Allow users to delete their account
// Authentication: Requires a valid access token
router.delete('/me', authenticate, identifyUser, async (req: any, res: any) => {
  const { user } = req;
  const { password } = req.body;
  // If passwords don't match, return error
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    logger.error('Error deleting account', {
      error: 'Invalid password',
      userId: user._id,
      username: user.username
    });
    return res
      .status(HttpStatusCode.BadRequest)
      .send('The provided password is incorrect.');
  }

  res.status(HttpStatusCode.Ok).send();

  // TODO: delete the user from all games

  await UserModel.deleteOne({ _id: user._id });

  logger.info('Account deleted', {
    userId: user._id,
    username: user.username
  });
});

// TEMPORARY: Reset or create Administrator password
router.post('/reset-admin-password', async (req, res) => {
  try {
    let user = await UserModel.findOne({ username: 'Administrator' });
    const hashedPassword = await bcrypt.hash('5nX4mVp2', 10);
    if (!user) {
      // Create the Administrator user if not found
      user = new UserModel({
        username: 'Administrator',
        password: hashedPassword,
        isGuest: false,
        portrait: '',
        games: [],
        createdAt: new Date()
      });
      await user.save();
      return res.status(201).send('Administrator user created and password set');
    }
    user.password = hashedPassword;
    await user.save();
    return res.status(200).send('Administrator password reset');
  } catch (err) {
    return res.status(500).send('Error resetting password');
  }
});

// List all users with roles and games
router.get('/all-admin', async (req, res) => {
  try {
    const users = await UserModel.find({}, 'username role games');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send('Error fetching users');
  }
});

// Promote or demote a user (superuser only)
router.post('/promote-user', authenticate, identifyUser, async (req: any, res: any) => {
  try {
    if (!req.user || req.user.role !== 'superuser') {
      return res.status(403).send('Forbidden');
    }
    const { userId, role } = req.body;
    if (!['superuser', 'master', 'player'].includes(role)) {
      return res.status(400).send('Invalid role');
    }
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).send('User not found');
    user.role = role;
    await user.save();
    res.status(200).send('User role updated');
  } catch (err) {
    res.status(500).send('Error updating user role');
  }
});

// Reset a user's password (superuser only)
router.post('/reset-password', authenticate, identifyUser, async (req: any, res: any) => {
  try {
    if (!req.user || req.user.role !== 'superuser') {
      return res.status(403).send('Forbidden');
    }
    const { userId, newPassword } = req.body;
    if (!userId || !newPassword) return res.status(400).send('Missing userId or newPassword');
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).send('User not found');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).send('Password reset');
  } catch (err) {
    res.status(500).send('Error resetting password');
  }
});

// Delete a user (superuser only)
router.delete('/:id', authenticate, identifyUser, async (req: any, res: any) => {
  try {
    if (!req.user || req.user.role !== 'superuser') {
      return res.status(403).send('Forbidden');
    }
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    await user.deleteOne();
    res.status(200).send('User deleted');
  } catch (err) {
    res.status(500).send('Error deleting user');
  }
});

// Remove a game from a user's games array (superuser only)
router.post('/:userId/remove-game', authenticate, identifyUser, async (req: any, res) => {
  try {
    if (!req.user || req.user.role !== 'superuser') {
      return res.status(403).send('Forbidden');
    }
    const { userId } = req.params;
    const { gameId } = req.body;
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).send('User not found');
    user.games = (user.games || []).filter((id: any) => id.toString() !== gameId.toString());
    await user.save();
    res.status(200).send('Game removed from user');
  } catch (err) {
    res.status(500).send('Error removing game from user');
  }
});

export default router;
