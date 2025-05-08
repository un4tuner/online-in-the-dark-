<template>
  <div class="game-tabs">
    <ul>
      <li v-for="sheet in sheets" :key="sheet">
        <button
          class="btn btn--tab"
          :class="{ active: currentSheet === sheet }"
          @click="currentSheet = sheet"
        >
          {{ sheet }}
        </button>
      </li>
      <li class="game-options">
        <button class="btn btn--icon" @click="onClickGameOptions">
          <i class="fas fa-cog"></i>
        </button>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import ModalController from '@/controllers/modal-controller';
import { ref } from 'vue';
import GameOptions from '../modals/modal-content/GameOptionsModal.vue';

const currentSheet = ref('Playbooks');
const sheets = ['Playbooks', 'Crew', 'World']; // TODO get this from JSON from the game state

function onClickGameOptions() {
  ModalController.open(GameOptions);
}
</script>
<style scoped lang="scss">
.game-tabs {
  padding: 0.8rem;
  background-color: var(--translucent-light);

  > ul {
    display: flex;

    gap: 1rem;
  }
}

.game-options {
  margin-left: auto;
}
</style>
