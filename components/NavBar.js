import { View, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { SafeAreaView } from 'react-native-safe-area-context';

import PasswordGeneratorScreen from '../screens/PasswordGeneratorScreen';
import PasswordsListScreen from '../screens/PasswordsListScreen';
import SettingsScreen from '../screens/SettingsScreen';

import { useTheme } from '../providers/ThemeProvider';
import { translate } from '../providers/LanguageProvider';

const Tab = createBottomTabNavigator();

export default function NavigationBar() {
    const theme = useTheme();

    const customOptions = {
        headerStyle: {
            backgroundColor: theme.secondary,
            height: 70
        },
        headerTitleStyle: {
            fontFamily: 'Tommy',
            fontSize: 22,
            color: theme.text,
            paddingBottom: 15
        },
        tabBarStyle: {
            height: 50,
            backgroundColor: theme.secondary,
            elevation: 0,
            borderTopWidth: 0
        },
        tabBarLabelStyle: {
            fontFamily: 'Tommy',
            color: theme.placeholder,
            paddingTop: 5,
            marginBottom: -20
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.secondary }}>
            <NavigationContainer>
                <Tab.Navigator
                    initialRouteName='PasswordGeneratorScreen'
                    screenOptions={{
                        animationEnabled: false,
                        tabBarButton: (props) => (
                            <TouchableWithoutFeedback onPress={props.onPress}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    {props.children}
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    }}
                >
                    <Tab.Screen
                        name='PasswordsListScreen'
                        component={PasswordsListScreen}
                        options={() => ({
                            ...customOptions,
                            title: translate('passwordsList'),
                            tabBarIcon: ({ focused }) => (
                                <Icon name='list' size={24} color={focused ? theme.tertiary : theme.placeholder} />
                            )
                        })}
                    />
                    <Tab.Screen
                        name='PasswordGeneratorScreen'
                        component={PasswordGeneratorScreen}
                        options={() => ({
                            ...customOptions,
                            title: translate('passwordGenerator'),
                            tabBarIcon: ({ focused }) => (
                                <Icon name='square-plus' size={28} color={focused ? theme.tertiary : theme.placeholder} />
                            )
                        })}
                    />
                    <Tab.Screen
                        name='SettingsScreen'
                        component={SettingsScreen}
                        options={() => ({
                            ...customOptions,
                            title: translate('settings'),
                            tabBarIcon: ({ focused }) => (
                                <Icon name='gear' size={24} color={focused ? theme.tertiary : theme.placeholder} />
                            )
                        })}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    )
}