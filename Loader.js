import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import PasscodeScreen from './screens/PasscodeScreen';
import NavBar from './components/NavBar';

SplashScreen.preventAutoHideAsync();

export default function Loader() {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const loadFonts = async () => {
            try {
                await Font.loadAsync({
                    'Tommy': require('./assets/fonts/Tommy-Bold.otf')
                })
            } catch (error) {
                console.error(error);
            } finally {
                setFontsLoaded(true);
            }
        }
        loadFonts();
    }, [])

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded])

    if (!fontsLoaded) return null;

    if (!isAuthenticated) return <PasscodeScreen onAuthSuccess={() => setIsAuthenticated(true)} />

    return <NavBar />
}
