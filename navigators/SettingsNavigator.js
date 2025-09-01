import { createStackNavigator } from '@react-navigation/stack';

import SelectionScreen from '../screens/SelectionScreen';
import SettingsScreen from '../screens/SettingsScreen';

import { useSettings } from '../SettingsProvider';

const Stack = createStackNavigator();

export default function SettingsNavigator() {
    const { theme, translate } = useSettings();

    const customOptions = {
        headerTintColor: theme.text,
        headerStyle: {
            backgroundColor: theme.secondary,
            elevation: 0
        },
        headerTitleStyle: {
            fontFamily: 'Tommy',
            fontSize: 18,
            color: theme.text
        }
    }

    return (
        <Stack.Navigator
            screenOptions={{
                animation: 'none'
            }}
        >
            <Stack.Screen
                name='SettingsScreen'
                component={SettingsScreen}
                options={{
                    ...customOptions,
                    headerShown: false
                }}
            />
            <Stack.Screen
                name='SelectionScreen'
                component={SelectionScreen}
                options={({ route }) => ({
                    ...customOptions,
                    headerTitle: route.params?.screen === 'language' ? translate('chooseLanguage') : translate('chooseTheme')
                })}
            />
        </Stack.Navigator>
    )
}