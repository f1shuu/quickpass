import { createStackNavigator } from '@react-navigation/stack';

import AddPasswordScreen from '../screens/AddPasswordScreen';
import PasswordsListScreen from '../screens/PasswordsListScreen';

import { useSettings } from '../SettingsProvider';

const Stack = createStackNavigator();

export default function PasswordsNavigator() {
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