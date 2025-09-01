import { createStackNavigator } from '@react-navigation/stack';

import AddPasswordScreen from '../screens/AddPasswordScreen';
import PasswordsListScreen from '../screens/PasswordsListScreen';

import { useSettings } from '../SettingsProvider';

const Stack = createStackNavigator();

export default function PasswordsNavigator() {
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
                name='PasswordsListScreen'
                component={PasswordsListScreen}
                options={{
                    ...customOptions,
                    headerShown: false
                }}
            />
            <Stack.Screen
                name='AddPasswordScreen'
                component={AddPasswordScreen}
                options={({ route }) => ({
                    ...customOptions,
                    headerTitle: route.params?.mode === 'edit' ? translate('editPassword') : translate('addNewPassword')
                })}
            />
        </Stack.Navigator>
    )
}