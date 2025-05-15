<template>
  <div class="admin-panel">
    <h1>Admin Panel</h1>
    <section>
      <h2 @click="toggleSection('users')" class="collapsible">User Management <span>{{ sectionOpen.users ? '▼' : '►' }}</span></h2>
      <div v-if="sectionOpen.users">
        <div v-if="loading">Loading users...</div>
        <div v-if="error" class="error">{{ error }}</div>
        <div v-if="success" class="success">{{ success }}</div>
        <div v-if="!users.length" class="warning">No users found. Make sure users have a <code>role</code> field in the database.</div>
        <div class="user-table-wrapper" v-if="users.length">
          <table class="user-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Games</th>
                <th>Actions</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user._id">
                <td>{{ user.username }}</td>
                <td>
                  <select :value="user.role" @change="changeRole(user, $event)" :class="roleClass(user.role)">
                    <option value="superuser" class="role-superuser">Admin</option>
                    <option value="master" class="role-master">Master</option>
                    <option value="player" class="role-player">Player</option>
                  </select>
                </td>
                <td>
                  <template v-if="user.games && user.games.length">
                    <span v-for="gameId in user.games" :key="gameId">
                      <template v-if="gameMap[gameId]">
                        <a :href="`/game/${gameId}`" target="_blank">{{ gameMap[gameId] }}</a>
                        <button class="remove-master-btn" @click="removeGameFromUser(user, gameId)">×</button>
                        <span v-if="!isLastGame(user.games, gameId)">, </span>
                      </template>
                      <template v-else>
                        {{ gameId }}
                        <button class="remove-master-btn" @click="removeGameFromUser(user, gameId)">×</button>
                        <span v-if="!isLastGame(user.games, gameId)">, </span>
                      </template>
                    </span>
                  </template>
                  <span v-else>-</span>
                </td>
                <td>
                  <button @click="resetPassword(user)">Reset Password</button>
                </td>
                <td>
                  <button class="delete-btn" @click="deleteUser(user)">✗</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <section>
      <h2 @click="toggleSection('gms')" class="collapsible">GM Management <span>{{ sectionOpen.gms ? '▼' : '►' }}</span></h2>
      <div v-if="sectionOpen.gms">
        <div v-if="!games.length" class="warning">No games found.</div>
        <div class="note">GMs are users who can run the game. The creator is always a GM. Admins can add/remove GMs.</div>
        <div class="user-table-wrapper" v-if="games.length">
          <table class="user-table">
            <thead>
              <tr>
                <th>Game</th>
                <th>GMs</th>
                <th>Players</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="game in games" :key="game._id">
                <td><a :href="`/game/${game._id}`" target="_blank">{{ game.name }}</a></td>
                <td>
                  <span v-if="game.gms && game.gms.length">
                    <span v-for="gmId in game.gms" :key="gmId" class="master-chip">
                      {{ masterName(gmId) }}
                      <button class="remove-master-btn" @click="removeGM(game, gmId)">×</button>
                    </span>
                  </span>
                  <span v-else>-</span>
                </td>
                <td colspan="3">
                  <table class="player-table">
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="user in users.filter(u => (game.players && game.players[u._id]) || (game.gms && game.gms.includes(u._id)))" :key="'user-' + user._id">
                        <td>{{ user.username }}</td>
                        <td>
                          <span v-if="game.gms && game.gms.includes(user._id)">GM</span>
                          <span v-else>Player</span>
                        </td>
                        <td>
                          <div class="action-btn-row">
                            <button v-if="game.players && game.players[user._id]" class="delete-btn" title="Remove from Game" @click="removePlayerEverywhere(game, user._id)">✗</button>
                            <button v-if="game.gms && game.gms.includes(user._id)" class="remove-master-btn" @click="removeGM(game, user._id)">Remove as GM</button>
                            <button v-else-if="game.players && game.players[user._id]" class="remove-master-btn" @click="addGM(game, user._id)">Add as GM</button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  <div class="action-btn-row">
                    <select v-model="selectedMaster[game._id]">
                      <option disabled value="">Select user</option>
                      <option v-for="user in usersNotInGMs(game)" :key="user._id" :value="user._id">{{ user.username }}</option>
                    </select>
                    <button @click="confirmAddGM(game)">Add</button>
                  </div>
                </td>
                <td>
                  <button class="delete-btn" @click="deleteGame(game)">✖</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <section>
      <h2>Games</h2>
      <div v-if="!games.length" class="warning">No games found.</div>
      <div class="user-table-wrapper" v-if="games.length">
        <table class="user-table">
          <thead>
            <tr>
              <th>Game Name</th>
              <th>GMs</th>
              <th>Crews</th>
              <th>Characters</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="game in games" :key="game._id">
              <td><a :href="`/game/${game._id}`" target="_blank">{{ game.name }}</a></td>
              <td>
                <span v-if="game.gms && game.gms.length">
                  <span v-for="(gmId, idx) in game.gms" :key="gmId">
                    {{ (users.find(u => u._id === gmId) || { username: gmId }).username }}<span v-if="idx < game.gms.length - 1">, </span>
                  </span>
                </span>
                <span v-else>-</span>
              </td>
              <td>
                <div v-if="game.data && game.data.sheets">
                  <div v-for="crew in Object.values(game.data.sheets).filter(s => (s as any).sheetType === 'crew') as any[]" :key="crew.id || crew._id" style="margin-bottom: 0.2rem;">
                    <a :href="`/game/${game._id}/crew/${crew.id || crew._id}`" target="_blank">{{ crew.name }} ({{ crew.crewType || crew.type || crew.playbook }})</a>
                  </div>
                </div>
                <span v-else>-</span>
              </td>
              <td>
                <div v-if="game.data && game.data.sheets">
                  <div v-for="char in Object.values(game.data.sheets).filter(s => (s as any).sheetType === 'character') as any[]" :key="char.id || char._id" style="margin-bottom: 0.2rem;">
                    <a :href="`/game/${game._id}/character/${char.id || char._id}`" target="_blank">
                      {{ char.name }}<span v-if="char.alias"> '{{ char.alias }}'</span> ({{ char.characterType || char.playbook }})
                    </a>
                  </div>
                </div>
                <span v-else>-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <section>
      <h2>Images</h2>
      <div>
        <input type="file" accept=".jpg,.jpeg,.png" @change="onImageFileChange" />
        <button class="highlight-btn" @click="uploadImage" :disabled="!imageFile">Upload Image</button>
        <span v-if="imageUploadProgress">Uploading...</span>
        <div v-if="imageUploadError" class="error">{{ imageUploadError }}</div>
        <div v-if="imageUploadSuccess" class="success">{{ imageUploadSuccess }}</div>
        <div v-if="imagesList.length">
          <div class="files-list">
            <h4>Uploaded Images</h4>
            <ul>
              <li v-for="img in imagesList" :key="img">
                <a class="file-link" :href="`/images/${img}`" target="_blank">{{ img }}</a>
                <button class="delete-btn" @click="deleteImage(img)">✗</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <section>
      <h2>Books</h2>
      <div>
        <input type="file" accept=".pdf,.txt,.md" @change="onBookFileChange" />
        <button class="highlight-btn" @click="uploadBook" :disabled="!bookFile">Upload Book</button>
        <span v-if="bookUploadProgress">Uploading...</span>
        <div v-if="bookUploadError" class="error">{{ bookUploadError }}</div>
        <div v-if="bookUploadSuccess" class="success">{{ bookUploadSuccess }}</div>
        <div v-if="booksList.length">
          <div class="files-list">
            <h4>Uploaded Books</h4>
            <ul>
              <li v-for="book in booksList" :key="book">
                <a class="file-link" :href="`/books/${book}`" target="_blank">{{ book }}</a>
                <button class="delete-btn" @click="deleteBook(book)">✗</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { server } from '@/api/connection';
