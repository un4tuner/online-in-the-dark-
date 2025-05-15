import mixpanel from 'mixpanel-browser';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import { initializeConnection, fetchAccessToken } from './api/connection';
import Divider from './components/Divider.vue';
import { router } from './router';
import { useTokenStore } from './stores/token-store';

(async () => {
  initializeConnection();

  const app = createApp(App);
  const pinia = createPinia();
  app.use(pinia);
  app.use(router);

  const tokenStore = useTokenStore();
  if (tokenStore.refreshToken && !tokenStore.accessToken) {
    await fetchAccessToken();
  }

  app.component('Divider', Divider);
  app.mount('#app');

  mixpanel.init('b370d90f461a2cd3c5d8f4bbd4e8907b');
  if (window.location.hostname !== 'localhost') {
    console.warn('Mixpanel tracked the page load!');
    mixpanel.track('Page Load');
  } else {
    console.warn('Accessing from localhost; Mixpanel is disabled.');
  }
})();
