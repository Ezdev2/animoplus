<template>
  <div class="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-md z-50">
    <h3 class="font-bold text-lg mb-3">🔧 API Debug Tester</h3>
    
    <div class="space-y-2 text-sm">
      <div>
        <strong>Token:</strong> 
        <span :class="hasToken ? 'text-green-600' : 'text-red-600'">
          {{ hasToken ? '✅ Présent' : '❌ Absent' }}
        </span>
      </div>
      
      <div>
        <strong>User Data:</strong>
        <span :class="hasUserData ? 'text-green-600' : 'text-red-600'">
          {{ hasUserData ? '✅ Présent' : '❌ Absent' }}
        </span>
      </div>
      
      <div class="mt-3 space-y-1">
        <button @click="testAuthMe" :disabled="testing" 
          class="w-full bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 disabled:opacity-50">
          {{ testing ? 'Test...' : 'Test /auth/me' }}
        </button>
        
        <button @click="testUserProfile" :disabled="testing"
          class="w-full bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 disabled:opacity-50">
          {{ testing ? 'Test...' : 'Test /user/profile' }}
        </button>
        
        <button @click="clearTokens"
          class="w-full bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600">
          Clear Tokens
        </button>
      </div>
      
      <div v-if="lastResult" class="mt-3 p-2 bg-gray-100 rounded text-xs">
        <strong>Dernier test:</strong>
        <pre class="whitespace-pre-wrap">{{ JSON.stringify(lastResult, null, 2) }}</pre>
      </div>
    </div>
    
    <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
      ✕
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['close'])

const testing = ref(false)
const lastResult = ref(null)

const hasToken = computed(() => !!localStorage.getItem('animoplus_token'))
const hasUserData = computed(() => !!localStorage.getItem('animoplus_user_data'))

const testAuthMe = async () => {
  testing.value = true
  lastResult.value = null
  
  try {
    const token = localStorage.getItem('animoplus_token')
    const baseUrl = 'https://laravel-backend-4yxv.onrender.com/api'
    
    const response = await fetch(`${baseUrl}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    
    const data = await response.json()
    
    lastResult.value = {
      endpoint: '/auth/me',
      status: response.status,
      statusText: response.statusText,
      success: response.ok,
      data: data
    }
    
    console.log('🧪 Test /auth/me:', lastResult.value)
    
  } catch (error) {
    lastResult.value = {
      endpoint: '/auth/me',
      error: error.message,
      success: false
    }
    console.error('🧪 Erreur test /auth/me:', error)
  } finally {
    testing.value = false
  }
}

const testUserProfile = async () => {
  testing.value = true
  lastResult.value = null
  
  try {
    const token = localStorage.getItem('animoplus_token')
    const baseUrl = 'https://laravel-backend-4yxv.onrender.com/api'
    
    const response = await fetch(`${baseUrl}/user/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    
    const data = await response.json()
    
    lastResult.value = {
      endpoint: '/user/profile',
      status: response.status,
      statusText: response.statusText,
      success: response.ok,
      data: data
    }
    
    console.log('🧪 Test /user/profile:', lastResult.value)
    
  } catch (error) {
    lastResult.value = {
      endpoint: '/user/profile',
      error: error.message,
      success: false
    }
    console.error('🧪 Erreur test /user/profile:', error)
  } finally {
    testing.value = false
  }
}

const clearTokens = () => {
  localStorage.removeItem('animoplus_token')
  localStorage.removeItem('animoplus_refresh_token')
  localStorage.removeItem('animoplus_user_data')
  console.log('🧹 Tokens cleared')
  lastResult.value = { message: 'Tokens cleared' }
}

onMounted(() => {
  console.log('🔧 API Tester monté')
})
</script>