import { resolveImageUrl } from '@/util/resolveImageUrl';

const users = ref<any[]>([]);
const games = ref<any[]>([]);
const gameMap = ref<Record<string, string>>({});
const loading = ref(false);
const error = ref('');
const success = ref('');
const sectionOpen = ref<Record<string, boolean>>({ users: true, gms: true });
const selectedMaster = ref<Record<string, string>>({});

const imageFile = ref<File|null>(null);
const imageUploadProgress = ref(false);
const imageUploadError = ref('');
const imageUploadSuccess = ref('');
const imagesList = ref<string[]>([]);

const bookFile = ref<File|null>(null);
const bookUploadProgress = ref(false);
const bookUploadError = ref('');
const bookUploadSuccess = ref('');
const booksList = ref<string[]>([]);

function toggleSection(section: string) {
  sectionOpen.value[section] = !sectionOpen.value[section];
}

function isLastGame(gameList: string[], gameId: string | number) {
  return gameList[gameList.length - 1] === String(gameId);
}

function roleClass(role: string) {
  return {
    'role-superuser': role === 'superuser',
    'role-master': role === 'master',
    'role-player': role === 'player',
  };
}

async function fetchUsers() {
  loading.value = true;
  error.value = '';
  success.value = '';
  try {
    const res = await server.get('/user/all-admin');
    users.value = res.data;
  } catch (e: any) {
    error.value = 'Failed to load users: ' + (e && e.response && e.response.data ? e.response.data : e.message || e.toString());
  } finally {
    loading.value = false;
  }
}

