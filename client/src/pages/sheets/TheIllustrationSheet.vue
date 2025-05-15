<template>
  <div class="illustration-sheet">
    <div v-if="sheet.illustrations && sheet.illustrations.length" class="illustration-image-preview">
      <img :src="resolveImageUrl(`/images/${sheet.illustrations[0].filename}`)" alt="Illustration" />
    </div>
    <div v-else class="illustration-image-preview">
      <img src="/images/parchment-default.jpg" alt="Default Illustration" />
    </div>
    <div></div>
        
    <input v-model="sheet.name" class="illustration-title-input" placeholder="Illustration Title" @blur="saveField('name', sheet.name)" />
    <textarea v-model="sheet.description" class="illustration-desc-input" placeholder="Description" @blur="saveField('description', sheet.description)" />
    <button class="btn pick-image-btn" @click="showImagePicker = true">Pick Image from Gallery</button>
    <div class="illustration-info">
      <div v-if="sheet.illustrations && sheet.illustrations.length">
        <h3>Illustration Info</h3>
        <ul>
          <li v-for="img in sheet.illustrations" :key="img.id">
            <a :href="resolveImageUrl(`/images/${img.filename}`)" target="_blank">{{ img.originalname }}</a>
            <span class="img-date">({{ new Date(img.uploadedAt).toLocaleString() }})</span>
          </li>
        </ul>
      </div>
      <div v-else class="placeholder">No illustration uploaded yet.</div>
    </div>
    <div v-if="showImagePicker" class="modal-overlay">
      <div class="modal">
        <h3>Pick an Image</h3>
        <div v-if="imageLedgerError" class="error">{{ imageLedgerError }}</div>
        <ul v-else class="gallery">
          <li v-for="img in imageLedger" :key="img.filename">
            <img :src="resolveImageUrl(`/images/${img.filename}`)" @click="pickImage(img)" />
            <div>{{ img.originalname }}</div>
          </li>
        </ul>
        <button class="btn" @click="showImagePicker = false">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, computed } from 'vue';
import { patch } from '@/controllers/game-controller';
import type { World } from '@/game-data/sheets/world-sheet';
import { resolveImageUrl } from '@/util/resolveImageUrl';
import { BASE_URL } from '@/api/connection';

const props = defineProps<{ sheet: World }>();
const showImagePicker = ref(false);
const imageLedger = ref<any[]>([]);
const imageLedgerError = ref('');

function saveField(field: string, value: any) {
  patch([
    {
      op: 'replace',
      path: `/data/sheets/${props.sheet.id}/${field}`,
      value
    }
  ]);
}

function pickImage(img: any) {
  console.log('pickImage called', img, props.sheet);
  if (!props.sheet) return;
  const newIllustration = {
    id: img.filename,
    filename: img.filename,
    originalname: img.originalname,
    uploadedAt: img.uploadedAt,
    description: ''
  };
  props.sheet.illustrations = [newIllustration];
  saveField('illustrations', [newIllustration]);
  showImagePicker.value = false;
}

onMounted(async () => {
  try {
    const res = await fetch(`${BASE_URL}/images/ledger`);
    if (!res.ok) throw new Error('Failed to fetch image ledger');
    imageLedger.value = await res.json();
    console.log('Fetched image ledger:', imageLedger.value);
    if (!Array.isArray(imageLedger.value) || imageLedger.value.length === 0) {
      imageLedgerError.value = 'No images found in the gallery.';
    }
  } catch (err) {
    imageLedgerError.value = 'Could not load image gallery.';
    console.error('Error fetching image ledger:', err);
  }
});

const illustrationCardStyle = computed(() => {
  if (props.sheet.illustrations && props.sheet.illustrations.length) {
    return {
      backgroundImage: `url('${resolveImageUrl(`/images/${props.sheet.illustrations[0].filename}`)}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  }
  return {};
});
</script>

<style scoped>
.illustration-sheet {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}
.illustration-image-preview {
  width: 100%;
  max-width: 700px;
  height: 320px;
  max-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
}
.illustration-image-preview img {
  width: 200%;
  height: 200%;
  object-fit: contain;
  border-radius: 0;
  box-shadow: none;
}
.illustration-title-input {
  font-size: 1.3rem;
  font-weight: bold;
  border: none;
  background: transparent;
  text-align: center;
  margin-top: 0.5rem;
  color: #2e5c7a;
  width: 100%;
  max-width: 700px;
}
.illustration-title-input:focus {
  outline: 2px solid #6ca7c2;
}
.illustration-desc-input {
  width: 100%;
  max-width: 700px;
  min-height: 2.5em;
  font-size: 1.1rem;
  border: none;
  background: #f7f7f7;
  border-radius: 6px;
  padding: 0.5em 1em;
  color: #2e5c7a;
  margin-bottom: 1rem;
}
.illustration-desc-input:focus {
  outline: 2px solid #6ca7c2;
}
.illustration-info {
  width: 100%;
  max-width: 700px;
}
.img-date {
  color: #888;
  font-size: 0.95em;
  margin-left: 0.5em;
}
.placeholder {
  color: #aaa;
  font-style: italic;
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
.gallery img {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border 0.2s;
}
.gallery img:hover {
  border: 2px solid #2e5c7a;
}
</style>
