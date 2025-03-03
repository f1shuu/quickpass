import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import CustomTabBar from './components/CustomTabBar';
import PasscodeScreen from './screens/PasscodeScreen';
import PasswordCreator from './screens/PasswordCreatorScreen';
import PasswordsScreen from './screens/PasswordsListScreen';

import { useTheme } from './providers/ThemeProvider';

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

export default function Loader() {
    const [isLoading, setIsLoading] = useState(true);

    const theme = useTheme();

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
            <>
                <NavigationContainer>
                <StatusBar style='auto' />
                    <Stack.Navigator
                        screenOptions={{
                            animationEnabled: false,
                            header: (props) => <CustomTabBar {...props} />,
                            cardStyle: { backgroundColor: theme.primary }
                        }}
                    >
                        <Stack.Screen name='PasswordsScreen' component={PasswordsScreen} options={{ animation: 'none' }} />
                        <Stack.Screen name='PasswordCreator' component={PasswordCreator} options={{ animation: 'none' }} />
                    </Stack.Navigator>
                </NavigationContainer>
            </>
        )
    )
}
