<template>
  <div class="intro-page">
    <div class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          안녕하세요!
          <span class="highlight">OAuth 템플릿</span>
        </h1>
        <p class="hero-description">
          Vue 3와 Supabase를 사용한 OAuth 소셜 로그인 템플릿입니다.
        </p>
        <div class="hero-buttons">
          <template v-if="!isLoggedIn">
            <button @click="handleGoogleLogin" class="btn btn-google">
              <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google로 로그인
            </button>
            
            <button @click="handleKakaoLogin" class="btn btn-kakao">
              <svg class="kakao-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 3C6.48 3 2 6.48 2 12s4.48 9 10 9 10-4.48 10-9S17.52 3 12 3zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z"/>
              </svg>
              카카오로 로그인
            </button>
          </template>
          <template v-else>
            <router-link to="/home" class="btn btn-primary">홈으로 가기</router-link>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const isLoggedIn = ref(false)

const handleGoogleLogin = async () => {
  try {
    await auth.signInWithGoogle()
  } catch (error) {
    console.error('Google 로그인 실패:', error)
  }
}

const handleKakaoLogin = async () => {
  try {
    await auth.signInWithKakao()
  } catch (error) {
    console.error('카카오 로그인 실패:', error)
  }
}

onMounted(async () => {
  await auth.getCurrentUser()
  isLoggedIn.value = auth.isAuthenticated
})
</script>

<style scoped>
.intro-page {
  min-height: 100vh;
  padding-top: 0;
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 20px;
  color: white;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  max-width: 600px;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 24px;
}

.highlight {
  color: #fbbf24;
  display: block;
  margin-top: 0.5rem;
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 40px;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  width: 100%;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.btn-google {
  background: white;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.btn-google:hover {
  background: #f9fafb;
}

.btn-kakao {
  background: #FEE500;
  color: #000;
}

.btn-kakao:hover {
  background: #FDD835;
}

.btn-primary {
  background: #fbbf24;
  color: #1f2937;
}

.btn-primary:hover {
  background: #f59e0b;
}

.google-icon,
.kakao-icon {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
}
</style>

