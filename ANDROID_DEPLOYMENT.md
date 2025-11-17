# 안드로이드 앱 출시 가이드 (Google Play Console)

Vue + Capacitor 앱을 Google Play Store에 출시하는 전체 과정을 단계별로 설명합니다.

## 📋 준비사항 체크리스트

- [ ] Google Play Console 개발자 계정 (일회성 $25 등록비 필요)
- [ ] 앱 아이콘 (512x512px, PNG)
- [ ] 스크린샷 (최소 2개, 각 화면 크기별)
- [ ] 앱 설명 및 마케팅 자료
- [ ] 개인정보처리방침 URL
- [ ] Java JDK 17 이상 설치
- [ ] Android Studio 설치

---

## 1단계: 앱 빌드 준비

### 1.1 프로젝트 설정 확인

#### capacitor.config.ts 수정
```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.yourapp',  // 고유한 앱 ID로 변경
  appName: 'Your App Name',          // 앱 이름으로 변경
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    cleartext: false
  },
  android: {
    allowMixedContent: false
  }
};

export default config;
```

#### package.json 버전 확인
```json
{
  "name": "your-app",
  "version": "1.0.0",  // 버전 번호 확인
  "description": "Your app description"
}
```

### 1.2 환경 변수 프로덕션 설정

`.env.production` 파일 생성:
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_GOOGLE_WEB_CLIENT_ID=your_production_google_client_id
```

### 1.3 앱 아이콘 및 스플래시 스크린 준비

```bash
# 프로젝트 루트에 아이콘 파일 배치
# - icon.png (1024x1024px, 투명 배경 권장)
# - splash.png (2732x2732px, 중앙에 로고)

# Capacitor 에셋 생성 (cordova-res 사용)
npm install -g cordova-res

# 안드로이드 리소스 생성
cordova-res android --skip-config --copy
```

또는 수동으로:
```
android/app/src/main/res/
├── mipmap-hdpi/
│   └── ic_launcher.png (72x72)
├── mipmap-mdpi/
│   └── ic_launcher.png (48x48)
├── mipmap-xhdpi/
│   └── ic_launcher.png (96x96)
├── mipmap-xxhdpi/
│   └── ic_launcher.png (144x144)
└── mipmap-xxxhdpi/
    └── ic_launcher.png (192x192)
```

---

## 2단계: 안드로이드 프로젝트 설정

### 2.1 웹 빌드 및 동기화

```bash
# 프로덕션 빌드
npm run build

# 안드로이드 플랫폼 추가 (처음 한 번만)
npx cap add android

# 안드로이드 프로젝트에 동기화
npx cap sync android
```

### 2.2 Android Studio에서 프로젝트 열기

```bash
npx cap open android
```

### 2.3 안드로이드 매니페스트 수정

`android/app/src/main/AndroidManifest.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="false">

        <activity
            android:name=".MainActivity"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:label="@string/app_name"
            android:launchMode="singleTask"
            android:theme="@style/AppTheme.NoActionBarLaunch"
            android:exported="true">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <!-- 딥링크 설정 (OAuth용) -->
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="yourapp" />
            </intent-filter>

        </activity>

    </application>

    <!-- 권한 설정 -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
</manifest>
```

### 2.4 앱 정보 설정

`android/app/src/main/res/values/strings.xml`:
```xml
<?xml version='1.0' encoding='utf-8'?>
<resources>
    <string name="app_name">Your App Name</string>
    <string name="title_activity_main">Your App Name</string>
    <string name="package_name">com.yourcompany.yourapp</string>
