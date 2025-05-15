<template>
  <section class="sheet-section">
    <h2>Clocks</h2>
    <div v-if="clocks.length === 0" class="empty">No clocks yet.</div>
    <div class="clocks-table">
      <div
        v-for="(clock, idx) in clocks"
        :key="clock.id"
        class="clock-table-cell"
      >
        <div class="clock-row">
          <button class="btn btn--icon" @click="decrementClock(idx)"><i class="fas fa-minus"></i></button>
          <Clock :clock="clock" :change="(val) => onValueChange(idx, val)" />
          <div class="clock-actions">
            <button class="btn btn--icon" @click="editClock(idx)"><i class="fas fa-edit"></i></button>
            <button class="btn btn--icon" @click="removeClock(idx)"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    </div>
    <div class="add-btn-row">
      <button class="btn btn--text add-btn" @click="showAdd = true"><i class="fas fa-plus"></i> Add Clock</button>
    </div>
    <!-- Add/Edit Clock Modal -->
    <div v-if="showAdd || editIdx !== null" class="modal-overlay">
      <div class="modal">
        <h3>{{ editIdx !== null ? 'Edit Clock' : 'Add Clock' }}</h3>
        <form @submit.prevent="onSubmit">
          <div class="input-group">
            <label>Name<span class="required">*</span></label>
            <input v-model="form.name" type="text" />
            <div v-if="errors.name" class="error">{{ errors.name }}</div>
          </div>
          <div class="input-group">
            <label>Description</label>
            <textarea v-model="form.description" />
          </div>
          <div class="input-group">
            <label>Segments<span class="required">*</span></label>
            <input v-model.number="form.segments" type="number" min="2" max="12" />
            <div v-if="errors.segments" class="error">{{ errors.segments }}</div>
          </div>
          <div class="input-group">
            <label>Value</label>
            <input v-model.number="form.value" type="number" :min="0" :max="form.segments" />
            <div v-if="errors.value" class="error">{{ errors.value }}</div>
          </div>
          <div class="modal-actions">
            <button class="btn" type="submit">{{ editIdx !== null ? 'Save' : 'Add' }}</button>
            <button class="btn btn--text" type="button" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import Clock from '@/components/Clock.vue';
import { Clock as ClockType } from '@/game-data/game-data-types';
import { v4 as uuidv4 } from 'uuid';
import { patch } from '@/controllers/game-controller';
import { useTokenStore } from '@/stores/token-store';

const props = defineProps<{
  modelValue: ClockType[];
  scoreId: string;
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', clocks: ClockType[]): void;
  (e: 'add', clock: ClockType): void;
  (e: 'edit', idx: number, clock: ClockType): void;
  (e: 'remove', idx: number): void;
  (e: 'value', idx: number, value: number): void;
}>();

const clocks = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const showAdd = ref(false);
const editIdx = ref<number|null>(null);
const form = reactive({
  name: '',
  description: '',
  segments: 4,
  value: 0,
});
const errors = reactive<{[k:string]:string}>({});

function resetForm(clock?: ClockType) {
  form.name = clock?.name || '';
  form.description = clock?.description || '';
  form.segments = clock?.segments || 4;
  form.value = clock?.value || 0;
  errors.name = '';
  errors.segments = '';
  errors.value = '';
}

function validate() {
  errors.name = form.name.trim() ? '' : 'Name is required.';
  errors.segments = form.segments >= 2 && form.segments <= 12 ? '' : 'Segments must be 2-12.';
  errors.value = form.value >= 0 && form.value <= form.segments ? '' : 'Value must be 0 to segments.';
  return !errors.name && !errors.segments && !errors.value;
}

function onSubmit() {
  if (!validate()) return;
  const clock: ClockType = {
    id: editIdx.value !== null ? clocks.value[editIdx.value].id : uuidv4(),
    name: form.name,
    description: form.description,
    segments: form.segments,
    value: form.value,
  };
  let newClocks;
  if (editIdx.value !== null) {
    emit('edit', editIdx.value, clock);
    newClocks = clocks.value.slice();
    newClocks.splice(editIdx.value, 1, clock);
  } else {
    emit('add', clock);
    newClocks = clocks.value.concat(clock);
  }
  emit('update:modelValue', newClocks);
  console.log('Access token before patch (onSubmit):', useTokenStore().accessToken);
  patch([
    {
      op: 'replace',
      path: `/data/sheets/${props.scoreId}/clocks`,
      value: newClocks,
    },
  ]);
  closeModal();
}

function closeModal() {
  showAdd.value = false;
  editIdx.value = null;
  resetForm();
}

function editClock(idx: number) {
  editIdx.value = idx;
  resetForm(clocks.value[idx]);
}

function removeClock(idx: number) {
  emit('remove', idx);
  const newClocks = clocks.value.slice();
  newClocks.splice(idx, 1);
  emit('update:modelValue', newClocks);
  console.log('Access token before patch (removeClock):', useTokenStore().accessToken);
  patch([
    {
      op: 'replace',
      path: `/data/sheets/${props.scoreId}/clocks`,
      value: newClocks,
    },
  ]);
}

function onValueChange(idx: number, value: number) {
  emit('value', idx, value);
  const newClocks = clocks.value.slice();
  newClocks[idx] = { ...newClocks[idx], value };
  emit('update:modelValue', newClocks);
  console.log('Access token before patch (onValueChange):', useTokenStore().accessToken);
  patch([
    {
      op: 'replace',
      path: `/data/sheets/${props.scoreId}/clocks`,
      value: newClocks,
    },
  ]);
}

function decrementClock(idx: number) {
  if (clocks.value[idx].value > 0) {
    const newClocks = clocks.value.slice();
    newClocks[idx] = { ...newClocks[idx], value: newClocks[idx].value - 1 };
    emit('value', idx, newClocks[idx].value);
    emit('update:modelValue', newClocks);
    console.log('Access token before patch (decrementClock):', useTokenStore().accessToken);
    patch([
      {
        op: 'replace',
        path: `/data/sheets/${props.scoreId}/clocks`,
        value: newClocks,
      },
    ]);
  }
}
</script>

<style scoped lang="scss">
.sheet-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.clocks-table {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 1rem;
  align-items: stretch;
}
@media (max-width: 900px) {
  .clocks-table {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .clocks-table {
    grid-template-columns: 1fr;
  }
}
.clock-table-cell {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.clock-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-height: 100%;
  width: 100%;
}
.clock-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.add-btn {
  margin-top: 1rem;
}
.empty {
  color: #888;
  margin-bottom: 1rem;
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
.input-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
.required {
  color: #d00;
  margin-left: 2px;
}
.error {
  color: #d00;
  font-size: 0.9em;
  margin-bottom: 0.5rem;
}
.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
.add-btn-row {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
</style> 