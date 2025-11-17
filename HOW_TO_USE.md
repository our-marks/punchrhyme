# 템플릿 사용 방법

이 템플릿을 사용하여 새로운 프로젝트를 시작하는 방법입니다.

## 새 프로젝트 생성하기

### 방법 1: 템플릿 복사

\`\`\`bash
# 템플릿 디렉토리를 새 프로젝트로 복사
cp -r auth-template my-new-project
cd my-new-project

# Git 초기화
rm -rf .git  # 기존 git 히스토리 제거 (있다면)
git init
git add .
git commit -m "Initial commit from OAuth template"
\`\`\`

### 방법 2: GitHub에서 사용

1. 이 템플릿을 GitHub에 업로드
2. "Use this template" 버튼으로 새 저장소 생성
3. 클론하여 사용

## 커스터마이징 체크리스트

### 1. 앱 기본 정보 변경

#### package.json
\`\`\`json
{
  "name": "my-awesome-app",
  "description": "My awesome app description",
  "version": "1.0.0"
}
\`\`\`

#### capacitor.config.ts
\`\`\`typescript
const config: CapacitorConfig = {
  appId: 'com.mycompany.myapp',
  appName: 'My Awesome App',
  // ...
};
\`\`\`

#### index.html
\`\`\`html
<title>My Awesome App</title>
\`\`\`

### 2. 딥링크 스킴 변경 (네이티브 앱용)

기본 스킴 \`yourapp://\`을 실제 앱 스킴으로 변경하세요.

#### src/stores/auth.js
\`\`\`javascript
const getOAuthRedirectTo = () => {
  const redirect = isNative
    ? 'myapp://auth/callback'  // 변경
    : \`\${window.location.origin}/auth/callback\`
  return redirect
}
\`\`\`

#### src/main.js
\`\`\`javascript
if (!url.startsWith('myapp://auth/callback')) {  // 변경
  return
}
\`\`\`

### 3. 브랜딩 및 스타일링

#### 색상 테마 변경
\`src/assets/main.css\`에서 CSS 변수 수정:

\`\`\`css
:root {
  --primary-color: #your-primary-color;
  --secondary-color: #your-secondary-color;
  /* ... */
}
\`\`\`

#### 인트로 페이지 수정
\`src/views/IntroView.vue\`에서 텍스트와 스타일 변경

### 4. 라우트 추가

\`src/router/index.js\`에 새 라우트 추가:

\`\`\`javascript
{
  path: '/profile',
  name: 'profile',
  component: ProfileView,
  meta: { 
    requiresAuth: true,  // 인증 필요한 페이지
    title: '프로필'
  }
}
\`\`\`

### 5. 추가 OAuth 프로바이더

#### src/stores/auth.js에 새 메서드 추가
\`\`\`javascript
const signInWithGitHub = async () => {
  try {
    loading.value = true
    error.value = null
    
    const { data, error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: getOAuthRedirectTo(),
        skipBrowserRedirect: Capacitor.isNativePlatform()
      }
    })
    
    // 네이티브 처리...
  } catch (err) {
    console.error('Error in signInWithGitHub:', err)
  }
}
\`\`\`

#### Supabase에서 프로바이더 활성화
1. Dashboard > Authentication > Providers
2. 원하는 프로바이더 선택 및 설정

### 6. 데이터베이스 테이블 추가

Supabase Dashboard에서 테이블 생성:

\`\`\`sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 정책 추가
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);
\`\`\`

## 개발 워크플로우

### 로컬 개발

\`\`\`bash
# 개발 서버 실행
npm run dev

# 브라우저 자동 리로드 활성화
# vite.config.js에 이미 설정되어 있음
\`\`\`

### 프로덕션 빌드

\`\`\`bash
# 빌드
npm run build

# 로컬에서 빌드 테스트
npm run preview
\`\`\`

### 네이티브 앱 개발

\`\`\`bash
# iOS
npm run build
npx cap sync ios
npx cap open ios

# Android
npm run build
npx cap sync android
npx cap open android
\`\`\`

## 배포

### 웹 배포

#### Netlify
1. GitHub 저장소 연결
2. Build command: \`npm run build\`
3. Publish directory: \`dist\`
4. 환경 변수 설정
5. Deploy

#### Vercel
1. GitHub 저장소 연결
2. Framework Preset: Vite
3. 환경 변수 설정
4. Deploy

### 앱 스토어 배포

#### iOS App Store
1. Xcode에서 프로젝트 열기
2. Signing & Capabilities 설정
3. Archive 생성
4. App Store Connect에 업로드
5. 앱 정보 입력 및 제출

#### Google Play Store
1. Android Studio에서 프로젝트 열기
2. Build > Generate Signed Bundle / APK
3. 키스토어 생성 및 서명
4. AAB 파일 생성
5. Google Play Console에 업로드
6. 앱 정보 입력 및 제출

## 유용한 팁

### 개발자 도구

\`\`\`bash
# Vue Devtools 설치
# Chrome/Firefox 확장 프로그램 설치

# Vite 성능 모니터링
npm run dev -- --debug
\`\`\`

### 디버깅

\`\`\`javascript
// 인증 상태 확인
const auth = useAuthStore()
console.log('User:', auth.user)
console.log('Session:', auth.session)
console.log('Is Authenticated:', auth.isAuthenticated)

// Supabase 요청 로그
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event)
  console.log('Session:', session)
})
\`\`\`

### 성능 최적화

1. **코드 스플리팅**
   \`\`\`javascript
   // 라우트 레벨 코드 스플리팅
   const ProfileView = () => import('./views/ProfileView.vue')
   \`\`\`

2. **이미지 최적화**
   - WebP 포맷 사용
   - Lazy loading 적용
   - 적절한 크기로 리사이즈

3. **번들 크기 최적화**
   \`\`\`bash
   # 번들 분석
   npm run build -- --analyze
   \`\`\`

## 참고 자료

- [Vue 3 문서](https://vuejs.org/)
- [Supabase 문서](https://supabase.com/docs)
- [Capacitor 문서](https://capacitorjs.com/docs)
- [Vite 문서](https://vitejs.dev/)
- [Pinia 문서](https://pinia.vuejs.org/)

## 라이센스

이 템플릿은 자유롭게 사용, 수정, 배포할 수 있습니다.

