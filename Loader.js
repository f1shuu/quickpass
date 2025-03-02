

import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { useTheme } from './providers/ThemeProvider';
import PasscodeScreen from './screens/PasscodeScreen';

SplashScreen.preventAutoHideAsync();

export default function Loader() {
    const [isLoading, setIsLoading] = useState(true);

    const theme = useTheme();

    useEffect(() => {
        const loadAppResources = async () => {
            try {
                await Font.loadAsync({
                    'Nexa': require('./assets/fonts/Nexa-Heavy.ttf')
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

    const styles = {
        container: {
            flex: 1,
            backgroundColor: theme.primary,
            alignItems: 'center',
            justifyContent: 'center'
        },
        text: {
            fontFamily: 'Nexa',
            fontSize: 24,
            color: theme.secondary
        }
    }

    return (
        isLoading ? null : (
            <>
                <StatusBar style='auto' />
                <View style={styles.container}>
                    <Text style={styles.text}>Hello, QuickPass!</Text>
                </View>
            </>
        )
    )
}