async function fetchGames() {
  try {
    const res = await server.get('/game/all');
    console.log('Fetched games:', res.data); // Debug log
    // If the response is { games: [...] }, use res.data.games
    if (Array.isArray(res.data)) {
      games.value = res.data;
      gameMap.value = {};
      for (const game of res.data) {
        gameMap.value[game._id] = game.name;
      }
    } else if (res.data.games && Array.isArray(res.data.games)) {
      games.value = res.data.games;
      gameMap.value = {};
      for (const game of res.data.games) {
        gameMap.value[game._id] = game.name;
      }
    } else {
      games.value = [];
      gameMap.value = {};
    }
  } catch (e: any) {
    // ignore for now
  }
}

async function changeRole(user: any, event: Event) {
  const role = (event.target as HTMLSelectElement).value;
  error.value = '';
  success.value = '';
  try {
    await server.post('/user/promote-user', { userId: user._id, role });
    success.value = `User ${user.username} role changed to ${role}`;
    fetchUsers();
  } catch (e: any) {
    error.value = 'Failed to update user: ' + (e && e.response && e.response.data ? e.response.data : e.message || e.toString());
  }
}

async function resetPassword(user: any) {
  const newPassword = prompt(`Enter new password for ${user.username}:`);
  if (!newPassword) return;
  error.value = '';
  success.value = '';
  try {
    await server.post('/user/reset-password', { userId: user._id, newPassword });
    success.value = `Password reset for ${user.username}`;
  } catch (e: any) {
    error.value = 'Failed to reset password: ' + (e && e.response && e.response.data ? e.response.data : e.message || e.toString());
  }
}

function masterName(masterId: string) {
  const user = users.value.find(u => u._id === masterId);
  return user ? user.username : '';
}

function usersNotInGMs(game: any) {
  return users.value.filter(u => !(game.gms || []).includes(u._id));
}

function confirmAddGM(game: any) {
  const gmId = selectedMaster.value[game._id];
  if (!gmId) return;
  const user = users.value.find(u => u._id === gmId);
  if (!user) return;
  if (confirm(`Add ${user.username} as a GM to game ${game.name}?`)) {
    addGM(game, gmId);
  }
}

async function addGM(game: any, userId: string) {
  error.value = '';
  success.value = '';
  try {
    await server.post('/game/add-gm', { gameId: game._id, gmId: userId });
    success.value = `Added GM to game ${game.name}`;
    selectedMaster.value[game._id] = '';
    fetchGames();
  } catch (e: any) {
    error.value = 'Failed to add GM: ' + (e && e.response && e.response.data ? e.response.data : e.message || e.toString());
  }
}

async function removeGM(game: any, userId: string) {
  error.value = '';
  success.value = '';
  const user = users.value.find(u => u._id === userId);
  if (!user) return;
  if (!confirm(`Remove ${user.username} as a GM from game ${game.name}?`)) return;
  try {
    await server.post('/game/remove-gm', { gameId: game._id, gmId: userId });
    success.value = `Removed GM from game ${game.name}`;
    fetchGames();
  } catch (e: any) {
    error.value = 'Failed to remove GM: ' + (e && e.response && e.response.data ? e.response.data : e.message || e.toString());
  }
}

