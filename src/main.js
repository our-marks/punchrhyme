import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { App as CapacitorApp } from '@capacitor/app'
import { Browser } from '@capacitor/browser'
import { supabase } from './lib/supabase'

import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')

// OAuth 네이티브 딥링크 처리
CapacitorApp.addListener('appUrlOpen', async ({ url }) => {
  try {
    console.log('[appUrlOpen] url:', url)

    if (!url || typeof url !== 'string') {
      console.warn('[appUrlOpen] invalid url')
      return
    }

    // 딥링크 스킴 확인 (yourapp:// 를 실제 앱 스킴으로 변경하세요)
    if (!url.startsWith('yourapp://auth/callback')) {
      console.log('[appUrlOpen] ignored url')
      return
    }

    const parsed = new URL(url)
    const code = parsed.searchParams.get('code')
    const error = parsed.searchParams.get('error')
    
    console.log('[appUrlOpen] code:', code ? 'present' : 'null', 'error:', error || 'null')

    if (error) {
      console.error('OAuth error from native redirect:', error)
      await Browser.close()
      return
    }
    
    if (code) {
      console.log('[appUrlOpen] exchanging code for session...')
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('exchangeCodeForSession error:', exchangeError.message)
      } else {
        console.log('[appUrlOpen] code exchange success')
      }
    }
    
    await Browser.close()
    router.replace({ name: 'home' })
  } catch (e) {
    console.error('appUrlOpen handler error:', e.message)
  }
})

