<template>
  <nav>
    <div class="logo">
      <router-link to="/">
        <Logo />
      </router-link>
    </div>
    <div class="account">
      <button
        class="btn btn--icon game-options"
        @click="onClickGameOptions"
        v-if="useGameStore().game?._id"
      >
        <i class="fas fa-cog"></i>
      </button>
      <button class="btn btn--icon admin-panel" @click="$router.push('/admin')">
        <i class="fas fa-user-shield"></i>
      </button>
      <button class="btn btn--account" @click="onClickAccount">
        <Portrait :portraitId="useUserStore().portrait" />
        <span>{{ useUserStore().username || 'Account' }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import AccountModal from '@/components/modals/modal-content/AccountModal.vue';
import ModalController from '@/controllers/modal-controller';
import { useUserStore } from '@/stores/user-store';
import Logo from './Logo.vue';
import Portrait from './Portrait.vue';
import GameOptions from './modals/modal-content/GameOptionsModal.vue';
import { useGameStore } from '@/stores/game-store';

function onClickAccount() {
  ModalController.open(AccountModal);
}

function onClickGameOptions() {
  ModalController.open(GameOptions);
}
</script>

<style lang="scss" scoped>
nav {
  position: relative;
  background-color: var(--dark);
  border-bottom: 1px solid var(--dark-2);
  color: var(--light);
  display: flex;
  gap: 0.8rem;
  min-height: 5.2rem;
  height: 5.2rem;
  align-items: center;

  > div {
    position: absolute;
    padding: 0 0.8rem;
  }

  .account {
    display: flex;
    right: 0;
  }
}

button.btn.btn--account {
  background-color: var(--translucent-light);
  color: var(--primary);
  padding-left: 0.6rem;

  > .portrait {
    border-radius: 3px;
    height: calc(100% - 1.2rem);
  }

  &::after {
    content: none;
  }

  > span {
    font-size: 1.2rem;
  }
}

button.btn.admin-panel {
  margin-left: 0.5rem;
  color: var(--primary);
  background: var(--translucent-light);
}

@media (max-width: 768px) {
  .account {
    padding: 0;
  }

  button.btn.btn--account {
    background-color: transparent;
    > span {
      display: none;
    }

    &::after {
      content: none;
    }
  }
}
</style>
