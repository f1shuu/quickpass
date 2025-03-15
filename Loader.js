import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import PasscodeScreen from './screens/PasscodeScreen';
import PasswordGeneratorScreen from './screens/PasswordGeneratorScreen';

SplashScreen.preventAutoHideAsync();

export default function Loader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAppResources = async () => {
            try {
                await Font.loadAsync({
                    'Tommy': require('./assets/fonts/Tommy-Bold.otf')
                })
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
                await SplashScreen.hideAsync();
            }
        }
        loadAppResources();
    }, [])

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    if (!isAuthenticated) return <PasscodeScreen onAuthSuccess={() => setIsAuthenticated(true)} />;

    return (
        isLoading ? null : (
            <PasswordGeneratorScreen />
        )
    )
}
