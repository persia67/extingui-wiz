import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d32bc3954e624c14a3127a92b2af9751',
  appName: 'extingui-wiz',
  webDir: 'dist',
  server: {
    url: "https://d32bc395-4e62-4c14-a312-7a92b2af9751.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;