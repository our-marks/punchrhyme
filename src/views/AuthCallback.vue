<template>
  <div class="auth-callback">
    <div class="callback-container">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <h2>{{ statusMessage }}</h2>
        <p>{{ detailMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const statusMessage = ref('로그인 처리 중...')
const detailMessage = ref('잠시만 기다려주세요.')

onMounted(async () => {
  try {
    // URL에서 쿼리 파라미터 처리 (Supabase OAuth 콜백)
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')
    const errorDescription = urlParams.get('error_description')
    
    // 에러가 있는 경우
    if (error) {
      console.error('OAuth error:', error, errorDescription)
      statusMessage.value = '인증 실패'
      detailMessage.value = errorDescription || error
      setTimeout(() => router.push('/intro'), 3000)
      return
    }
    
    // code가 있는 경우 Supabase OAuth 콜백 처리
    if (code) {
      statusMessage.value = 'OAuth 처리 중...'
      detailMessage.value = '코드를 세션으로 교환하고 있습니다.'
      
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Session exchange error:', exchangeError)
        statusMessage.value = '세션 교환 실패'
        detailMessage.value = '인증에 실패했습니다.'
        setTimeout(() => router.push('/intro'), 3000)
        return
      }
      
      if (data.session) {
        console.log('OAuth 세션 설정 성공:', data.session.user.email)
        
        // 인증 스토어 업데이트
        const auth = useAuthStore()
        auth.user = data.session.user
        auth.session = data.session
        
        statusMessage.value = '로그인 성공!'
        detailMessage.value = '홈으로 이동합니다...'
        setTimeout(() => router.push('/home'), 1000)
        return
      }
    }
    
    // URL에서 해시 프래그먼트 처리
    const hash = window.location.hash
    if (hash) {
      statusMessage.value = '해시 토큰 처리 중...'
      detailMessage.value = '토큰을 추출하고 있습니다.'
      
      const hashParams = new URLSearchParams(hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      const hashError = hashParams.get('error')
      
      if (hashError) {
        console.error('Hash error:', hashError)
        statusMessage.value = '인증 실패'
        detailMessage.value = hashError
        setTimeout(() => router.push('/intro'), 3000)
        return
      }
      
      if (accessToken) {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })
        
        if (error) {
          console.error('Session set error:', error)
          statusMessage.value = '세션 설정 실패'
          detailMessage.value = '토큰으로 세션 설정에 실패했습니다.'
          setTimeout(() => router.push('/intro'), 3000)
          return
        }
        
        if (data.session) {
          console.log('Hash 세션 설정 성공:', data.session.user.email)
          
          const auth = useAuthStore()
          auth.user = data.session.user
          auth.session = data.session
          
          statusMessage.value = '로그인 성공!'
          detailMessage.value = '홈으로 이동합니다...'
          setTimeout(() => router.push('/home'), 1000)
          return
        }
      }
    }
    
    // 기존 세션 확인
    const auth = useAuthStore()
    await auth.getCurrentUser()
    
    if (auth.user) {
      statusMessage.value = '로그인 성공!'
      detailMessage.value = '홈으로 이동합니다...'
      setTimeout(() => router.push('/home'), 1000)
    } else {
      statusMessage.value = '세션 없음'
      detailMessage.value = '인트로 페이지로 이동합니다...'
      setTimeout(() => router.push('/intro'), 2000)
    }
  } catch (err) {
    console.error('AuthCallback error:', err)
    statusMessage.value = '처리 실패'
    detailMessage.value = '인증 처리 중 오류가 발생했습니다.'
    setTimeout(() => router.push('/intro'), 3000)
  }
})
</script>

<style scoped>
.auth-callback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
}

.callback-container {
  text-align: center;
  padding: 2rem;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.loading-spinner p {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

