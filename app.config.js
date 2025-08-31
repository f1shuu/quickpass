export default {
  expo: {
    name: 'QuickPass',
    slug: 'QuickPass',
    version: '0.8.1',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'dark',
    newArchEnabled: true,
    splash: {
      'image': './assets/images/splash.png',
      'resizeMode': 'contain',
      'backgroundColor': '#000000'
    },
    plugins: [
      'expo-secure-store',
      'expo-localization'
    ],
    extra: {
      'eas': {
        'projectId': 'c1784a9d-b8df-4f81-98f3-e5765a010085'
      }
    },
    android: {
      'package': 'com.f1shu.quickpass'
    }
  }
}
