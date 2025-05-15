import { createGuestAccount, fetchMyAccount } from '@/api/account';
import { fetchAccessToken } from '@/api/connection';
import LoadingModal from '@/components/modals/modal-content/LoadingModal.vue';
import { disconnectFromGame } from '@/controllers/game-controller';
import ModalController from '@/controllers/modal-controller';
import TheHomePage from '@/pages/TheHomePage.vue';
import TheInvitePage from '@/pages/TheInvitePage.vue';
import TheLostPage from '@/pages/TheLostPage.vue';
import { useTokenStore } from '@/stores/token-store';
import { useUserStore } from '@/stores/user-store';
import { ref } from 'vue';
import { RouterOptions, createRouter, createWebHistory } from 'vue-router';
import TheGamePage from '../pages/TheGamePage.vue';
import AdminPanel from '@/pages/AdminPanel.vue';

export const currentPageName = ref();
export enum PageName {
  HOME = 'home',
  GAMES = 'games',
  GAME = 'game',
  INVITE = 'invite',
  SETTINGS = 'settings',
  LOST = 'lost'
}

const routes = [
  {
    path: '/',
    components: {
      page: TheHomePage
    },
    name: PageName.HOME
  },
  {
    path: '/game/:id',
    components: {
      page: TheGamePage
    },
    name: PageName.GAME
  },
  {
    path: '/game/:gameId/character/:sheetId',
    components: {
      page: TheGamePage
    },
    name: 'game-character-sheet'
  },
  {
    path: '/game/:gameId/crew/:sheetId',
    components: {
      page: TheGamePage
    },
    name: 'game-crew-sheet'
  },
  {
    path: '/invite/:code',
    components: {
      page: TheInvitePage
    },
    name: PageName.INVITE
  },
  {
    path: '/admin',
    components: {
      page: AdminPanel
    },
    name: 'admin'
  },
  {
    path: '/:pathMatch(.*)*',
    components: {
      page: TheLostPage // 404 page
    },
    name: PageName.LOST
  }
];

const routerOptions = {
  history: createWebHistory(),
  routes
};

export const router = createRouter(routerOptions as RouterOptions);

router.afterEach(async (to, from) => {});

router.beforeEach(async (to, from, next) => {
  disconnectFromGame();

  ModalController.open(LoadingModal, { backgroundClass: 'opaque' });

  if (useTokenStore().refreshToken && !useTokenStore().accessToken)
    await fetchAccessToken();

  if (!useUserStore().id) {
    console.log('@index.ts: fetchMyAccount() because no user id');
    await fetchMyAccount();
  }

  if (!useTokenStore().refreshToken || !useUserStore().id)
    await createGuestAccount(); // Create a guest account

  ModalController.close();

  // Protect /admin route for superuser only
  if (to.path === '/admin') {
    const userStore = useUserStore();
    if (userStore.username !== 'Administrator') {
      return next({ path: '/' });
    }
  }

  currentPageName.value = to.name;

  next();
});
