import { createClient } from '@supabase/supabase-js'

// 싱글톤 패턴으로 Supabase 클라이언트 관리
let supabaseInstance = null

function createSupabaseClient() {
  // 이미 인스턴스가 있으면 반환
  if (supabaseInstance) {
    return supabaseInstance
  }

  // 환경 변수 확인
  const hasValidConfig = import.meta.env.VITE_SUPABASE_URL &&
                        import.meta.env.VITE_SUPABASE_ANON_KEY &&
                        import.meta.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co' &&
                        import.meta.env.VITE_SUPABASE_ANON_KEY !== 'your_supabase_anon_key_here'

  if (hasValidConfig) {
    // 실제 Supabase 설정이 있는 경우
    supabaseInstance = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
          storage: typeof window !== 'undefined' ? window.localStorage : undefined,
          storageKey: import.meta.env.DEV ? 'supabase.auth.token.dev' : 'supabase.auth.token'
        }
      }
    )
    console.log('✅ Supabase 클라이언트 생성됨')
  } else {
    // 더미 Supabase 클라이언트 생성
    console.warn('⚠️ Supabase 환경 변수가 설정되지 않았습니다.')
    console.warn('실제 Supabase 프로젝트를 설정하려면:')
    console.warn('1. .env.local 파일을 생성하고')
    console.warn('2. VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 설정하세요')

    // 더미 클라이언트 생성 (오류 방지)
    supabaseInstance = {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithOAuth: async () => ({ data: null, error: { message: 'Supabase가 설정되지 않았습니다.' } }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: null } })
      }
    }
    console.log('⚠️ 더미 Supabase 클라이언트 생성됨')
  }

  return supabaseInstance
}

// 싱글톤 인스턴스 반환
const supabase = createSupabaseClient()

export { supabase }

