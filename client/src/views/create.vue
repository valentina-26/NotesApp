<template>
  <div class="min-h-screen w-full flex flex-col justify-center items-center bg-gray-900 px-4 py-6">
    <div class="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8">
      <h1 class="text-3xl font-bold text-center text-white mb-6">Create Account</h1>
      <form @submit.prevent="createAccount" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-300">Name</label>
          <input
            type="text"
            id="name"
            v-model="formData.name"
            required
            class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Your name"
          />
        </div>
        <div>
          <label for="nickname" class="block text-sm font-medium text-gray-300">Nickname</label>
          <input
            type="text"
            id="nickname"
            v-model="formData.nickname"
            required
            class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Your nickname"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            required
            class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Your email"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-300">Password</label>
          <div class="relative mt-1">
            <input
              :type="passwordVisible ? 'text' : 'password'"
              id="password"
              v-model="formData.password"
              required
              class="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Your password"
            />
            <button 
              type="button"
              @click="togglePasswordVisibility"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            >
              {{ passwordVisible ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>
        <div class="flex items-center">
          <input
            id="terms"
            type="checkbox"
            v-model="agree"
            class="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
          />
          <label for="terms" class="ml-2 block text-sm text-gray-300">
            I accept the terms and privacy policy
          </label>
        </div>
        <div v-if="errorMessage" class="text-red-500 text-sm mt-2">
          {{ errorMessage }}
        </div>
        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
        >
          Create Account
        </button>
      </form>
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-400">
          Already have an account?
          <a @click.prevent="goToLogin" href="#" class="font-medium text-pink-500 hover:text-pink-400">
            Sign in
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const formData = ref({
  name: '',
  nickname: '',
  email: '',
  password: '',
});
const agree = ref(false);
const passwordVisible = ref(false);
const errorMessage = ref('');

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const createAccount = async () => {
  if (!agree.value) {
    errorMessage.value = 'Please accept the terms and privacy policy.';
    return;
  }

  try {
    const response = await fetch('https://localhost:5011/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.value),
    });
    const result = await response.json();

    if (response.ok) {
      router.push('/home');
    } else {
      errorMessage.value = result.message || 'An error occurred while creating the account.';
    }
  } catch (error) {
    errorMessage.value = 'An unexpected error occurred. Please try again.';
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>