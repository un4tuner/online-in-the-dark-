<template>
  <div class="sheet-layout">
    <div class="score-sheet-layout">
      <ScoreBasicInfoSection
        v-model="basicInfo"
        :crews="crewSheets"
        @validation="onValidation"
      />
      <!-- Additional Text Sections -->
      <div class="additional-text-section">
        <div class="additional-text-row">
          <div
            v-for="(section, idx) in additionalSections"
            :key="idx"
            class="additional-text-card"
          >
            <input
              v-model="section.header"
              class="additional-header-input"
              placeholder="Header"
              maxlength="32"
            />
            <textarea
              v-model="section.text"
              class="additional-main-text"
              placeholder="Main text"
              maxlength="180"
              rows="2"
            ></textarea>
            <button class="btn btn--icon remove-btn" @click="removeSection(idx)"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        <button class="btn add-section-btn" @click="addSection" v-if="additionalSections.length < 8">
          <i class="fas fa-plus"></i> Add Section
        </button>
      </div>
      <ScoreClocksSection
        v-model="clocks"
        :score-id="props.sheet.id"
        @add="onAddClock"
        @edit="onEditClock"
        @remove="onRemoveClock"
        @value="onValueClock"
      />
      <!-- Score type and tier display at the bottom -->
      <div
        v-if="basicInfo.scoreType"
        class="score-type-tier-bar"
        :style="scoreTypeTierBarStyle"
      >
        <span class="score-type-label">{{ basicInfo.scoreType }}</span>
        <span class="score-tier-label">Tier {{ basicInfo.tierLevel }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InfoBox from '@/components/InfoBox.vue';
import ScoreBasicInfoSection from '@/components/ScoreBasicInfoSection.vue';
import ScoreClocksSection from '@/components/ScoreClocksSection.vue';
import { patch } from '@/controllers/game-controller';
import { Score } from '@/game-data/sheets/score-sheet';
import { Clock } from '@/game-data/game-data-types';
import { ref, watch, computed, reactive } from 'vue';
import { useGameStore } from '@/stores/game-store';
import resolveImageUrl from '@/util/resolveImageUrl';

const props = defineProps<{
  sheet: Score;
}>();

const crewSheets = computed(() => {
  return (
    Object.values(useGameStore().game?.data?.sheets || []) as any[]
  ).filter((sheet) => sheet.sheetType === 'crew');
});

const basicInfo = ref({
  name: props.sheet.name,
  tierLevel: props.sheet.tierLevel ?? 0,
  crewId: props.sheet.crewId ?? null,
  scoreDescription: props.sheet.scoreDescription,
  scoreNotes: props.sheet.scoreNotes,
  scoreType: props.sheet.scoreType ?? '',
  image: props.sheet.image,
});

const clocks = ref<Clock[]>([...props.sheet.clocks]);

interface AdditionalSection {
  header: string;
  text: string;
}

const additionalSections = ref<AdditionalSection[]>(props.sheet.additionalSections ? [...props.sheet.additionalSections] : []);

let additionalSectionsDebounce: ReturnType<typeof setTimeout> | null = null;

watch(
  additionalSections,
  (val) => {
    if (additionalSectionsDebounce) clearTimeout(additionalSectionsDebounce);
    additionalSectionsDebounce = setTimeout(() => {
      patch([
        {
          op: 'replace',
          path: `/data/sheets/${props.sheet.id}/additionalSections`,
          value: val,
        },
      ]);
    }, 600);
  },
  { deep: true }
);

function onValidation(errors: Record<string, string>) {
  // Optionally handle validation errors (e.g., disable save, show error summary)
}

// Sync basicInfo with props.sheet when the sheet changes
watch(
  () => props.sheet,
  (newSheet) => {
    basicInfo.value = {
      name: newSheet.name,
      tierLevel: newSheet.tierLevel ?? 0,
      crewId: newSheet.crewId ?? null,
      scoreDescription: newSheet.scoreDescription,
      scoreNotes: newSheet.scoreNotes,
      scoreType: newSheet.scoreType ?? '',
      image: newSheet.image,
    };
    clocks.value = [...newSheet.clocks];
  },
  { deep: true }
);

const basicInfoKeys = [
  'name',
  'tierLevel',
  'crewId',
  'scoreDescription',
  'scoreNotes',
  'scoreType',
] as const;

watch(
  () => basicInfo.value,
  (val) => {
    for (const key of basicInfoKeys) {
      if (val[key] !== (props.sheet as any)[key]) {
        console.log('PATCH', key, val[key]);
        patch([
          {
            op: 'replace',
            path: `/data/sheets/${props.sheet.id}/${key}`,
            value: val[key],
          },
        ]);
      }
    }
  },
  { deep: true }
);

watch(
  () => basicInfo.value.image,
  (newImage) => {
    if (props.sheet.image !== newImage) {
      patch([
        {
          op: 'replace',
          path: `/data/sheets/${props.sheet.id}/image`,
          value: newImage,
        },
      ]);
      props.sheet.image = newImage;
    }
  }
);

function onAddClock(clock: Clock) {}
function onEditClock(idx: number, clock: Clock) {}
function onRemoveClock(idx: number) {}
function onValueClock(idx: number, value: number) {}

function addSection() {
  additionalSections.value.push({ header: '', text: '' });
}
function removeSection(idx: number) {
  additionalSections.value.splice(idx, 1);
}

const scoreTypeColors: Record<string, string> = {
  Heist: '#1a237e',
  Assassination: '#b71c1c',
  Murder: '#b71c1c',
  Whackjob: '#b71c1c',
  Smuggling: '#4e342e',
  Extortion: '#37474f',
  Sabotage: '#263238',
  Acquisition: '#00695c',
  Espionage: '#283593',
  Destroy: '#212121',
  Raid: '#1565c0',
  Ransom: '#6d4c41',
  Socialize: '#6f5e55',
  Surveillance: '#00838f',
  Delivery: '#558b2f',
};
const defaultScoreColor = '#222';
const scoreTypeTierBarStyle = computed(() => {
  const color = scoreTypeColors[basicInfo.value.scoreType] || defaultScoreColor;
  return { backgroundColor: color, color: '#fff' };
});
</script>

<style scoped lang="scss">
:root {
  --sheet-bg: #181a20;
  --card-bg: #23262f;
  --primary: #f3f6fb;
  --accent: #c66a00;
  --danger: #ff4d4f;
  --dark-2: #23262f;
  --dark-3: #1a1c23;
  --shadow: 0 2px 16px rgba(0,0,0,0.18);
}
.sheet-layout {
  justify-content: center;
  align-items: flex-start;
  height: 100vh;
  width: 100vw;
  overflow: scroll;
  background: var(--dark-3);
}
.score-sheet-layout {
  width: 100%;
  height: 100vh;
  background: var(--sheet-bg);
  border-radius: 14px;
  box-shadow: var(--shadow);
  padding: 2.5rem 2.5rem 2.5rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow-y: scroll;
}
@media (max-width: 700px) {
  .score-sheet-layout {
    padding: 1.2rem 0.5rem;
    height: 100dvh;
  }
  .sheet-layout {
    padding: 0;
  }
}
.sheet-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #333;
  border-radius: 7px;
  background: var(--card-bg);
  color: var(--primary);
}
.score-type-tier-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 1rem 2rem;
  border-radius: 0 0 12px 12px;
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 1.5px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.18);
  background: var(--accent);
  color: #fff;
}
.score-type-label {
  color: #412626;
}
.score-tier-label {
  color: #fff;
}
.additional-text-section {
  margin: 2rem 0 2rem 0;
  display: flex;
  border-radius: 7px;
  border: 1px solid #333;
  flex-direction: column;
  align-items: stretch;
  overflow-x: auto;
}
.additional-text-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1rem;
  width: 100%;
}
.additional-text-card {
  background: var(--card-bg);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(116, 114, 114, 0.18);
  padding: 1rem 1.2rem 0.5rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  color: var(--primary);
  min-width: 0;
  word-break: break-word;
}
.additional-header-input {
  font-weight: bold;
  font-size: 1.1rem;
  border: none;
  background: transparent;
  outline: none;
  margin-bottom: 0.2rem;
  color: var(--accent);
}
.additional-main-text {
  border: none;
  background: transparent;
  resize: none;
  font-size: 1rem;
  outline: none;
  color: var(--primary);
}
.remove-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  color: var(--danger);
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  transition: color 0.2s;
}
.remove-btn:hover {
  color: #fff;
  background: var(--danger);
  border-radius: 50%;
}
.add-section-btn {
  align-self: flex-start;
  margin-top: 0.5rem;
  background: var(--accent);
  color: #cc8923;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.add-section-btn:hover {
  background: #e67b00;
}
@media (max-width: 900px) {
  .additional-text-row {
    grid-template-columns: 1fr;
  }
}
::-webkit-scrollbar {
  width: 8px;
  background: var(--dark-3);
}
::-webkit-scrollbar-thumb {
  background: var(--card-bg);
  border-radius: 4px;
}
</style>