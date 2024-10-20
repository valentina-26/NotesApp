<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col">
    <template v-if="!isEditing">
      <!-- Header -->
      <header class="p-4 flex justify-between items-center">
        <h1 class="text-xl font-bold">Notes</h1>
        <div class="flex space-x-4">
          <button @click="toggleSearch" class="focus:outline-none">
            <SearchIcon class="w-6 h-6" />
          </button>
          <button class="focus:outline-none">
            <ClockIcon class="w-6 h-6" />
          </button>
        </div>
      </header>

      <!-- Search bar -->
      <div v-if="isSearchActive" class="px-4 mb-4">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search by the keyword..."
          class="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none"
        />
      </div>

      <!-- Main content -->
      <main class="flex-grow p-4">
        <!-- Empty state (no notes) -->
        <div v-if="notes.length === 0 && !isSearchActive" class="h-full flex flex-col items-center justify-center">
          <img src="../assets/rafiki.svg" alt="Create note illustration" class="w-64 h-64 mb-4" />
          <p class="text-lg text-center mb-8">Create your first note!</p>
        </div>

        <!-- Search active, no results -->
        <div v-else-if="isSearchActive && filteredNotes.length === 0" class="h-full flex flex-col items-center justify-center">
          <img src="../assets/cuate.svg" alt="File not found illustration" class="w-64 h-64 mb-4" />
          <p class="text-lg text-center mb-2">File not found.</p>
          <p class="text-sm text-center text-gray-400">Try searching again.</p>
        </div>

        <!-- Notes list -->
        <div v-else class="space-y-4">
          <div 
            v-for="(note, index) in isSearchActive ? filteredNotes : notes" 
            :key="index" 
            class="rounded-lg p-4 relative overflow-hidden"
            :class="noteColors[index % noteColors.length]"
            @click="editNote(index)"
          >
            <p>{{ note.title }}</p>
            <div 
              v-if="noteToDelete === index"
              class="absolute inset-0 bg-red-500 flex items-center justify-center"
              @click.stop="deleteNote(index)"
            >
              <TrashIcon class="w-8 h-8" />
            </div>
          </div>
        </div>
      </main>

      <!-- Add note button -->
      <div class="fixed bottom-6 right-6">
        <button 
          @click="createNewNote"
          class="bg-white text-gray-900 rounded-full w-14 h-14 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white"
        >
          <PlusIcon class="w-8 h-8" />
        </button>
      </div>
    </template>

    <template v-else>
      <!-- Note Editor -->
      <header class="p-4 flex justify-between items-center">
        <div class="flex space-x-4">
          <button @click="goBack" class="focus:outline-none">
            <ChevronLeftIcon class="w-6 h-6" />
          </button>
          <button class="focus:outline-none">
            <EyeIcon class="w-6 h-6" />
          </button>
          <button class="focus:outline-none">
            <CameraIcon class="w-6 h-6" />
          </button>
        </div>
      </header>

      <!-- Note Content -->
      <main class="flex-grow p-4 overflow-y-auto">
        <input
          v-model="currentNote.title"
          type="text"
          placeholder="Title"
          class="w-full bg-transparent text-2xl font-bold mb-4 focus:outline-none"
        />
        <textarea
          v-model="currentNote.content"
          placeholder="Type something..."
          class="w-full h-full bg-transparent resize-none focus:outline-none"
        ></textarea>
      </main>

      <!-- Formatting Options -->
      <div class="p-4 flex justify-between items-center bg-gray-800">
        <div class="flex space-x-4">
          <button class="focus:outline-none"><BoldIcon class="w-5 h-5" /></button>
          <button class="focus:outline-none"><ItalicIcon class="w-5 h-5" /></button>
          <button class="focus:outline-none"><UnderlineIcon class="w-5 h-5" /></button>
          <button class="focus:outline-none"><ListIcon class="w-5 h-5" /></button>
          <button class="focus:outline-none"><ListOrderedIcon class="w-5 h-5" /></button>
        </div>
        <button @click="saveNote" class="bg-green-500 text-white px-4 py-2 rounded-full">
          Save
        </button>
      </div>
    </template>

    <!-- Save Changes Modal -->
    <div v-if="showSaveModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-gray-800 p-6 rounded-lg">
        <h2 class="text-xl font-bold mb-4">Save changes?</h2>
        <div class="flex justify-end space-x-4">
          <button @click="discardChanges" class="bg-red-500 text-white px-4 py-2 rounded">
            Discard
          </button>
          <button @click="saveChanges" class="bg-green-500 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { SearchIcon, ClockIcon, PlusIcon, TrashIcon, ChevronLeftIcon, EyeIcon, CameraIcon, BoldIcon, ItalicIcon, UnderlineIcon, ListIcon, ListOrderedIcon } from 'lucide-vue-next'

const notes = ref([
  { title: 'UI concepts worth existing', content: '' },
  { title: 'Book Review : The Design of Everyday Things by Don Norman', content: '' },
  { title: 'Animes produced by Ufotable', content: '' },
  { title: 'Mangas planned to read', content: '' },
  { title: 'Awesome tweets collection', content: '' },
  { title: 'List of free & open source apps', content: '' }
])

const noteColors = [
  'bg-pink-400',
  'bg-red-400',
  'bg-green-400',
  'bg-yellow-400',
  'bg-blue-400',
  'bg-purple-400'
]

const isSearchActive = ref(false)
const searchTerm = ref('')
const isEditing = ref(false)
const currentNote = ref({ title: '', content: '' })
const currentNoteIndex = ref(null)
const showSaveModal = ref(false)
const noteToDelete = ref(null)

const filteredNotes = computed(() => {
  if (!searchTerm.value) return notes.value
  return notes.value.filter(note => 
    note.title.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const toggleSearch = () => {
  isSearchActive.value = !isSearchActive.value
  if (!isSearchActive.value) {
    searchTerm.value = ''
  }
}

const createNewNote = () => {
  currentNote.value = { title: '', content: '' }
  currentNoteIndex.value = null
  isEditing.value = true
}

const editNote = (index) => {
  currentNote.value = { ...notes.value[index] }
  currentNoteIndex.value = index
  isEditing.value = true
}

const saveNote = () => {
  if (hasChanges()) {
    showSaveModal.value = true
  } else {
    finalizeSave()
  }
}

const finalizeSave = () => {
  if (currentNoteIndex.value !== null) {
    notes.value[currentNoteIndex.value] = { ...currentNote.value }
  } else {
    notes.value.push({ ...currentNote.value })
  }
  isEditing.value = false
}

const deleteNote = (index) => {
  notes.value.splice(index, 1)
  noteToDelete.value = null
}

const goBack = () => {
  if (hasChanges()) {
    showSaveModal.value = true
  } else {
    isEditing.value = false
  }
}

const hasChanges = () => {
  if (currentNoteIndex.value !== null) {
    return currentNote.value.title !== notes.value[currentNoteIndex.value].title ||
           currentNote.value.content !== notes.value[currentNoteIndex.value].content
  }
  return currentNote.value.title !== '' || currentNote.value.content !== ''
}

const discardChanges = () => {
  showSaveModal.value = false
  isEditing.value = false
}

const saveChanges = () => {
  finalizeSave()
  showSaveModal.value = false
}
</script>