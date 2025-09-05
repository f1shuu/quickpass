import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import PasscodeScreen from './screens/PasscodeScreen';
import NavBar from './components/NavBar';

import { useSettings } from './SettingsProvider';

SplashScreen.preventAutoHideAsync();

export default function Loader() {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isPasscodeResetMode, setIsPasscodeResetMode] = useState(false);

    const { loadSettings } = useSettings();

    useEffect(() => {
        const load = async () => {
            try {
                await Font.loadAsync({
                    'Tommy': require('./assets/fonts/Tommy-Bold.otf')
                })
                await loadSettings();
            } catch (error) {
                console.error(error);
            } finally {
                setFontsLoaded(true);
            }
        }
        load();
    }, [])

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded])

    if (!fontsLoaded) return null;

    if (!isAuthenticated) {
        return (
            <PasscodeScreen
                isResetMode={isPasscodeResetMode}
                onAuthSuccess={() => {
                    setIsAuthenticated(true);
                    setIsPasscodeResetMode(false);
                }}
                onPasscodeChangeComplete={() => {
                    setIsAuthenticated(true);
                    setIsPasscodeResetMode(false);
                }}
            />
        )
    }

    return (
        <NavBar
            onPasscodeReset={() => {
                setIsAuthenticated(false);
                setIsPasscodeResetMode(true);
            }}
        />
    )

}
