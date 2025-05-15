<template>
  <div class="page">
    <TheNavigation>
      <template #after-logo>
        <button class="btn btn--icon btn--back" @click="$router.push('/')">
          <i class="fas fa-arrow-left"></i>
          <span class="mobile-hidden">Games</span>
        </button>
      </template>
      <template #after-settings>
        <button class="btn btn--icon btn--admin" @click="$router.push('/admin')">
          <i class="fas fa-cog"></i>
          <span class="mobile-hidden">Admin</span>
        </button>
      </template>
    </TheNavigation>
    <div v-if="sheetNotFound" class="error" style="padding:2rem; text-align:center; font-size:1.2rem;">Sheet not found.</div>
    <div class="controls">
      <div class="row center" v-if="!currentSheet">
        <button
          v-for="buttonSheet in [
            { name: 'crew', text: 'Crews' },
            { name: 'character', text: 'Characters' },
            { name: 'score', text: 'Score'},
            { name: 'world', text: 'World'}
          ]"
          class="btn btn--tab"
          :class="{
            active: sheetType === buttonSheet.name,
            //disabled: buttonSheet.disabled
          }"
          @click="sheetType = buttonSheet.name"
        >
          <span>{{ buttonSheet.text }}</span>
        </button>
      </div>

      <div class="row sheet-controls" v-else>
        <button class="btn btn--icon" @click="currentSheet = null">
          <i class="fas fa-arrow-left"></i>
          <span class="mobile-hidden">Back</span>
        </button>
        <h2 class="breadcrumbs">
          <span>
            <span>{{ currentSheet.sheetType }}</span>
            <span class="mobile-hidden">Sheets</span>
          </span>
          <i class="fas fa-angle-right"></i>
          <span>{{ currentSheet.name }}</span>
        </h2>
        <div class="row flat no-gap">
          <button class="btn btn--icon" @click="onClickNotes">
            <i class="fas fa-sticky-note"></i>
            <span class="mobile-hidden">Notes</span>
          </button>
          <button class="btn btn--icon" @click="onClickDeleteSheet">
            <i class="fas fa-trash"></i>
            <span class="mobile-hidden">Delete</span>
          </button>
        </div>
      </div>
      <div
        class="sheet-notes"
        v-if="currentSheet"
        :class="{ 'show-notes': showNotes }"
      >
        <textarea
          :value="currentSheet?.notes"
          @change="
            changeValue(($event.target as HTMLTextAreaElement)?.value, 'notes')
          "
          spellcheck="false"
        ></textarea>
        <button class="btn btn--text" @click="showNotes = false">Close</button>
      </div>
    </div>

    <div class="loading" v-if="isLoading">
      <i class="fas fa-circle-notch fa-spin"></i>
    </div>

    <div class="sheet-layout" v-else-if="currentSheet">
      <TheCrewSheet
        :sheet="(currentSheet as Crew)"
        v-if="currentSheet?.sheetType === 'crew'"
      />
      <TheCharacterSheet
        :sheet="(currentSheet as Character)"
        v-if="currentSheet?.sheetType === 'character'"
      />
      <TheScoreSheet
        :sheet="(currentSheet as Score)"
        v-if="currentSheet?.sheetType === 'score'"
      />
      <TheBookSheet
        :sheet="currentSheet as World"
        v-if="currentSheet?.sheetType === 'world' && (currentSheet as World)?.worldType === 'book'"
      />
      <TheIllustrationSheet
        :sheet="currentSheet as World"
        v-if="currentSheet?.sheetType === 'world' && (currentSheet as World)?.worldType === 'illustration'"
      />
    </div>

    <div class="sheet-select-layout" v-else>
      <ul class="sheet-list" v-if="sheetType === 'crew'">
        <li v-for="sheet in (crewSheets as Crew[])" :key="sheet.id">
          <SheetCard :sheet="sheet" @click="currentSheet = sheet" />
        </li>
        <li>
          <div class="new-sheet-card" @click="onClickNewSheet">
            <i class="fas fa-folder-plus"></i>
            <span>New {{ sheetType }}</span>
          </div>
        </li>
      </ul>

      <ul class="sheet-list" v-else-if="sheetType === 'character'">
        <li v-for="sheet in (characterSheets as Character[])" :key="sheet.id">
          <SheetCard :sheet="sheet" @click="currentSheet = sheet" />
        </li>
        <li>
          <div class="new-sheet-card" @click="onClickNewSheet">
            <i class="fas fa-folder-plus"></i>
            <span>New {{ sheetType }}</span>
          </div>
        </li>
      </ul>

      <ul class="sheet-list" v-else-if="sheetType === 'score'">
        <li v-for="sheet in (scoreSheets as Score[])" :key="sheet.id">
          <SheetCard :sheet="sheet" @click="currentSheet = sheet" />
        </li>
        <li>
          <div class="new-sheet-card" @click="onClickNewSheet">
            <i class="fas fa-folder-plus"></i>
            <span>New {{ sheetType }}</span>
          </div>
        </li>
      </ul>

      <ul class="sheet-list" v-else-if="sheetType === 'world'">
        <li v-for="sheet in (worldSheets as any[])" :key="sheet.id">
          <SheetCard :sheet="sheet" @click="currentSheet = sheet" />
        </li>
        <li>
          <div class="new-sheet-card" @click="onClickNewWorldSheet">
            <i class="fas fa-folder-plus"></i>
            <span>New World Sheet</span>
          </div>
        </li>
      </ul>

      <PlayerBar class="mobile-hidden" />
    </div>

    <div v-if="showWorldTypeModal" class="modal-overlay">
      <div class="modal world-type-modal">
        <h2>New World Sheet</h2>
        <div class="world-type-btns">
          <button class="btn btn--tab" @click="createWorldSheetAndClose('illustration')">
            <span>Illustration</span>
          </button>
          <button class="btn btn--tab" @click="createWorldSheetAndClose('book')">
            <span>Book</span>
          </button>
        </div>
        <button class="btn" @click="showWorldTypeModal = false">Cancel</button>
      </div>
    </div>

    <div class="model-overlay" v-if="showModelOverlay">
    <pre>{{ JSON.stringify(useGameStore().game, null, 2) }}</pre>
    <button class="btn debug btn" @click="showModelOverlay = false">
      Close
    </button>
  </div>
  </div>
