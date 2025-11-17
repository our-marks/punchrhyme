# 빠른 시작 가이드

이 템플릿을 5분 안에 실행해보세요!

## 1단계: 의존성 설치 (1분)

\`\`\`bash
npm install
\`\`\`

## 2단계: Supabase 프로젝트 생성 (2분)

1. [Supabase](https://supabase.com)에 접속하여 계정 생성 (이미 있다면 로그인)
2. "New Project" 클릭
3. 프로젝트 이름과 비밀번호 입력 (비밀번호는 나중에 필요할 수 있으니 기억해두세요)
4. 리전 선택 (한국은 Tokyo 권장)
5. 프로젝트 생성 대기 (1-2분)

## 3단계: 환경 변수 설정 (1분)

### 3.1 Supabase URL과 API 키 복사
1. Supabase 대시보드에서 프로젝트 선택
2. Settings > API 메뉴 이동
3. "Project URL"과 "anon public" 키 복사

### 3.2 .env.local 파일 생성
프로젝트 루트에 \`.env.local\` 파일 생성:

\`\`\`bash
cp env.example .env.local
\`\`\`

\`.env.local\` 파일을 열어서 복사한 값들을 입력:

\`\`\`bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key_here
\`\`\`

## 4단계: Google OAuth 설정 (1분)

### 4.1 Google Cloud Console 설정
1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 프로젝트 생성 (이름은 자유롭게)
3. "APIs & Services" > "Credentials" 이동
4. "Create Credentials" > "OAuth 2.0 Client IDs" 선택
5. "Configure Consent Screen" 먼저 설정:
   - User Type: External 선택
   - App name, User support email, Developer email 입력
   - 저장 후 계속
6. Application type: "Web application" 선택
7. Authorized redirect URIs에 추가:
   \`\`\`
   http://localhost:5173/auth/callback
   https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback
   \`\`\`
8. Client ID와 Client Secret 복사

### 4.2 Supabase에 Google 연동
1. Supabase Dashboard > Authentication > Providers
2. Google 선택
3. "Enable Sign in with Google" 켜기
4. Client ID와 Client Secret 붙여넣기
5. 저장

### 4.3 Site URL 설정
1. Supabase Dashboard > Authentication > URL Configuration
2. Site URL: \`http://localhost:5173\` 입력
3. Redirect URLs에 \`http://localhost:5173/**\` 추가
4. 저장

## 5단계: 개발 서버 실행 (10초)

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 http://localhost:5173 접속!

## 🎉 완료!

이제 "Google로 로그인" 버튼을 클릭하여 OAuth 인증을 테스트할 수 있습니다.

## 다음 단계

- ✅ 로그인 테스트 완료했나요?
- 📖 [LOCAL_AUTH_SETUP.md](./LOCAL_AUTH_SETUP.md)에서 Kakao OAuth 설정 방법 확인
- 🔧 [README.md](./README.md)에서 커스터마이징 방법 확인
- 📱 네이티브 앱으로 빌드하고 싶다면 Capacitor 설정 확인

## 문제가 발생했나요?

### 로그인이 작동하지 않는 경우

1. **환경 변수 확인**
   - \`.env.local\` 파일이 프로젝트 루트에 있나요?
   - 값들이 올바르게 입력되었나요?
   - 개발 서버를 재시작해보세요 (\`Ctrl+C\` 후 \`npm run dev\`)

2. **Redirect URI 확인**
   - Google Cloud Console의 Redirect URI가 정확한가요?
   - Supabase의 Site URL이 설정되었나요?
   - 브라우저 콘솔에서 에러 메시지 확인

3. **브라우저 콘솔 확인**
   - F12를 눌러 개발자 도구 열기
   - Console 탭에서 에러 메시지 확인
   - 빨간색 에러가 있다면 메시지를 읽어보세요

### 여전히 문제가 있나요?

1. 브라우저 콘솔의 에러 메시지 캡처
2. \`.env.local\` 파일 내용 확인 (민감한 정보 제외)
3. [Supabase Discord](https://discord.supabase.com) 또는 GitHub Issues에 질문

## 유용한 명령어

\`\`\`bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# iOS 앱 빌드 (선택사항)
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios

# Android 앱 빌드 (선택사항)
npm run build
npx cap add android
npx cap sync android
npx cap open android
\`\`\`

Happy coding! 🚀

