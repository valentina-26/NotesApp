<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col">
    <template v-if="!isEditing">
      <header class="p-4 flex justify-between items-center">
        <div class="flex space-x-4">
          <button @click="toggleSearch" class="focus:outline-none">
            <SearchIcon class="w-6 h-6" />
          </button>
          <button class="focus:outline-none">
            <ClockIcon class="w-6 h-6" />
          </button>
        </div>
        <div v-if="error" class="text-red-500 text-sm">
          {{ error }}
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
            :key="note.id" 
            class="rounded-lg p-4 relative overflow-hidden transition-colors duration-300"
            :class="[noteColors[index % noteColors.length], { 'bg-red-500': noteToDelete === index }]"
            @click="toggleDeleteMode(index)"
          >
            <p class="font-bold">{{ note.title }}</p>
            <p class="text-sm mt-2">{{ note.description }}</p>
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
          <button @click="showSaveModal = true" class="focus:outline-none">
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
          placeholder="Título"
          class="w-full bg-transparent text-2xl font-bold mb-4 focus:outline-none"
          @keydown.enter.prevent
        />
        <textarea
          v-model="currentNote.description"
          placeholder="Escribe algo..."
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
        <div class="flex space-x-2">
          <button 
            @click="saveNote"
            class="px-4 py-2 rounded-full bg-green-500 text-white"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </div>
    </template>

    <!-- Save Changes Modal -->
    <div 
      v-if="showSaveModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-gray-800 p-6 rounded-lg max-w-sm w-full mx-4">
        <h2 class="text-xl font-bold mb-4">¿Guardar cambios?</h2>
        <p class="text-gray-300 mb-6">
          Tienes cambios sin guardar. ¿Qué deseas hacer?
        </p>
        <div class="flex justify-end space-x-4">
          <button 
            @click="discardChanges"
            class="px-4 py-2 rounded bg-red-500 text-white"
          >
            Descartar
          </button>
          <button 
            @click="saveChanges"
            class="px-4 py-2 rounded bg-green-500 text-white"
          >
            Guardar
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
const currentNote = ref({ title: '', description: '' })
const currentNoteIndex = ref(null)
const showSaveModal = ref(false)
const noteToDelete = ref(null)
const isLoading = ref(false)
const error = ref(null)

const resetState = () => {
  isEditing.value = false
  currentNote.value = { title: '', description: '' }
  currentNoteIndex.value = null
  showSaveModal.value = false
  noteToDelete.value = null
  error.value = null
}

onMounted(async () => {
  resetState()
  await fetchNotes()
})

const transformNote = (serverNote) => {
  return {
    id: serverNote._id || '',
    title: serverNote.title || '',
    description: serverNote.description || '',
    date: new Date(serverNote.date) || new Date()
  }
}

const discardChanges = () => {
  showSaveModal.value = false
  isEditing.value = false
  currentNote.value = { title: '', description: '' }
}

const saveChanges = async () => {
  showSaveModal.value = false
  await saveNote()
  isEditing.value = false // Salir del modo de edición después de guardar
}

const createFetchOptions = (method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'x-version': '1.0.0',
      'Accept': 'application/json'
    }
  }

  if (body) {
    options.headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body)
  }

  return options
}

const fetchNotes = async () => {
  try {
    isLoading.value = true
    const response = await fetch(`${API_URL}/notes`, {
      headers: {
        'Accept': 'application/json',
        'x-version': '1.0.0'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const serverNotes = await response.json()
    notes.value = Array.isArray(serverNotes.data) 
      ? serverNotes.data.map(transformNote)
      : []
    
    console.log('Notas cargadas:', notes.value)
  } catch (err) {
    error.value = 'Error al cargar las notas'
    console.error('Error completo:', err)
    notes.value = []
  } finally {
    isLoading.value = false
  }
}

const filteredNotes = computed(() => {
  if (!searchTerm.value) return notes.value
  const term = searchTerm.value.toLowerCase()
  return notes.value.filter(note => 
    note.title?.toLowerCase().includes(term) ||
    note.description?.toLowerCase().includes(term)
  )
})

const toggleSearch = () => {
  isSearchActive.value = !isSearchActive.value
  if (!isSearchActive.value) {
    searchTerm.value = ''
  }
}

const createNewNote = () => {
  currentNote.value = { 
    title: '', 
    description: '' 
  }
  currentNoteIndex.value = null
  isEditing.value = true
}

const saveNote = async () => {
  try {
    isLoading.value = true

    if (!currentNote.value.title?.trim() || !currentNote.value.description?.trim()) {
      error.value = 'El título y la descripción son requeridos'
      return
    }

    const noteData = {
      title: currentNote.value.title.trim(),
      description: currentNote.value.description.trim()
    }

    const response = await fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-version': '1.0.0'
      },
      body: JSON.stringify(noteData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al guardar la nota')
    }

    const result = await response.json()
    
    const newNote = transformNote(result.data)
    
    notes.value.unshift(newNote)
    
    currentNote.value = { title: '', description: '' }
    isEditing.value = false // Salir del modo de edición
    
    console.log('Nota creada exitosamente')
    
    // Recargar las notas
    await fetchNotes()
    
  } catch (err) {
    error.value = err.message || 'Error al guardar la nota'
    console.error('Error al guardar:', err)
  } finally {
    isLoading.value = false
  }
}

const editNote = async (index) => {
  try {
    isLoading.value = true
    const noteId = notes.value[index].id
    const response = await fetch(
      `${API_URL}/notes/${noteId}`, 
      createFetchOptions('GET')
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const serverNote = await response.json()
    currentNote.value = transformNote(serverNote.data)
    currentNoteIndex.value = index
    isEditing.value = true
  } catch (err) {
    error.value = 'Error al cargar la nota'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const toggleDeleteMode = (index) => {
  if (noteToDelete.value === index) {
    noteToDelete.value = null
  } else {
    noteToDelete.value = index
  }
}

const deleteNote = async (index) => {
  try {
    isLoading.value = true
    const noteId = notes.value[index].id
    const response = await fetch(
      `${API_URL}/notes/${noteId}`,
      createFetchOptions('DELETE')
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    notes.value.splice(index, 1)
    noteToDelete.value = null
    
    // Recargar las notas
    await fetchNotes()
  } catch (err) {
    error.value = 'Error al eliminar la nota'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
</script>