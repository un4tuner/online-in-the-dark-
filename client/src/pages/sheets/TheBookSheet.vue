<template>
  <div class="book-sheet">
    <div class="book-card-row">
      <img class="book-image" src="/images/book-default.jpg" alt="Book Cover" />
      <div class="book-card-controls">
        <input v-model="sheet.name" class="book-title-input" placeholder="Book Title" @blur="saveField('name', sheet.name)" />
        <textarea v-model="sheet.description" class="book-desc-input" placeholder="Description" @blur="saveField('description', sheet.description)" />
        <button class="btn pick-book-btn" @click="showBookPicker = true">Pick Book from Library</button>
      </div>
    </div>
    <div class="book-info">
      <div v-if="sheet.books && sheet.books.length">
        <h3>Book Files</h3>
        <ul>
          <li v-for="book in sheet.books" :key="book.id">
            <a :href="resolveImageUrl(`/books/${book.filename}`)" target="_blank">{{ book.originalname }}</a>
            <span class="book-date">({{ new Date(book.uploadedAt).toLocaleString() }})</span>
            <div class="book-preview">
              <template v-if="isTextFile(book.filename)">
                <pre>{{ bookPreview[book.filename] }}</pre>
              </template>
              <template v-else>
                <span class="placeholder">{{ bookPreview[book.filename] }}</span>
              </template>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="placeholder">No book files attached yet.</div>
    </div>
    <div v-if="showBookPicker" class="modal-overlay">
      <div class="modal">
        <h3>Pick a Book</h3>
        <div v-if="bookLedgerError" class="error">{{ bookLedgerError }}</div>
        <ul v-else class="gallery">
          <li v-for="book in bookLedger" :key="book.filename">
            <div class="book-filename" @click="pickBook(book)">{{ book.originalname }}</div>
            <div class="book-date">({{ new Date(book.uploadedAt).toLocaleString() }})</div>
          </li>
        </ul>
        <button class="btn" @click="showBookPicker = false">Close</button>
      </div>
    </div>
    <div class="book-label">Book</div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted } from 'vue';
import { patch } from '@/controllers/game-controller';
import type { World } from '@/game-data/sheets/world-sheet';
import { resolveImageUrl } from '@/util/resolveImageUrl';
import { BASE_URL } from '@/api/connection';

const props = defineProps<{ sheet: World }>();
const showBookPicker = ref(false);
const bookLedger = ref<any[]>([]);
const bookLedgerError = ref('');
const bookPreview = ref<Record<string, string>>({});

function saveField(field: string, value: any) {
  patch([
    {
      op: 'replace',
      path: `/data/sheets/${props.sheet.id}/${field}`,
      value
    }
  ]);
}

function pickBook(book: any) {
  console.log('pickBook called', book, props.sheet);
  if (!props.sheet) return;
  const newBook = {
    id: book.filename,
    filename: book.filename,
    originalname: book.originalname,
    uploadedAt: book.uploadedAt,
    description: ''
  };
  props.sheet.books = [newBook];
  saveField('books', [newBook]);
  showBookPicker.value = false;
  fetchBookPreview(book.filename);
}

function isTextFile(filename: string) {
  return filename.endsWith('.txt') || filename.endsWith('.md');
}

async function fetchBookPreview(filename: string) {
  if (!isTextFile(filename)) {
    bookPreview.value[filename] = 'Preview not available. Click to download or view the file.';
    return;
  }
  try {
    const res = await fetch(resolveImageUrl(`/books/${filename}`));
    const text = await res.text();
    bookPreview.value[filename] = text;
  } catch {
    bookPreview.value[filename] = 'No preview available.';
  }
}

onMounted(async () => {
  try {
    const res = await fetch(`${BASE_URL}/books/ledger`);
    if (!res.ok) throw new Error('Failed to fetch book ledger');
    bookLedger.value = await res.json();
    console.log('Fetched book ledger:', bookLedger.value);
    if (!Array.isArray(bookLedger.value) || bookLedger.value.length === 0) {
      bookLedgerError.value = 'No books found in the library.';
    }
  } catch (err) {
    bookLedgerError.value = 'Could not load book library.';
    console.error('Error fetching book ledger:', err);
  }
  if (props.sheet.books && props.sheet.books.length) {
    for (const book of props.sheet.books) {
      fetchBookPreview(book.filename);
    }
  }
});
</script>

<style scoped>
.book-sheet {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 2rem;
  padding: 2rem;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  position: relative;
}
.book-card-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 2rem;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}
.book-image {
  width: 220px;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  background: #f5e6c5;
}
.book-card-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1 1 0;
  min-width: 0;
}
.book-title-input {
  font-size: 1.3rem;
  font-weight: bold;
  border: none;
  background: transparent;
  text-align: left;
  margin-top: 0.5rem;
  color: #7a5c2e;
  width: 100%;
}
.book-title-input:focus {
  outline: 2px solid #c2a76c;
}
.book-desc-input {
  width: 100%;
  min-height: 2.5em;
  font-size: 1.1rem;
  border: none;
  background: #f7f7f7;
  border-radius: 6px;
  padding: 0.5em 1em;
  color: #7a5c2e;
  margin-bottom: 1rem;
}
.book-desc-input:focus {
  outline: 2px solid #c2a76c;
}
.book-info {
  flex: 1 1 auto;
  width: 100vw;
  max-width: 100vw;
  min-height: 0;
  max-height: none;
  overflow: auto;
  background: #f7f7f7;
  border-radius: 6px;
  margin: 2rem 0 0 0;
  box-sizing: border-box;
  padding: 1.5rem 2rem;
  color: #222;
  font-size: 1.1rem;
  scrollbar-width: auto;
}
.book-info::-webkit-scrollbar {
  width: 12px;
}
.book-info::-webkit-scrollbar-thumb {
  background: #bbb;
  border-radius: 6px;
}
.book-info::-webkit-scrollbar-track {
  background: #f7f7f7;
}
.book-date {
  color: #888;
  font-size: 0.95em;
  margin-left: 0.5em;
}
.book-preview {
  background: #f7f7f7;
  border-radius: 6px;
  padding: 0.5em 1em;
  margin-top: 0.5em;
  font-size: 0.98em;
  flex: 1 1 auto;
  width: 100%;
  min-height: 200px;
  max-height: 60vh;
  overflow: auto;
  box-sizing: border-box;
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
.book-filename {
  cursor: pointer;
  color: #1976d2;
  text-decoration: underline;
  font-weight: 500;
}
.book-filename:hover {
  color: #0d47a1;
}
.book-label {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  font-size: 1.1rem;
  font-weight: bold;
  color: #7a5c2e;
  background: #f5e6c5;
  border-radius: 6px 6px 0 0;
  padding: 0.4em 1.2em;
  letter-spacing: 2px;
  text-transform: uppercase;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.08);
  text-align: center;
  z-index: 10;
}
</style>
