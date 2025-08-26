import { SafeAreaProvider } from 'react-native-safe-area-context';

import Loader from './Loader';

import ThemeProvider from './providers/ThemeProvider';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Loader />
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
