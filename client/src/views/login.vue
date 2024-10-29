<template>
  <div class="min-h-screen w-full flex flex-col justify-center items-center bg-gray-900 px-4 py-6">
    <div class="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-8">
      <h1 class="font-bold mb-6 text-3xl text-center text-white">Notes</h1>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-2">
          <label for="nickName" class="font-bold text-white block text-sm">Nickname</label>
          <input
            class="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-500"
            type="text"
            id="nickName"
            v-model="formData.nickName"
            placeholder="Your nickname"
            required
          />
        </div>

        <div class="space-y-2">
          <label for="password" class="font-bold text-white block text-sm">Password</label>
          <div class="relative">
            <input
              class="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-500"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="formData.password"
              placeholder="Your password"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <div v-if="error" class="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-2 rounded-lg text-sm">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-pink-600 text-white font-semibold py-2 rounded-lg hover:bg-pink-700 disabled:opacity-50"
        >
          {{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-400 text-sm">
          ¿No tienes una cuenta?
          <router-link 
            to="/register" 
            class="text-pink-500 hover:underline font-semibold"
          >
            Regístrate
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const formData = ref({ nickName: '', password: '' });
const showPassword = ref(false);
const error = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  if (!formData.value.nickName || !formData.value.password) {
    error.value = 'Todos los campos son requeridos';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const response = await fetch('https://localhost:5011/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-version': '1.0.0'
      },
      body: JSON.stringify(formData.value)
    });

    const data = await response.json();
    console.log("Datos de respuesta:", data); // Verificar la respuesta

    if (response.ok && data.token) {
      localStorage.setItem('token', data.token);
      console.log("Redirigiendo a /notes");
      router.push('/notes'); // Verifica que router esté definido
    } else {
      throw new Error(data.message || 'Error en la autenticación');
    }
  } catch (error) {
    console.error('Error:', error);
    error.value = error.message.includes('Failed to fetch')
      ? 'Error de conexión: No se pudo contactar con el servidor'
      : `Error: ${error.message}`;
  } finally {
    loading.value = false;
  }
};

</script>