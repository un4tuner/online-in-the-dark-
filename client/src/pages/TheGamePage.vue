<template>
  <div class="page">
    <div class="controls">
      <div class="row center" v-if="!currentSheet">
        <button
          v-for="buttonSheet in [
            { name: 'crew', text: 'Crews' },
            { name: 'character', text: 'Characters' },
            { name: 'score', text: 'Score'}
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

      <PlayerBar class="mobile-hidden" />
    </div>


  </div>

    <div class="model-overlay" v-if="showModelOverlay">
    <pre>{{ JSON.stringify(useGameStore().game, null, 2) }}</pre>
    <button class="btn debug btn" @click="showModelOverlay = false">
      Close
    </button>
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
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import TheCharacterSheet from './sheets/TheCharacterSheet.vue';
import TheCrewSheet from './sheets/TheCrewSheet.vue';

import TheScoreSheet from './sheets/TheScoreSheet.vue';
import { Score } from '@/game-data/sheets/score-sheet';
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

const currentSheet = ref(null as Crew | Character | Score | null);

const showModelOverlay = ref(false);

onMounted(() => {
  const gameId = route.params.id as string;
  connectToGame(gameId);
});

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
</style>
