# OAuth 인증 설정 가이드

이 문서는 Vue 3 + Supabase OAuth 템플릿의 인증 기능을 설정하는 방법을 설명합니다.

## 1. Supabase 프로젝트 생성

### 1.1 Supabase 계정 생성 및 프로젝트 생성
1. [Supabase](https://supabase.com)에 접속하여 계정 생성
2. 대시보드에서 "New Project" 클릭
3. 프로젝트 이름, 데이터베이스 비밀번호 설정
4. 리전 선택 (한국의 경우 Northeast Asia (Tokyo) 권장)
5. 프로젝트 생성 완료 대기 (1-2분 소요)

### 1.2 프로젝트 URL과 API 키 확인
1. Supabase 대시보드에서 프로젝트 선택
2. Settings > API 메뉴 이동
3. 다음 정보 복사:
   - `Project URL`
   - `anon public` 키

## 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가:

\`\`\`bash
# Supabase 설정
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key_here

# Google OAuth (네이티브 앱용 - 선택사항)
VITE_GOOGLE_WEB_CLIENT_ID=your_google_web_client_id_here
\`\`\`

## 3. OAuth 프로바이더 설정

### 3.1 Google OAuth 설정

#### Google Cloud Console 설정
1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 프로젝트 생성 (또는 기존 프로젝트 선택)
3. "APIs & Services" > "Credentials" 메뉴 이동
4. "Create Credentials" > "OAuth 2.0 Client IDs" 선택
5. Application type: "Web application" 선택
6. Authorized redirect URIs에 다음 추가:
   ```
   # 로컬 개발
   http://localhost:5173/auth/callback
   
   # Supabase 콜백
   https://your-project-id.supabase.co/auth/v1/callback
   
   # 프로덕션 (실제 도메인으로 변경)
   https://yourdomain.com/auth/callback
   
   # 네이티브 앱 (선택사항)
   yourapp://auth/callback
   ```
7. Client ID와 Client Secret 복사

#### Supabase에 Google OAuth 설정
1. Supabase Dashboard > Authentication > Providers
2. Google 프로바이더 선택
3. "Enable Sign in with Google" 활성화
4. Client ID와 Client Secret 입력
5. 저장

### 3.2 Kakao OAuth 설정

#### Kakao Developers 설정
1. [Kakao Developers](https://developers.kakao.com) 접속
2. "내 애플리케이션" > "애플리케이션 추가하기"
3. 앱 이름 입력하고 생성
4. "앱 설정" > "플랫폼" 메뉴에서 "Web" 추가
5. 사이트 도메인 등록:
   ```
   http://localhost:5173 (개발용)
   https://yourdomain.com (프로덕션)
   ```
6. "제품 설정" > "카카오 로그인" 메뉴
7. "Redirect URI" 등록:
   ```
   # Supabase 콜백
   https://your-project-id.supabase.co/auth/v1/callback
   ```
8. "동의항목" 설정:
   - 카카오계정(이메일) - 필수 동의
   - 프로필 정보(닉네임/프로필 사진) - 선택 동의
9. "앱 키" 메뉴에서 REST API 키 복사

#### Supabase에 Kakao OAuth 설정
1. Supabase Dashboard > Authentication > Providers
2. Kakao 프로바이더 선택
3. "Enable Sign in with Kakao" 활성화
4. Client ID (REST API 키) 입력
5. 저장

## 4. 네이티브 앱 설정 (선택사항)

### 4.1 딥링크 스킴 설정
템플릿에서 기본 딥링크 스킴은 `yourapp://`입니다. 실제 앱 스킴으로 변경하세요:

#### 변경할 파일들:
1. `capacitor.config.ts`: `appId` 변경
2. `src/stores/auth.js`: `getOAuthRedirectTo()` 함수의 딥링크 스킴 변경
3. `src/main.js`: `appUrlOpen` 리스너의 딥링크 스킴 변경

예시:
\`\`\`javascript
// 변경 전
'yourapp://auth/callback'

// 변경 후
'myapp://auth/callback'
\`\`\`

### 4.2 Google OAuth (네이티브)
1. Google Cloud Console에서 "OAuth 2.0 Client IDs" 추가 생성
2. Application type: "Android" 또는 "iOS" 선택
3. Package name / Bundle ID 입력
4. SHA-1 인증서 지문 등록 (Android)
5. Client ID를 `.env.local`의 `VITE_GOOGLE_WEB_CLIENT_ID`에 입력

### 4.3 iOS 설정
\`\`\`xml
<!-- ios/App/App/Info.plist -->
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>yourapp</string>
    </array>
  </dict>
</array>
\`\`\`

### 4.4 Android 설정
\`\`\`xml
<!-- android/app/src/main/AndroidManifest.xml -->
<activity>
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="yourapp" />
  </intent-filter>
</activity>
\`\`\`

## 5. 개발 서버 실행

\`\`\`bash
npm install
npm run dev
\`\`\`

브라우저에서 `http://localhost:5173`으로 접속하여 테스트

## 6. 문제 해결

### 인증이 작동하지 않는 경우

#### 환경 변수 확인
\`\`\`bash
# 브라우저 콘솔에서 확인
console.log(import.meta.env.VITE_SUPABASE_URL)
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
\`\`\`

#### Redirect URI 확인
- Supabase Dashboard의 Redirect URI 설정 확인
- OAuth 프로바이더(Google/Kakao)의 Redirect URI 설정 확인
- 정확히 일치하는지 확인 (후행 슬래시 포함)

#### CORS 오류
- Supabase Dashboard > Authentication > URL Configuration
- Site URL과 Redirect URLs에 개발/프로덕션 URL 추가

### 네이티브 앱에서 OAuth가 작동하지 않는 경우

#### 딥링크 스킴 확인
- iOS: `Info.plist`에 스킴이 올바르게 등록되었는지 확인
- Android: `AndroidManifest.xml`에 intent-filter가 올바르게 설정되었는지 확인

#### OAuth 프로바이더 설정 확인
- Google: 네이티브 플랫폼용 Client ID가 생성되었는지 확인
- Kakao: 네이티브 플랫폼이 등록되었는지 확인

#### 로그 확인
\`\`\`bash
# iOS
npx cap open ios
# Xcode에서 실행 후 Console 확인

# Android
npx cap open android
# Android Studio에서 실행 후 Logcat 확인
\`\`\`

## 7. 프로덕션 배포

### 7.1 환경 변수 설정
프로덕션 환경에 `.env.local`의 내용을 환경 변수로 설정

### 7.2 Supabase URL 설정
1. Supabase Dashboard > Authentication > URL Configuration
2. Site URL: 프로덕션 도메인 입력
3. Redirect URLs: 프로덕션 콜백 URL 추가

### 7.3 OAuth 프로바이더 설정 업데이트
- Google: Authorized redirect URIs에 프로덕션 URL 추가
- Kakao: Redirect URI에 프로덕션 URL 추가

## 8. 보안 고려사항

### 환경 변수 관리
- `.env.local` 파일은 절대 Git에 커밋하지 마세요
- `.gitignore`에 `.env.local`이 포함되어 있는지 확인
- 프로덕션 환경 변수는 안전하게 관리

### API 키 보호
- `VITE_SUPABASE_ANON_KEY`는 공개 키이므로 브라우저에 노출되어도 괜찮습니다
- 중요한 작업은 Supabase의 RLS(Row Level Security)로 보호하세요
- Service Role 키는 절대 클라이언트 코드에 포함하지 마세요

### RLS(Row Level Security) 설정
Supabase 데이터베이스의 테이블에 RLS 정책을 설정하여 데이터 보안 강화:

\`\`\`sql
-- 예시: 사용자별 데이터 접근 제한
CREATE POLICY "Users can view own data" 
ON your_table
FOR ALL 
USING (auth.uid() = user_id);
\`\`\`

## 9. 추가 리소스

- [Supabase 문서](https://supabase.com/docs)
- [Google OAuth 설정](https://developers.google.com/identity/protocols/oauth2)
- [Kakao OAuth 설정](https://developers.kakao.com/docs/latest/ko/kakaologin/common)
- [Capacitor 문서](https://capacitorjs.com/docs)
- [Vue 3 문서](https://vuejs.org/)

