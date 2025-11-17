import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourapp.oauth',  // 실제 앱 ID로 변경하세요
  appName: 'OAuth Template',   // 실제 앱 이름으로 변경하세요
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

