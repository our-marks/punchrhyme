import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'
import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
import { SocialLogin } from '@capgo/capacitor-social-login'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const session = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)
  const isGuest = computed(() => !user.value)

  // OAuth 리다이렉트 URL 가져오기
  const getOAuthRedirectTo = () => {
    if (typeof window === 'undefined') return null
    const isNative = Capacitor.isNativePlatform()
    const redirect = isNative
      ? 'yourapp://auth/callback'  // 앱의 딥링크 스킴으로 변경하세요
      : `${window.location.origin}/auth/callback`
    console.log('[Auth] redirectTo:', redirect, 'isNative:', isNative)
    return redirect
  }

  // 현재 사용자 가져오기
  const getCurrentUser = async (force = false) => {
    if (!force && user.value) {
      return user.value
    }

    try {
      loading.value = true
      if (!supabase.auth) {
        console.warn('Supabase가 설정되지 않았습니다.')
        return null
      }

      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        console.error('Error getting user:', userError)
        error.value = userError.message
        return null
      }

      user.value = currentUser
      return currentUser
    } catch (err) {
      console.error('Error in getCurrentUser:', err)
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  // 현재 세션 가져오기
  const getCurrentSession = async (force = false) => {
    if (!force && session.value) {
      return session.value
    }

    try {
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        console.error('Error getting session:', sessionError)
        error.value = sessionError.message
        return null
      }
      session.value = currentSession
      return currentSession
    } catch (err) {
      console.error('Error in getCurrentSession:', err)
      error.value = err.message
      return null
    }
  }

  // 카카오 로그인
  const signInWithKakao = async () => {
    try {
      loading.value = true
      error.value = null
      
      if (!supabase.auth) {
        error.value = 'Supabase가 설정되지 않았습니다.'
        return
      }

      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: getOAuthRedirectTo(),
          skipBrowserRedirect: Capacitor.isNativePlatform()
        }
      })

      if (Capacitor.isNativePlatform() && data?.url) {
        console.log('[OAuth:kakao] Opening in-app browser:', data.url)
        await Browser.open({ url: data.url, presentationStyle: 'popover' })
      }

      if (signInError) {
        console.error('Kakao sign in error:', signInError)
        error.value = signInError.message
        return
      }

      console.log('Kakao OAuth initiated:', data)
      return data
    } catch (err) {
      console.error('Error in signInWithKakao:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Google 로그인
  const signInWithGoogle = async () => {
    try {
      loading.value = true
      error.value = null
      
      if (!supabase.auth) {
        error.value = 'Supabase가 설정되지 않았습니다.'
        return
      }

      const isNative = Capacitor.isNativePlatform()
      
      // 네이티브 환경에서는 Capgo 플러그인으로 Google 로그인(id_token) 시도
      if (isNative) {
        try {
          const serverClientId = import.meta?.env?.VITE_GOOGLE_WEB_CLIENT_ID
          if (!serverClientId) {
            console.warn('[Auth][Google] VITE_GOOGLE_WEB_CLIENT_ID가 비어있습니다.')
          }
          
          const loginResult = await SocialLogin.signIn({ 
            provider: 'google', 
            serverClientId 
          })
          
          const idToken = loginResult?.idToken || loginResult?.token || loginResult?.credential?.idToken
          
          if (idToken) {
            console.log('[Capgo][google] idToken 획득, Supabase와 교환 시도')
            const { data: signInData, error: idTokenErr } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: idToken
            })
            
            if (idTokenErr) {
              console.error('[Supabase] signInWithIdToken 실패:', idTokenErr)
              error.value = idTokenErr.message
              return null
            }
            
            console.log('[Supabase] signInWithIdToken 성공:', signInData?.user?.id)
            user.value = signInData?.user || null
            session.value = signInData?.session || null
            return signInData
          }
        } catch (nativeErr) {
          console.warn('[Capgo][google] 네이티브 로그인 실패, OAuth로 폴백:', nativeErr)
        }
      }

      // 웹 또는 네이티브 실패 시: Supabase OAuth(PKCE)로 진행
      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getOAuthRedirectTo(),
          skipBrowserRedirect: isNative
        }
      })

      if (isNative && data?.url) {
        console.log('[OAuth:google] Opening in-app browser:', data.url)
        await Browser.open({ url: data.url, presentationStyle: 'popover' })
      }

      if (signInError) {
        console.error('Google sign in error:', signInError)
        error.value = signInError.message
        return null
      }

      console.log('Google OAuth initiated:', data)
      return data
    } catch (err) {
      console.error('Error in signInWithGoogle:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // 로그아웃
  const signOut = async () => {
    try {
      loading.value = true
      error.value = null
      
      if (!supabase.auth) {
        error.value = 'Supabase가 설정되지 않았습니다.'
        return
      }

      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) {
        console.error('Sign out error:', signOutError)
        error.value = signOutError.message
        return
      }

      user.value = null
      session.value = null
      console.log('로그아웃 완료')
    } catch (err) {
      console.error('Error in signOut:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // 인증 상태 변경 리스너
  const setupAuthListener = () => {
    if (!supabase.auth) {
      console.warn('Supabase가 설정되지 않았습니다.')
      return null
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event)
        if (event === 'SIGNED_IN' && session) {
          user.value = session.user
          session.value = session
        } else if (event === 'SIGNED_OUT') {
          user.value = null
          session.value = null
        }
        loading.value = false
      }
    )
    return subscription
  }

  // 초기화
  const initAuth = async () => {
    setupAuthListener()
    await getCurrentUser()
  }

  return {
    user,
    session,
    loading,
    error,
    isAuthenticated,
    isGuest,
    getCurrentUser,
    getCurrentSession,
    signInWithKakao,
    signInWithGoogle,
    signOut,
    setupAuthListener,
    initAuth
  }
})

