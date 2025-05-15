<template>
  <section class="sheet-section">
    <h2>Basic Information</h2>
    <form @submit.prevent>
      <div class="input-group input-group--row">
        <div class="input-flex">
          <label for="score-name-input">Score Name<span class="required">*</span></label>
          <input
            id="score-name-input"
            type="text"
            v-model="localSheet.name"
            placeholder="Name of this Score"
            @blur="validateField('name')"
          />
        </div>
        <div class="input-flex">
          <label for="score-type-picker">Score Type<span class="required">*</span></label>
          <select id="score-type-picker" v-model="localSheet.scoreType">
            <option value="">Select Type</option>
            <option v-for="type in scoreTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
        <div class="input-flex tier-flex">
          <label for="tier-stepper">Tier<span class="required">*</span></label>
          <NumberStepper
            id="tier-stepper"
            label=""
            :value="localSheet.tierLevel"
            :min="0"
            :max="5"
            @change="onTierChange"
            @blur="validateField('tierLevel')"
          />
        </div>
      </div>
      <div v-if="errors.name" class="error">{{ errors.name }}</div>
      <div v-if="errors.tierLevel" class="error">{{ errors.tierLevel }}</div>

      <div class="input-group">
        <label for="crew-picker">Crew</label>
        <select id="crew-picker" v-model="localSheet.crewId">
          <option :value="null">None</option>
          <option v-for="crew in crews" :key="crew.id" :value="crew.id">
            {{ crew.name }}
          </option>
        </select>
      </div>

      <div class="input-group">
        <label for="score-description">Brief Description</label>
        <textarea
          id="score-description"
          v-model="localSheet.scoreDescription"
          placeholder="Describe this score"
        ></textarea>
      </div>

      <div class="input-group">
        <label for="score-notes">Score Notes</label>
        <textarea
          id="score-notes"
          v-model="localSheet.scoreNotes"
          placeholder="Any additional notes for this score"
        ></textarea>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive, watch, ref, onMounted, computed } from 'vue';
import NumberStepper from '@/components/NumberStepper.vue';
import scoreImages from '@/assets/data/score-images.json';

interface CrewOption {
  id: string;
  name: string;
}

interface ScoreBasicInfo {
  name: string;
  tierLevel: number;
  crewId?: string | null;
  scoreDescription?: string;
  scoreNotes?: string;
  scoreType?: string;
}

const props = defineProps<{
  modelValue: ScoreBasicInfo;
  crews: CrewOption[];
}>();
const emit = defineEmits({
  'update:modelValue': (val: ScoreBasicInfo) => true,
  'validation': (errors: Record<string, string>) => true
});

const localSheet = reactive({ ...props.modelValue, tierLevel: props.modelValue.tierLevel ?? 0, scoreType: props.modelValue.scoreType ?? '' });
const crews = props.crews;

const errors = reactive<{ [key: string]: string }>({});

const scoreTypes = scoreImages.map(img => img.type);

function validateField(field: keyof ScoreBasicInfo) {
  switch (field) {
    case 'name':
      errors.name = localSheet.name.trim() ? '' : 'Score name is required.';
      break;
    case 'tierLevel':
      errors.tierLevel = localSheet.tierLevel >= 0 && localSheet.tierLevel <= 5 ? '' : 'Tier must be between 0 and 5.';
      break;
    default:
      break;
  }
  emit('validation', { ...errors });
}

function onTierChange(val: number) {
  localSheet.tierLevel = val;
  validateField('tierLevel');
}

watch(
  () => ({ ...localSheet }),
  (val) => {
    emit('update:modelValue', { ...val });
    // Validate all fields on change
    validateField('name');
    validateField('tierLevel');
  },
  { deep: true }
);

watch(
  () => localSheet.scoreType,
  (val) => {
    emit('update:modelValue', { ...localSheet });
  }
);
</script>

<style scoped lang="scss">
.sheet-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.input-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  label {
    font-weight: bold;
  }
}
.input-group--row {
  flex-direction: row;
  align-items: flex-end;
  gap: 2rem;
  margin-bottom: 0.5rem;
}
.input-flex {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.tier-flex {
  min-width: 120px;
  align-items: flex-end;
}
.input-group--inline {
  flex-direction: row;
  align-items: center;
  gap: 10px;
  label {
    flex-basis: 120px;
    flex-shrink: 0;
    text-align: right;
    margin-bottom: 0;
  }
  input[type="text"] {
    flex-grow: 1;
    width: auto;
  }
  .number-stepper {
    flex-shrink: 0;
  }
}
select {
  padding: 8px;
  border: 1.5px solid var(--accent);
  border-radius: 6px;
  font-size: 1rem;
  background: var(--dark-2);
  color: var(--primary);
  transition: border 0.2s, box-shadow 0.2s;
  outline: none;
  margin-top: 2px;
}
select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(198, 106, 0, 0.2);
}
select option {
  background: var(--dark-2);
  color: var(--primary);
}
.required {
  color: #d00;
  margin-left: 2px;
}
.error {
  color: #d00;
  font-size: 0.9em;
  margin-bottom: 10px;
}
.illustration-preview {
  margin-bottom: 0.5rem;
  img {
    max-width: 220px;
    max-height: 140px;
    border-radius: 6px;
    border: 1px solid #bbb;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
}
.highlight-btn {
  background: #1976d2;
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 1.1rem;
  margin-right: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}
.remove-btn {
  background: #d32f2f;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.remove-btn:hover {
  background: #b71c1c;
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
.modal {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
}
.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}
.gallery-img-wrapper {
  border: 1px solid #bbb;
  border-radius: 6px;
  padding: 0.3rem;
  background: #fafafa;
  cursor: pointer;
  transition: box-shadow 0.2s, border 0.2s;
  img {
    max-width: 120px;
    max-height: 80px;
    display: block;
  }
}
.gallery-img-wrapper:hover {
  border: 2px solid #1976d2;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.15);
}
.score-card-lower-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f0f0f0;
  border-top: 1px solid #ccc;
  border-radius: 0 0 5px 5px;
  span {
    font-weight: bold;
  }
}
.score-type-label {
  color: #1976d2;
}
.score-tier-label {
  color: #333;
}
</style> 