</template>

<script setup lang="ts">
import SheetCard from '@/components/SheetCard.vue';
import PlayerBar from '@/components/game/PlayerBar.vue';
import ConfirmModal from '@/components/modals/modal-content/ConfirmModal.vue';
import SheetTemplatePickerModal from '@/components/modals/modal-content/SheetTemplatePickerModal.vue';
import { connectToGame, patch } from '@/controllers/game-controller';
import ModalController from '@/controllers/modal-controller';
import { Character } from '@/game-data/sheets/character-sheet';
import { Crew } from '@/game-data/sheets/crew-sheet';
import Sheet from '@/game-data/sheets/sheet';
import { createTemplates } from '@/game-data/sheets/sheet-util';
import { useGameStore } from '@/stores/game-store';
import mixpanel from 'mixpanel-browser';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import TheCharacterSheet from './sheets/TheCharacterSheet.vue';
import TheCrewSheet from './sheets/TheCrewSheet.vue';

import TheScoreSheet from './sheets/TheScoreSheet.vue';
import { Score } from '@/game-data/sheets/score-sheet';
import TheBookSheet from './sheets/TheBookSheet.vue';
import TheIllustrationSheet from './sheets/TheIllustrationSheet.vue';
import { World } from '@/game-data/sheets/world-sheet';
const route = useRoute();

const isLoading = computed(() => !useGameStore().game?.codex);

const sheetType = ref('character');
const sheets = computed(() => {
  return Object.values(useGameStore().game?.data?.sheets || []) as Sheet[];
});
const sheetTypeDescription = computed(() => {
  const sheetTypeDescriptions = {
    crew: "Your crew type determines the scores that you'll focus on, as well as a selection of special abilities that support that kind of action.",
    character: 'What kind of scoundrel are you? Each playbook has a unique set of special abilities and XP triggers to change how you play.',
    score: 'Scores represent scenarios, locations, or specific challenges within the game.' // Added description for score
  };
  return (
    sheetTypeDescriptions[
      sheetType.value as keyof typeof sheetTypeDescriptions
    ] || 'Choose a sheet type to get started.'
  );
});

