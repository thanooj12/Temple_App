import 'expo-router/entry';
import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Ignore specific logs - optional but helpful during development
LogBox.ignoreLogs(['The native module for Reanimated']);

export default function App() {
  useEffect(() => {
    // Any app initialization code can go here
    console.log('Temple Donation App initialized');
  }, []);

  // The actual rendering is handled by Expo Router
  return <SafeAreaProvider />;
}