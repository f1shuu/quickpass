import { createStackNavigator } from '@react-navigation/stack';

import DefaultUsernameScreen from '../screens/DefaultUsernameScreen';
import ImportExportScreen from '../screens/ImportExportScreen';
import SelectionScreen from '../screens/SelectionScreen';
import SettingsScreen from '../screens/SettingsScreen';

import { useSettings } from '../SettingsProvider';

const Stack = createStackNavigator();

export default function SettingsNavigator({ onPasscodeReset }) {
    const { getColor, translate } = useSettings();

    const customOptions = {
        headerTintColor: getColor('text'),
        headerStyle: {
            backgroundColor: getColor('secondary'),
            elevation: 0
        },
        headerTitleStyle: {
            fontFamily: 'Tommy',
            fontSize: 18,
            color: getColor('text')
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
                options={{
                    ...customOptions,
                    headerShown: false
                }}
            >
                {() => <SettingsScreen onPasscodeReset={onPasscodeReset} />}
            </Stack.Screen>
            <Stack.Screen
                name='DefaultUsernameScreen'
                component={DefaultUsernameScreen}
                options={{
                    ...customOptions,
                    headerTitle: translate('addDefaultUsername')
                }}
            />
            <Stack.Screen
                name='ImportExportScreen'
                component={ImportExportScreen}
                options={{
                    ...customOptions,
                    headerTitle: translate('importOrExportPasswords')
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