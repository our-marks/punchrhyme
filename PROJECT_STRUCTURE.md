# 프로젝트 구조

\`\`\`
auth-template/
├── 📄 README.md                     # 프로젝트 개요 및 메인 문서
├── 📄 QUICKSTART.md                 # 5분 빠른 시작 가이드
├── 📄 LOCAL_AUTH_SETUP.md           # 상세 OAuth 설정 가이드
├── 📄 HOW_TO_USE.md                 # 템플릿 사용 및 커스터마이징 가이드
├── 📄 PROJECT_STRUCTURE.md          # 이 파일
│
├── 📄 package.json                  # NPM 의존성 및 스크립트
├── 📄 vite.config.js                # Vite 빌드 설정
├── 📄 capacitor.config.ts           # Capacitor 네이티브 앱 설정
├── 📄 index.html                    # HTML 엔트리 포인트
├── 📄 env.example                   # 환경 변수 예시
├── 📄 .gitignore                    # Git 무시 파일 목록
│
├── 📁 src/
│   ├── 📄 App.vue                   # 루트 Vue 컴포넌트
│   ├── 📄 main.js                   # 앱 엔트리 포인트 (Pinia, Router 설정)
│   │
│   ├── 📁 lib/
│   │   └── 📄 supabase.js           # Supabase 클라이언트 싱글톤
│   │
│   ├── 📁 stores/
│   │   └── 📄 auth.js               # 인증 상태 관리 (Pinia)
│   │                                 # - 로그인/로그아웃
│   │                                 # - 세션 관리
│   │                                 # - OAuth 플로우
│   │
│   ├── 📁 components/
│   │   ├── 📄 LoginModal.vue        # 로그인 모달 컴포넌트
│   │   └── 📄 UserModal.vue         # 사용자 정보 모달 컴포넌트
│   │
│   ├── 📁 views/
│   │   ├── 📄 IntroView.vue         # 인트로/로그인 페이지
│   │   ├── 📄 HomeView.vue          # 홈 페이지 (인증 필요)
│   │   └── 📄 AuthCallback.vue      # OAuth 콜백 페이지
│   │
│   ├── 📁 router/
│   │   └── 📄 index.js              # Vue Router 설정
│   │                                 # - 라우트 정의
│   │                                 # - 인증 가드
│   │
│   └── 📁 assets/
│       └── 📄 main.css              # 전역 CSS 스타일
│
└── 📁 public/
    └── favicon.ico                  # 파비콘 (선택사항)
\`\`\`

## 주요 파일 설명

### 설정 파일

| 파일 | 용도 |
|------|------|
| \`package.json\` | NPM 의존성, 스크립트, 프로젝트 메타데이터 |
| \`vite.config.js\` | Vite 빌드 도구 설정 (alias, 플러그인) |
| \`capacitor.config.ts\` | 네이티브 앱 빌드 설정 (앱 ID, 이름, 스킴) |
| \`env.example\` | 환경 변수 템플릿 (실제 .env.local로 복사) |

### 핵심 파일

#### 1. 인증 관련
- **\`src/lib/supabase.js\`**: Supabase 클라이언트 생성 및 설정
- **\`src/stores/auth.js\`**: 인증 상태 및 로직 관리 (Pinia store)
- **\`src/router/index.js\`**: 라우트 가드로 인증 확인

#### 2. 컴포넌트
- **\`src/components/LoginModal.vue\`**: Google/Kakao 로그인 UI
- **\`src/components/UserModal.vue\`**: 사용자 정보 표시 및 로그아웃

#### 3. 페이지 (Views)
- **\`src/views/IntroView.vue\`**: 랜딩/로그인 페이지
- **\`src/views/HomeView.vue\`**: 로그인 후 메인 페이지
- **\`src/views/AuthCallback.vue\`**: OAuth 콜백 처리 페이지

## 데이터 흐름

\`\`\`
1. 사용자가 로그인 버튼 클릭
   ↓
2. auth.signInWithGoogle() 호출
   ↓
3. Supabase OAuth URL 생성
   ↓
4. 웹: 브라우저 리다이렉트
   네이티브: In-App Browser 열기
   ↓
5. Google/Kakao 인증 완료
   ↓
6. /auth/callback으로 리다이렉트
   ↓
7. AuthCallback.vue에서 토큰 처리
   ↓
8. auth store에 사용자 정보 저장
   ↓
9. /home으로 리다이렉트
   ↓
10. HomeView.vue 표시
\`\`\`

## 인증 가드 흐름

\`\`\`
사용자가 페이지 이동 시도
   ↓
router.beforeEach() 실행
   ↓
페이지가 requiresAuth: true인가?
   ├─ Yes → 인증 확인
   │         ├─ 인증됨 → 페이지 표시
   │         └─ 미인증 → /intro로 리다이렉트
   │
   └─ No → 페이지 표시
\`\`\`

## 주요 의존성

### 필수 의존성
- **vue**: Vue.js 프레임워크 (v3.5+)
- **vue-router**: SPA 라우팅 (v4.5+)
- **pinia**: 상태 관리 (v3.0+)
- **@supabase/supabase-js**: Supabase 클라이언트 (v2.52+)

### Capacitor (네이티브 앱용)
- **@capacitor/core**: Capacitor 코어
- **@capacitor/app**: 앱 라이프사이클 및 딥링크
- **@capacitor/browser**: In-App Browser
- **@capacitor/status-bar**: 상태바 제어
- **@capacitor/toast**: 토스트 알림
- **@capgo/capacitor-social-login**: 네이티브 소셜 로그인

### 개발 의존성
- **vite**: 빌드 도구
- **@vitejs/plugin-vue**: Vue 3 Vite 플러그인

## 환경 변수

| 변수 | 설명 | 필수 |
|------|------|------|
| \`VITE_SUPABASE_URL\` | Supabase 프로젝트 URL | ✅ |
| \`VITE_SUPABASE_ANON_KEY\` | Supabase anon 키 | ✅ |
| \`VITE_GOOGLE_WEB_CLIENT_ID\` | Google Web Client ID (네이티브용) | 선택 |

## 스크립트

| 명령어 | 설명 |
|--------|------|
| \`npm run dev\` | 개발 서버 실행 (http://localhost:5173) |
| \`npm run build\` | 프로덕션 빌드 (dist/ 생성) |
| \`npm run preview\` | 빌드 미리보기 |

## 브라우저 지원

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)
- 모바일 브라우저 (iOS Safari, Chrome Mobile)

## 네이티브 플랫폼 지원

- iOS 13.0+
- Android 6.0+ (API 23+)

## 보안 고려사항

### 환경 변수
- \`.env.local\` 파일은 Git에 커밋하지 않음
- \`VITE_\` 접두사가 붙은 변수만 클라이언트에 노출됨
- Service Role 키는 절대 클라이언트 코드에 포함하지 않음

### Supabase RLS
- 모든 데이터베이스 테이블에 RLS (Row Level Security) 적용
- \`auth.uid()\`를 사용하여 사용자별 데이터 접근 제어

### OAuth
- PKCE 플로우 사용 (Authorization Code with Proof Key for Code Exchange)
- State 매개변수로 CSRF 공격 방지

## 확장 가능성

### 새 OAuth 프로바이더 추가
1. \`src/stores/auth.js\`에 \`signInWith<Provider>\` 메서드 추가
2. Supabase Dashboard에서 프로바이더 활성화
3. \`src/components/LoginModal.vue\`에 버튼 추가

### 새 페이지 추가
1. \`src/views/\`에 새 Vue 컴포넌트 생성
2. \`src/router/index.js\`에 라우트 추가
3. 필요시 \`meta: { requiresAuth: true }\` 추가

### 데이터베이스 연동
1. Supabase Dashboard에서 테이블 생성
2. RLS 정책 설정
3. Pinia store 생성하여 데이터 관리

### UI 커스터마이징
1. \`src/assets/main.css\`에서 CSS 변수 수정
2. 개별 컴포넌트의 \`<style>\` 섹션 수정
3. Tailwind CSS 등 UI 라이브러리 추가 가능

## 성능 최적화

### 이미 적용된 최적화
- ✅ 코드 스플리팅 (Vue Router 자동)
- ✅ Tree shaking (Vite 기본)
- ✅ 싱글톤 패턴 (Supabase 클라이언트)
- ✅ Lazy loading (필요시 추가 가능)

### 추가 최적화 가능
- 이미지 최적화 (WebP, lazy loading)
- CDN 사용
- 서비스 워커 (PWA)
- 번들 분석 및 최적화

## 배포 옵션

### 웹 호스팅
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting
- Supabase Hosting

### 네이티브 앱 스토어
- iOS App Store
- Google Play Store

## 라이센스

MIT - 자유롭게 사용, 수정, 배포 가능