const crewSheets = computed(() => {
  return sheets.value.filter((sheet) => sheet.sheetType === 'crew');
});

const characterSheets = computed(() => {
  return sheets.value.filter((sheet) => sheet.sheetType === 'character');
});

const scoreSheets = computed(() => {
  return sheets.value.filter((sheet) => sheet.sheetType === 'score');
});

const worldSheets = computed(() => {
  return sheets.value.filter((sheet) => sheet.sheetType === 'world');
});

const currentSheet = ref(null as Crew | Character | Score | World | null);

const showModelOverlay = ref(false);
const sheetNotFound = ref(false);
const showWorldTypeModal = ref(false);

onMounted(() => {
  const gameId = route.params.id as string || route.params.gameId as string;
  connectToGame(gameId);
  trySelectSheetFromRoute();
});

watch([
  () => route.fullPath,
  () => useGameStore().game?.data?.sheets
], () => {
  trySelectSheetFromRoute();
});

function trySelectSheetFromRoute() {
  const sheetId = route.params.sheetId as string;
  const game = useGameStore().game;
  if (sheetId) {
    if (game && game.data && game.data.sheets) {
      const sheets = game.data.sheets;
      const sheet = sheets && sheets[sheetId];
      if (sheet) {
        currentSheet.value = sheet;
        sheetType.value = sheet.sheetType;
        sheetNotFound.value = false;
      } else {
        currentSheet.value = null;
        sheetNotFound.value = true;
      }
    } else {
      currentSheet.value = null;
      sheetNotFound.value = false;
    }
  } else {
    currentSheet.value = null;
    sheetNotFound.value = false;
  }
}

const showNotes = ref(false);
function onClickNotes() {
  showNotes.value = !showNotes.value;
}

function changeValue(value: any, partialPath: string) {
  if (!currentSheet.value) return console.error('No current sheet');
  console.log('onChangeValue', value, partialPath);
  const path = `/data/sheets/${currentSheet.value.id}/${partialPath}`;
  patch([
    {
      op: 'replace',
      path,
      value
    }
  ]);
}

function onClickNewSheet() {
  ModalController.open(SheetTemplatePickerModal, {
    sheetType: sheetType.value,
    description: sheetTypeDescription.value,
    templateTypeKey: sheetType.value + 'Type',
    templates: createTemplates(sheetType.value), // This function needs to handle 'score'
    onConfirm: createNewSheet
  });
}

function createNewSheet(sheetType: string, sheet: Sheet) {
  if (!sheet) return console.error('Sheet not found');

  mixpanel.track('Create Sheet', {
    sheetType,
    sheetId: sheet.id
  });

  if (!useGameStore().game?.data?.sheets) {
    // If there's no data yet, create an empty object for sheets
    patch([
      {
        op: 'replace',
        path: '/data',
        value: { sheets: { [sheet.id]: sheet } }
      }
    ]);
  } else {
    patch([
      {
        op: 'add',
        path: `/data/sheets/${sheet.id}`,
        value: sheet
      }
    ]);
  }
}

function onClickDeleteSheet() {
  if (!currentSheet.value) return;

  ModalController.open(ConfirmModal, {
    title: 'Delete Sheet',
    message: `Are you sure you want to delete <em>${currentSheet.value.name}</em> ${currentSheet.value.sheetType} sheet?`,
    confirmText: 'Yes, delete it',
    onConfirm: () => {
      patch([
        {
          op: 'remove',
          path: `/data/sheets/${currentSheet.value?.id}`
        }
      ]);

      currentSheet.value = null;
      ModalController.close();
    }
  });
}

function onClickNewWorldSheet() {
  showWorldTypeModal.value = true;
}

function createWorldSheetAndClose(type: 'book' | 'illustration') {
  showWorldTypeModal.value = false;
  createNewWorldSheet(type);
}

