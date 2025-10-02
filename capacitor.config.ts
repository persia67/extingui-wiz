import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d32bc3954e624c14a3127a92b2af9751',
  appName: 'extingui-wiz',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  },
  electron: {
    hideTitleBar: false,
    titleBarStyle: 'default',
    titleBarOverlay: false
  }
};

export default config;