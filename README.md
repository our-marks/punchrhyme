# Vue 3 + Supabase OAuth 인증 템플릿

Vue 3와 Supabase를 사용한 OAuth 소셜 로그인 기능을 제공하는 템플릿입니다.

## 주요 기능

- ✅ Google OAuth 로그인
- ✅ Kakao OAuth 로그인
- ✅ 웹 + 네이티브(iOS/Android) 지원
- ✅ Capacitor 기반 모바일 앱 지원
- ✅ JWT 기반 인증 관리
- ✅ 라우터 가드를 통한 보호된 페이지
- ✅ Pinia를 사용한 상태 관리

## 기술 스택

- **Vue 3** - Composition API
- **Supabase** - OAuth 및 인증
- **Pinia** - 상태 관리
- **Vue Router** - 라우팅
- **Capacitor** - 네이티브 앱 빌드
- **Vite** - 빌드 도구

## 시작하기

### 1. 의존성 설치

\`\`\`bash
npm install
\`\`\`

### 2. 환경 변수 설정

프로젝트 루트에 \`.env.local\` 파일을 생성하고 다음 내용을 추가하세요:

\`\`\`bash
# Supabase 설정
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth (네이티브 앱용)
VITE_GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
\`\`\`

자세한 설정 방법은 \`LOCAL_AUTH_SETUP.md\`를 참고하세요.

### 3. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

### 4. 프로덕션 빌드

\`\`\`bash
npm run build
\`\`\`

### 5. 네이티브 앱 빌드 (선택사항)

#### iOS
\`\`\`bash
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
\`\`\`

#### Android
\`\`\`bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
\`\`\`

## 프로젝트 구조

\`\`\`
auth-template/
├── src/
│   ├── lib/
│   │   └── supabase.js          # Supabase 클라이언트 설정
│   ├── stores/
│   │   └── auth.js              # 인증 상태 관리 (Pinia)
│   ├── components/
│   │   ├── LoginModal.vue       # 로그인 모달
│   │   └── UserModal.vue        # 유저 정보 모달
│   ├── views/
│   │   ├── IntroView.vue        # 인트로/로그인 페이지
│   │   ├── HomeView.vue         # 홈 페이지 (인증 필요)
│   │   └── AuthCallback.vue     # OAuth 콜백 페이지
│   ├── router/
│   │   └── index.js             # 라우터 설정 및 가드
│   ├── assets/
│   │   └── main.css             # 전역 스타일
│   ├── App.vue                  # 루트 컴포넌트
│   └── main.js                  # 앱 엔트리 포인트
├── public/
│   └── favicon.ico
├── capacitor.config.ts          # Capacitor 설정
├── package.json
├── vite.config.js
├── .env.example                 # 환경 변수 예시
└── LOCAL_AUTH_SETUP.md          # 상세 설정 가이드
\`\`\`

## 사용 방법

### 인증 상태 확인

\`\`\`vue
<script setup>
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const auth = useAuthStore()
const { user, isAuthenticated, loading } = storeToRefs(auth)
</script>

<template>
  <div v-if="isAuthenticated">
    <p>환영합니다, {{ user.email }}님!</p>
  </div>
</template>
\`\`\`

### 로그인/로그아웃

\`\`\`vue
<script setup>
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const handleGoogleLogin = async () => {
  await auth.signInWithGoogle()
}

const handleKakaoLogin = async () => {
  await auth.signInWithKakao()
}

const handleLogout = async () => {
  await auth.signOut()
}
</script>
\`\`\`

### 보호된 페이지 (라우터 가드)

\`\`\`javascript
// router/index.js에서 설정
{
  path: '/protected',
  component: ProtectedView,
  meta: { requiresAuth: true }
}
\`\`\`

## Supabase 설정

### 1. Supabase 프로젝트 생성
1. [Supabase Dashboard](https://supabase.com/dashboard)에서 새 프로젝트 생성
2. Project URL과 anon key 복사

### 2. OAuth 프로바이더 설정

#### Google OAuth
1. Supabase Dashboard > Authentication > Providers > Google
2. Google Cloud Console에서 OAuth 2.0 클라이언트 ID 생성
3. 승인된 리디렉션 URI에 다음 추가:
   - 웹: \`http://localhost:5173/auth/callback\`
   - Supabase: \`https://your-project.supabase.co/auth/v1/callback\`
   - 네이티브: \`yourapp://auth/callback\`

#### Kakao OAuth
1. Supabase Dashboard > Authentication > Providers > Kakao
2. Kakao Developers에서 앱 생성 및 REST API 키 발급
3. 리디렉션 URI 설정

자세한 내용은 \`LOCAL_AUTH_SETUP.md\`를 참고하세요.

## 커스터마이징

### 1. 앱 이름 및 ID 변경
- \`capacitor.config.ts\`에서 \`appId\`와 \`appName\` 수정
- \`package.json\`에서 \`name\` 수정

### 2. 라우트 추가
- \`src/router/index.js\`에서 새로운 라우트 추가
- \`meta: { requiresAuth: true }\` 추가하면 인증 필요한 페이지로 설정

### 3. 추가 OAuth 프로바이더
- \`src/stores/auth.js\`에 새로운 로그인 메서드 추가
- Supabase에서 해당 프로바이더 활성화

## 문제 해결

### 인증이 작동하지 않는 경우
1. \`.env.local\` 파일이 올바르게 설정되었는지 확인
2. Supabase 프로젝트의 URL과 키가 정확한지 확인
3. OAuth 리디렉션 URI가 올바르게 설정되었는지 확인
4. 브라우저 콘솔에서 에러 메시지 확인

### 네이티브 앱에서 OAuth가 작동하지 않는 경우
1. Capacitor 설정이 올바른지 확인
2. 앱의 딥링크 스킴이 설정되었는지 확인
3. OAuth 프로바이더에 네이티브 리디렉션 URI가 등록되었는지 확인

자세한 문제 해결 방법은 \`LOCAL_AUTH_SETUP.md\`를 참고하세요.

## 라이센스

MIT

## 기여

이 템플릿은 실제 프로젝트에서 추출한 검증된 코드를 기반으로 합니다.