function createNewWorldSheet(type: 'book' | 'illustration') {
  // Create a new World sheet with the chosen type
  const newSheet = new World();
  newSheet.worldType = type;
  newSheet.name = '';
  // Add to game store (patch or mutation as appropriate)
  patch([
    {
      op: 'add',
      path: `/data/sheets/${newSheet.id}`,
      value: newSheet,
    },
  ]);
  currentSheet.value = newSheet;
}
</script>

<style scoped lang="scss">
.page {
  gap: 0;
}

.sheet-notes {
  position: absolute;
  z-index: -1;
  overflow: hidden;
  left: 0;
  top: 100%;
  width: 100%;
  height: 24rem;
  padding: 1rem;
  padding-top: 0 !important;
  background-color: var(--dark);
  box-shadow: none;
  transition: transform 0.3s;
  transform: translateY(-100%);
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: center;

  > textarea {
    flex: 1;
    max-height: 100%;
  }

  &.show-notes {
    transform: translateY(0);
    box-shadow: var(--shadow);
  }
}

.sheet-select-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;

  > .player-bar {
    margin: 0 auto 1.2rem auto;
  }
}

.model-overlay {
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;

  background-color: var(--translucent-heavy);
  backdrop-filter: blur(0.4rem);

  > pre {
    background: none;
    flex: 1;
    overflow: auto;
  }
}

button.debug {
  position: fixed;
  z-index: 99;
  left: 50%;
  top: 0.8rem;
  transform: translateX(-50%);
}

.controls {
  padding: 1rem;
  box-shadow: var(--shadow);
  width: 100%;
  position: relative;

  button.btn.btn--tab {
    text-transform: capitalize;
  }
}

ul.sheet-list {
  animation: slideDown 0.3s;

  padding: 1rem;
  margin: 0;
  display: grid;
  width: 100%;
  flex: 1;
  align-content: start;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(24rem, 1fr));
  overflow-y: auto;

  > li {
    cursor: pointer;

    &:hover {
      filter: brightness(1.1);
    }
  }
}

.new-sheet-card {
  border: 1px solid var(--primary);
  color: var(--primary);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 16rem;
  gap: 1rem;
  border-radius: 5px;
  background-color: var(--translucent-light);
  box-shadow: var(--shadow);
  transition: background-color 0.3s;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  > span {
    font-size: 1rem;
  }
}

.sheet-layout {
  width: 100%;
  background: var(--translucent-light);
  flex: 1;
  overflow: hidden;
  animation: slideDown 0.3s;
  z-index: 0;
}

.controls {
  width: 100%;
  padding: 0;

  > div {
    animation: fade 0.2s;
    padding: 1rem;
    &.sheet-controls {
      justify-content: space-between;
      background-color: var(--dark);
    }
  }
  background: var(--dark);
  z-index: 1;
}

h2.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--translucent-light);
  padding: 0.8rem 1.6rem;
  border-radius: 99px;
  text-transform: capitalize;
  max-width: 100%;
  overflow: hidden;

  > span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:first-of-type {
      display: flex;
      gap: 0.4rem;
    }

    &:last-of-type {
      flex: 1;
    }
  }

  > span:last-of-type {
    font-style: italic;
  }

  > i {
    font-size: 1.2rem;
  }
}

.loading {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  > i {
    font-size: 2.4rem;
    color: var(--primary);
  }
}

@media (max-width: 768px) {
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal.world-type-modal {
  background: #fff;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  border-radius: 12px;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  background-image: url('/images/parchment-default.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
}
.modal.world-type-modal > * {
  position: relative;
  z-index: 1;
}
.modal.world-type-modal::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.7);
  border-radius: 12px;
  z-index: 0;
}
.world-type-btns {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}
.world-type-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  background: #f7f7f7;
  border: 2px solid #ccc;
  border-radius: 10px;
  padding: 1.2rem 2.2rem;
  cursor: pointer;
  transition: border 0.2s, background 0.2s;
}
.world-type-btn:hover {
  border: 2px solid #1976d2;
  background: #e3eaff;
}
</style>