</resources>
```

### 2.5 build.gradle 설정 확인

`android/app/build.gradle`:
```gradle
android {
    namespace "com.yourcompany.yourapp"
    compileSdkVersion 34  // 최신 SDK 버전 사용
    
    defaultConfig {
        applicationId "com.yourcompany.yourapp"
        minSdkVersion 23      // Android 6.0 이상
        targetSdkVersion 34   // 최신 버전 타겟
        versionCode 1         // 빌드 번호 (매 릴리스마다 증가)
        versionName "1.0.0"   // 사용자에게 표시되는 버전
    }
    
    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

---

## 3단계: 키스토어 생성 (서명용)

### 3.1 키스토어 파일 생성

```bash
# 프로젝트 루트에서 실행
keytool -genkey -v -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# 또는 Android Studio에서:
# Build > Generate Signed Bundle / APK > Create new...
```

**중요:** 
- 비밀번호와 alias를 안전하게 보관하세요!
- 키스토어 파일을 잃어버리면 앱 업데이트 불가능
- Git에 절대 커밋하지 마세요!

### 3.2 키스토어 정보 설정

`android/key.properties` 파일 생성:
```properties
storePassword=your_store_password
keyPassword=your_key_password
keyAlias=my-key-alias
storeFile=/path/to/my-release-key.keystore
```

**주의:** 이 파일도 `.gitignore`에 추가하세요!

### 3.3 build.gradle에 서명 설정 추가

`android/app/build.gradle`:
```gradle
def keystorePropertiesFile = rootProject.file("key.properties")
def keystoreProperties = new Properties()
keystoreProperties.load(new FileInputStream(keystorePropertiesFile))

android {
    // ... 기존 설정 ...
    
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

---

## 4단계: 릴리스 APK/AAB 빌드

### 4.1 AAB (Android App Bundle) 생성 - 권장

```bash
# Android Studio에서:
# Build > Generate Signed Bundle / APK
# > Android App Bundle 선택
# > Release 선택
# > 키스토어 정보 입력
# > Finish

# 또는 명령줄:
cd android
./gradlew bundleRelease

# 생성 위치: android/app/build/outputs/bundle/release/app-release.aab
```

### 4.2 APK 생성 (선택사항)

```bash
cd android
./gradlew assembleRelease

# 생성 위치: android/app/build/outputs/apk/release/app-release.apk
```

**AAB vs APK:**
- **AAB (권장)**: Google Play가 기기별 최적화된 APK 자동 생성
- **APK**: 직접 배포용 (테스트, 비공식 배포)

---

## 5단계: Google Play Console 설정

### 5.1 개발자 계정 생성

1. [Google Play Console](https://play.google.com/console) 접속
2. 개발자 계정 생성 ($25 일회성 결제)
3. 신원 확인 및 약관 동의

### 5.2 새 앱 만들기

1. **"앱 만들기"** 클릭
2. 기본 정보 입력:
   - 앱 이름
   - 기본 언어 (한국어)
   - 앱/게임 선택
   - 무료/유료 선택

### 5.3 앱 액세스 권한

- 모든 사용자가 접근 가능한지 설정
- 제한이 있다면 테스트 계정 제공

### 5.4 광고 포함 여부

- 앱에 광고가 포함되어 있는지 선택

### 5.5 콘텐츠 등급

1. **앱 콘텐츠 > 콘텐츠 등급**
2. 설문지 작성
3. 등급 받기

### 5.6 타겟층 및 콘텐츠

- **타겟층**: 연령대 선택
- **뉴스 앱 여부**
- **COVID-19 접촉자 추적/상태 앱 여부**
- **데이터 보안**: 앱이 수집하는 데이터 종류 설명

### 5.7 스토어 설정

#### 앱 카테고리
- 카테고리 선택 (예: 소셜, 생산성, 도구 등)
- 태그 추가 (선택사항)

#### 연락처 정보
- 이메일 주소
- 전화번호 (선택사항)
- 웹사이트 (선택사항)

---

## 6단계: 스토어 등록정보 작성

### 6.1 앱 설명

#### 간단한 설명 (80자 이내)
```
앱의 핵심 기능을 한 줄로 요약
```

#### 자세한 설명 (4000자 이내)
```
앱의 주요 기능:
• 기능 1
• 기능 2
• 기능 3

특징:
- 특징 1
- 특징 2

사용 방법:
1. 단계 1
2. 단계 2
```

### 6.2 그래픽 에셋

#### 필수
- **앱 아이콘**: 512x512px, PNG (투명 배경 없음)
- **주요 그래픽**: 1024x500px, JPG/PNG

#### 스크린샷 (각 카테고리별)
- **휴대전화** (필수): 최소 2개, 권장 8개
  - 크기: 320px ~ 3840px (16:9 비율 권장)
- **7인치 태블릿** (선택): 최소 2개
- **10인치 태블릿** (선택): 최소 2개

**스크린샷 가이드:**
```bash
# Android Studio에서 에뮬레이터 실행
# Tools > Device Manager > Create Device
# Pixel 6 (1080x2400) 등 선택
# 앱 실행 후 스크린샷 촬영

# 또는 실제 기기에서:
# 개발자 옵션 활성화
# USB 디버깅 활성화
# adb shell screencap -p /sdcard/screenshot.png
```

### 6.3 홍보 동영상 (선택사항)

YouTube 링크 추가 가능

---

## 7단계: 개인정보처리방침

### 7.1 개인정보처리방침 URL 필수

앱이 사용자 데이터를 수집하는 경우 필수입니다.

#### 간단한 개인정보처리방침 예시

웹사이트나 GitHub Pages에 호스팅:

```markdown
# 개인정보처리방침

최종 수정일: 2024년 XX월 XX일

## 수집하는 정보
- 이메일 주소 (로그인용)
- 프로필 정보 (선택사항)

## 정보 사용 목적
- 사용자 인증
- 서비스 제공

## 정보 보관 기간
- 회원 탈퇴 시까지

## 제3자 공유
- Google OAuth (인증용)
- Supabase (데이터 저장용)

## 연락처
이메일: your-email@example.com
```

URL 예시:
- `https://yourwebsite.com/privacy-policy`
- `https://yourgithub.io/app-privacy-policy`

---

## 8단계: 앱 릴리스 (프로덕션 트랙)

### 8.1 내부 테스트 (권장 - 선택사항)

1. **프로덕션 > 내부 테스트** 선택
2. 새 릴리스 만들기
3. AAB 파일 업로드
4. 릴리스 이름 입력 (예: "1.0.0 Beta 1")
5. 릴리스 노트 작성
6. 테스터 목록 추가
7. **검토 후 출시**

### 8.2 비공개 테스트 (권장 - 선택사항)

더 많은 테스터와 함께 테스트

### 8.3 공개 테스트 (선택사항)

일반 사용자 대상 베타 테스트

### 8.4 프로덕션 출시

1. **프로덕션 > 프로덕션** 선택
2. **새 릴리스 만들기**
3. AAB 파일 업로드
4. 릴리스 이름 및 노트 작성:

```
버전 1.0.0

새로운 기능:
• OAuth 소셜 로그인
• 사용자 프로필 관리
• 기능 3

개선사항:
• UI/UX 개선
• 성능 최적화
```

5. **출시 국가/지역** 선택
6. **검토 시작** 클릭

---

## 9단계: 심사 대기 및 출시

### 9.1 심사 프로세스

- **심사 시간**: 일반적으로 1-3일 (최대 7일)
- **상태 확인**: Play Console 대시보드에서 확인
- **알림**: 이메일로 심사 결과 통지

### 9.2 심사 거부 시 대응

거부 사유를 확인하고 수정:
1. 거부 이유 읽기
2. 앱 수정
3. 새 버전 빌드 (`versionCode` 증가)
4. 재제출

### 9.3 출시 후

심사 승인되면:
- 몇 시간 내 Play Store에 표시
- 검색 가능까지 최대 24시간 소요

---

## 10단계: 앱 업데이트

### 10.1 버전 번호 증가

`android/app/build.gradle`:
```gradle
defaultConfig {
    versionCode 2         // 이전: 1 → 증가
    versionName "1.0.1"   // 이전: 1.0.0
}
```

### 10.2 업데이트 빌드 및 배포

```bash
# 1. 웹 빌드
npm run build

# 2. 동기화
npx cap sync android

# 3. AAB 생성
cd android
./gradlew bundleRelease

# 4. Play Console에서 새 릴리스 만들기
# 5. AAB 업로드 및 릴리스
```

---

## 📝 체크리스트 (최종 확인)

### 앱 설정
- [ ] 앱 ID 고유하게 설정
- [ ] 앱 이름 확인
- [ ] 버전 정보 올바른지 확인
- [ ] 아이콘 모든 크기 준비
- [ ] 딥링크 스킴 설정 (OAuth용)

### 빌드
- [ ] 프로덕션 환경 변수 설정
- [ ] 키스토어 생성 및 안전 보관
- [ ] AAB 파일 생성 성공
- [ ] 테스트 기기에서 APK 테스트

### Play Console
- [ ] 개발자 계정 생성
- [ ] 앱 카테고리 선택
- [ ] 콘텐츠 등급 받기
- [ ] 데이터 보안 섹션 작성
- [ ] 타겟층 설정

### 스토어 등록정보
- [ ] 앱 설명 작성 (간단한/자세한)
- [ ] 스크린샷 업로드 (최소 2개)
- [ ] 주요 그래픽 업로드
- [ ] 앱 아이콘 업로드
- [ ] 개인정보처리방침 URL 등록

### 출시
- [ ] 릴리스 노트 작성
- [ ] 출시 국가 선택
- [ ] 검토 제출

---

## 🚨 주의사항

### 보안
- ✅ 키스토어 파일 백업 (안전한 곳에)
- ✅ 키스토어 비밀번호 기록
- ✅ Git에 키스토어/key.properties 커밋 금지
- ✅ 프로덕션 환경 변수 보안 관리

### 정책 준수
- ✅ Google Play 정책 준수
- ✅ 개인정보처리방침 정확하게 작성
- ✅ 광고/인앱 결제 명시
- ✅ 저작권 침해 금지

### 테스트
- ✅ 다양한 기기에서 테스트
- ✅ 다양한 안드로이드 버전 테스트
- ✅ OAuth 로그인 정상 작동 확인
- ✅ 네트워크 오류 처리 확인

---

## 🔧 트러블슈팅

### 빌드 오류

**문제**: `AAPT: error: resource android:attr/lStar not found`
**해결**: `compileSdkVersion`을 34 이상으로 올리기

**문제**: 서명 오류
**해결**: `key.properties` 경로 및 비밀번호 확인

### 심사 거부

**일반적인 거부 사유:**
1. 개인정보처리방침 누락/부정확
2. 앱 설명과 실제 기능 불일치
3. 콘텐츠 등급 부적절
4. 필수 권한 설명 부족

**해결 방법:**
- 거부 이메일 자세히 읽기
- Play Console 정책 센터 확인
- 문제 수정 후 재제출

### Play Store에 앱이 안 보임

- 심사 승인 후 최대 24시간 대기
- 출시 국가 설정 확인
- 기기 호환성 확인 (minSdkVersion)

---

## 📚 추가 리소스

- [Google Play Console 도움말](https://support.google.com/googleplay/android-developer)
- [Android 개발자 가이드](https://developer.android.com/studio/publish)
- [Capacitor Android 문서](https://capacitorjs.com/docs/android)
- [Play Store 정책 센터](https://play.google.com/about/developer-content-policy/)

---

## 💰 비용

- **개발자 계정**: $25 (일회성)
- **앱 출시**: 무료
- **앱 업데이트**: 무료
- **Play Console 사용**: 무료

---

축하합니다! 🎉 

이제 앱이 Google Play Store에 출시되었습니다!