async function removePlayerEverywhere(game: any, playerId: string) {
  const user = getUserById(playerId);
  const username = (user ? user.username : (game.players[playerId]?.username || playerId));
  if (!confirm(`Remove player '${username}' from game '${game.name}'? This will also remove the game from their user record if applicable.`)) return;
  error.value = '';
  success.value = '';
  try {
    await server.post(`/game/${game._id}/remove-player`, { playerId });
    if (user) {
      await server.post(`/user/${user._id}/remove-game`, { gameId: game._id });
    }
    success.value = `Player '${username}' removed from game '${game.name}'`;
    fetchGames();
    fetchUsers();
  } catch (e: any) {
    error.value = 'Failed to remove player: ' + (e && e.response && e.response.data ? e.response.data : e.message || e.toString());
  }
}

async function deleteUser(user: any) {
  if (!confirm(`Are you sure you want to delete user ${user.username}?`)) return;
  error.value = '';
  success.value = '';
  try {
    await server.delete(`/user/${user._id}`);
    success.value = `User ${user.username} deleted`;
    fetchUsers();
  } catch (e: any) {
    error.value = 'Failed to delete user: ' + (e && e.response && e.response.data ? e.response.data : e.message || e.toString());
  }
}

async function deleteGame(game: any) {
  if (!confirm(`Are you sure you want to delete game '${game.name}'? This cannot be undone.`)) return;
  error.value = '';
  success.value = '';
  try {
    await server.delete(`/game/${game._id}`);
    success.value = `Game '${game.name}' deleted`;
    fetchGames();
  } catch (e: any) {
    error.value = 'Failed to delete game: ' + (e && e.response && e.response.data ? e.response.data : e.message || e.toString());
  }
}

async function removeGameFromUser(user: any, gameId: string) {
  if (!user) return;
  if (!confirm(`Remove game '${gameMap.value[gameId] || gameId}' from user '${user.username}'?`)) return;
  error.value = '';
  success.value = '';
  try {
    await server.post(`/user/${user._id}/remove-game`, { gameId });
    success.value = `Game removed from user '${user.username}'`;
    fetchUsers();
  } catch (e: any) {
    error.value = 'Failed to remove game from user: ' + (e && e.response && e.response.data ? e.response.data : e.message || e.toString());
  }
}

function getUserById(id: string) {
  return users.value.find((u: any) => u._id === id);
}

function onImageFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  imageFile.value = files && files[0] ? files[0] : null;
}

async function uploadImage() {
  if (!imageFile.value) return;
  imageUploadProgress.value = true;
  imageUploadError.value = '';
  imageUploadSuccess.value = '';
  try {
    const formData = new FormData();
    formData.append('file', imageFile.value);
    const res = await server.post('/images/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    imageUploadSuccess.value = `Image uploaded: ${res.data.originalname}`;
    imageFile.value = null;
    // Update ledger
    await server.post('/images/ledger', {
      filename: res.data.filename,
      originalname: res.data.originalname,
      uploadedAt: new Date().toISOString()
    });
    fetchImagesList();
  } catch (e: any) {
    imageUploadError.value = 'Failed to upload image: ' + (e?.response?.data?.error || e.message || e.toString());
  } finally {
    imageUploadProgress.value = false;
  }
}

function onBookFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  bookFile.value = files && files[0] ? files[0] : null;
}

