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
            class="rounded-lg p-4 relative overflow-hidden transition-colors duration-300"
            :class="[noteColors[index % noteColors.length], { 'bg-red-500': noteToDelete === index }]"
            @click="toggleDeleteMode(index)"
          >
            <p>{{ note.title }}</p>
            <div 
              v-if="noteToDelete === index"
              class="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-80"
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
import { ref, computed, onMounted } from 'vue'
import { SearchIcon, ClockIcon, PlusIcon, TrashIcon, ChevronLeftIcon, EyeIcon, CameraIcon, BoldIcon, ItalicIcon, UnderlineIcon, ListIcon, ListOrderedIcon } from 'lucide-vue-next'

const API_URL = 'https://localhost:5011'

const notes = ref([])
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
const isLoading = ref(false)
const error = ref(null)

// Cargar notas al iniciar el componente
onMounted(async () => {
  await fetchNotes()
})

// Obtener todas las notas
const fetchNotes = async () => {
  try {
    isLoading.value = true
    const response = await fetch(`${API_URL}/notes`)
    const data = await response.json()
    notes.value = data
  } catch (err) {
    error.value = 'Error al cargar las notas'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const filteredNotes = computed(() => {
  if (!searchTerm.value) return notes.value
  return notes.value.filter(note => 
    note.title.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

// Buscar notas
const toggleSearch = async () => {
  isSearchActive.value = !isSearchActive.value
  if (!isSearchActive.value) {
    searchTerm.value = ''
    await fetchNotes() // Recargar todas las notas
  } else if (searchTerm.value) {
    try {
      isLoading.value = true
      const response = await fetch(`${API_URL}/notes/search?q=${searchTerm.value}`)
      const data = await response.json()
      notes.value = data
    } catch (err) {
      error.value = 'Error en la búsqueda'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }
}

const createNewNote = () => {
  currentNote.value = { title: '', content: '' }
  currentNoteIndex.value = null
  isEditing.value = true
}

const editNote = async (index) => {
  try {
    isLoading.value = true
    const noteId = notes.value[index].id
    const response = await fetch(`${API_URL}/notes/${noteId}`)
    const data = await response.json()
    currentNote.value = { ...data }
    currentNoteIndex.value = index
    isEditing.value = true
  } catch (err) {
    error.value = 'Error al cargar la nota'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const finalizeSave = async () => {
  try {
    isLoading.value = true
    let response

    if (currentNoteIndex.value !== null) {
      // Actualizar nota existente
      const noteId = notes.value[currentNoteIndex.value].id
      response = await fetch(`${API_URL}/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentNote.value)
      })
    } else {
      // Crear nueva nota
      response = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentNote.value)
      })
    }

    const savedNote = await response.json()
    
    if (currentNoteIndex.value !== null) {
      notes.value[currentNoteIndex.value] = savedNote
    } else {
      notes.value.push(savedNote)
    }
    
    isEditing.value = false
  } catch (err) {
    error.value = 'Error al guardar la nota'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const deleteNote = async (index) => {
  try {
    const noteId = notes.value[index].id
    await fetch(`${API_URL}/notes/${noteId}`, {
      method: 'DELETE'
    })
    notes.value.splice(index, 1)
    noteToDelete.value = null
  } catch (err) {
    error.value = 'Error al eliminar la nota'
    console.error(err)
  }
}

// Guardar versión de la nota
const saveNoteVersion = async (noteId) => {
  try {
    await fetch(`${API_URL}/notes/${noteId}/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(currentNote.value)
    })
  } catch (err) {
    error.value = 'Error al guardar la versión'
    console.error(err)
  }
}

const toggleDeleteMode = (index) => {
  if (noteToDelete.value === index) {
    noteToDelete.value = null
  } else {
    noteToDelete.value = index
  }
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