<template>
  <div class="home">
    <div class="container">
      <div class="welcome-card">
        <h1>환영합니다! 👋</h1>
        <p class="subtitle">로그인에 성공했습니다.</p>
        
        <div v-if="user" class="user-info">
          <div class="avatar">
            {{ getUserInitial(user.email) }}
          </div>
          <div class="user-details">
            <p class="user-email">{{ user.email }}</p>
            <p class="user-id">{{ user.id }}</p>
          </div>
        </div>
        
        <div class="actions">
          <button @click="showUserInfo" class="btn btn-secondary">
            사용자 정보 보기
          </button>
          <button @click="handleLogout" class="btn btn-danger" :disabled="loading">
            {{ loading ? '로그아웃 중...' : '로그아웃' }}
          </button>
        </div>
      </div>
      
      <div class="info-section">
        <h2>다음 단계</h2>
        <ul>
          <li>이 템플릿을 기반으로 앱을 개발하세요</li>
          <li>라우터에 새로운 페이지를 추가하세요</li>
          <li>Supabase 데이터베이스와 연동하세요</li>
          <li>UI를 커스터마이징하세요</li>
        </ul>
      </div>
    </div>
  </div>
  
  <!-- 사용자 정보 모달 -->
  <UserModal v-if="showUserModal" :user="user" @close="showUserModal = false" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import UserModal from '../components/UserModal.vue'

const auth = useAuthStore()
const router = useRouter()
const { user, loading } = storeToRefs(auth)
const showUserModal = ref(false)

const getUserInitial = (email) => {
  if (!email) return '?'
  return email.charAt(0).toUpperCase()
}

const showUserInfo = () => {
  showUserModal.value = true
}

const handleLogout = async () => {
  try {
    await auth.signOut()
    router.push('/intro')
  } catch (error) {
    console.error('로그아웃 실패:', error)
  }
}

onMounted(async () => {
  await auth.getCurrentUser()
  
  if (!auth.isAuthenticated) {
    router.push('/intro')
  }
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.welcome-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.welcome-card h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0 0 2rem 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  margin-bottom: 2rem;
}

.avatar {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-email {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
  word-break: break-all;
}

.user-id {
  font-size: 0.75rem;
  color: #6b7280;
  font-family: monospace;
  margin: 0;
  word-break: break-all;
}

.actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  flex: 1;
  min-width: 150px;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: #667eea;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #5568d3;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.info-section {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.info-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.info-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-section li {
  padding: 0.75rem 0;
  padding-left: 1.5rem;
  position: relative;
  color: #4b5563;
  border-bottom: 1px solid #f3f4f6;
}

.info-section li:last-child {
  border-bottom: none;
}

.info-section li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

@media (max-width: 768px) {
  .home {
    padding: 1rem;
  }
  
  .welcome-card h1 {
    font-size: 1.5rem;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>