async function uploadBook() {
  if (!bookFile.value) return;
  bookUploadProgress.value = true;
  bookUploadError.value = '';
  bookUploadSuccess.value = '';
  try {
    const formData = new FormData();
    formData.append('file', bookFile.value);
    const res = await server.post('/books/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    bookUploadSuccess.value = `Book uploaded: ${res.data.originalname}`;
    bookFile.value = null;
    // Update ledger
    await server.post('/books/ledger', {
      filename: res.data.filename,
      originalname: res.data.originalname,
      uploadedAt: new Date().toISOString()
    });
    fetchBooksList();
  } catch (e: any) {
    bookUploadError.value = 'Failed to upload book: ' + (e?.response?.data?.error || e.message || e.toString());
  } finally {
    bookUploadProgress.value = false;
  }
}

async function fetchImagesList() {
  try {
    const res = await server.get('/images/list');
    imagesList.value = res.data.files || [];
  } catch {
    imagesList.value = [];
  }
}

async function fetchBooksList() {
  try {
    const res = await server.get('/books/list');
    booksList.value = res.data.files || [];
  } catch {
    booksList.value = [];
  }
}

async function deleteImage(img: string) {
  if (!confirm(`Delete image '${img}'? This cannot be undone.`)) return;
  imageUploadError.value = '';
  imageUploadSuccess.value = '';
  try {
    await server.delete(`/images/delete/${encodeURIComponent(img)}`);
    imageUploadSuccess.value = `Image deleted: ${img}`;
    fetchImagesList();
  } catch (e: any) {
    imageUploadError.value = 'Failed to delete image: ' + (e?.response?.data?.error || e.message || e.toString());
  }
}

async function deleteBook(book: string) {
  if (!confirm(`Delete book '${book}'? This cannot be undone.`)) return;
  bookUploadError.value = '';
  bookUploadSuccess.value = '';
  try {
    await server.delete(`/books/delete/${encodeURIComponent(book)}`);
    bookUploadSuccess.value = `Book deleted: ${book}`;
    fetchBooksList();
  } catch (e: any) {
    bookUploadError.value = 'Failed to delete book: ' + (e?.response?.data?.error || e.message || e.toString());
  }
}

onMounted(async () => {
  await fetchGames();
  await fetchUsers();
  fetchImagesList();
  fetchBooksList();
});
</script>

<style scoped>
.admin-panel {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  overflow-x: auto;
}
.user-table-wrapper {
  max-height: 400px;
  overflow-x: auto;
  overflow-y: auto;
}
.user-table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}
.user-table th, .user-table td {
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  text-align: left;
}
.user-table th {
  background: #f0f0f0;
}
button {
  margin-right: 0.5rem;
}
section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fafafa;
}
.placeholder {
  color: #888;
  font-style: italic;
  margin-top: 1rem;
}
.error {
  color: #b00;
  margin-bottom: 1rem;
}
.success {
  color: #080;
  margin-bottom: 1rem;
}
.warning {
  color: #b00;
  background: #fff3f3;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}
.note {
  color: #333;
  background: #e0e0ff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}
.collapsible {
  cursor: pointer;
  user-select: none;
}
.role-superuser {
  background: #ffe0e0;
  color: #b00;
}
.role-master {
  background: #e0e0ff;
  color: #0033b3;
}
.role-player {
  background: #e0ffe0;
  color: #008000;
}
.delete-btn {
  color: #fff;
  background: #d32f2f;
  border: none;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 0 0.7rem;
  border-radius: 50%;
  cursor: pointer;
  vertical-align: middle;
  margin-left: 0.5rem;
  transition: background 0.2s;
}
.delete-btn:hover {
  background: #b71c1c;
}
.master-chip {
  display: inline-block;
  background: #e0e0ff;
  color: #0033b3;
  border-radius: 12px;
  padding: 0.2rem 0.7rem 0.2rem 0.7rem;
  margin-right: 0.5rem;
  margin-bottom: 0.2rem;
}
.remove-master-btn {
  background: none;
  border: none;
  color: #b00;
  font-size: 1.1rem;
  font-weight: bold;
  margin-left: 0.3rem;
  cursor: pointer;
}
.remove-master-btn:hover {
  color: #fff;
  background: #b00;
  border-radius: 50%;
}
.player-table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}
.player-table th, .player-table td {
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  text-align: left;
}
.player-table th {
  background: #f0f0f0;
}
.action-btn-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.user-table td, .player-table td {
  vertical-align: middle;
}
.delete-btn, .remove-master-btn {
  vertical-align: middle;
  margin: 0;
  padding: 0.2rem 0.6rem;
  line-height: 1.2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Highlighted upload buttons */
.highlight-btn {
  background: #1976d2;
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1.2rem;
  margin-left: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}
.highlight-btn:disabled {
  background: #b0b0b0;
  color: #fff;
  cursor: not-allowed;
}

/* Files list styling */
.files-list {
  border: 1px solid #bbb;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 1rem;
  background: #f9f9f9;
}
.files-list h4 {
  margin-top: 0;
  margin-bottom: 0.7rem;
}
.files-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.files-list li {
  margin-bottom: 0.4rem;
}
.file-link {
  color: #1976d2;
  font-weight: 500;
  text-decoration: underline;
  transition: color 0.2s;
}
.file-link:hover {
  color: #0d47a1;
}
</style> 