<template>
    <div class="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-white">Create Account</h2>
          <p class="mt-2 text-center text-sm text-gray-400">
            Join Notes App and start organizing your ideas
          </p>
        </div>
        <form class="mt-8 space-y-6" @submit.prevent="handleCreateAccount">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="name" class="sr-only">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                v-model="name"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-800"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label for="email-address" class="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="email"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-800"
                placeholder="Email address"
              />
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                v-model="password"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-gray-800"
                placeholder="Password"
              />
            </div>
          </div>
  
          <div>
            <button
              type="submit"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Create Account
            </button>
          </div>
        </form>
        <div class="text-center">
          <a href="#" class="font-medium text-indigo-400 hover:text-indigo-500">
            Already have an account? Sign in
          </a>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const name = ref('')
  const email = ref('')
  const password = ref('')
  
  const handleCreateAccount = () => {
    // Aquí iría la lógica para crear la cuenta
    console.log('Create account attempt', { 
      name: name.value, 
      email: email.value, 
      password: password.value 
    })
    // Normalmente, aquí llamarías a una API o usarías una solución de manejo de estado
  }
  </script>
  
  <style scoped>
  /* Puedes agregar estilos adicionales aquí si es necesario */
  </style>