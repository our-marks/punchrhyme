import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import IntroView from '../views/IntroView.vue'
import HomeView from '../views/HomeView.vue'
import AuthCallback from '../views/AuthCallback.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/intro'
    },
    {
      path: '/intro',
      name: 'intro',
      component: IntroView,
      meta: {
        title: '소개'
      }
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { 
        requiresAuth: true,
        title: '홈'
      }
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: AuthCallback
    }
  ]
})

// 라우터 가드 설정
router.beforeEach(async (to, from, next) => {
  try {
    const auth = useAuthStore()
    
    // 인증이 필요한 페이지인지 확인
    if (to.meta.requiresAuth) {
      // 현재 사용자 확인
      await auth.getCurrentUser()
      
      // 로그인되지 않은 경우 인트로 페이지로 리다이렉트
      if (!auth.isAuthenticated) {
        console.log('인증 필요 - 인트로 페이지로 이동')
        next({ name: 'intro' })
        return
      }
    }
    
    // 로그인된 사용자가 인트로 페이지에 접근하면 홈으로 리다이렉트
    if (to.name === 'intro') {
      await auth.getCurrentUser()
      if (auth.isAuthenticated) {
        console.log('이미 로그인됨 - 홈 페이지로 이동')
        next({ name: 'home' })
        return
      }
    }
    
    next()
  } catch (error) {
    console.error('라우터 가드 오류:', error)
    next()
  }
})

export default router

