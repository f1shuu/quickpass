import { View, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome6';

import PasswordGeneratorScreen from '../screens/PasswordGeneratorScreen';
import PasswordsNavigator from '../navigators/PasswordsNavigator';
import SettingsScreen from '../screens/SettingsScreen';

import { useTheme } from '../providers/ThemeProvider';
import { translate } from '../providers/LanguageProvider';

const Tab = createBottomTabNavigator();

export default function NavigationBar() {
    const theme = useTheme();

    const customOptions = {
        headerStyle: {
            backgroundColor: theme.secondary,
            elevation: 0
        },
        headerTitleStyle: {
            fontFamily: 'Tommy',
            fontSize: 22,
            color: theme.text
        },
        tabBarStyle: {
            backgroundColor: theme.secondary,
            height: 60,
            elevation: 0,
            borderTopWidth: 0
        },
        tabBarLabelStyle: {
            fontFamily: 'Tommy',
            color: theme.placeholder
        }
    }

    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName='PasswordGeneratorScreen'
                screenOptions={{
                    animationEnabled: false,
                    tabBarHideOnKeyboard: true,
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
                    name='PasswordsNavigator'
                    component={PasswordsNavigator}
                    options={() => ({
                        ...customOptions,
                        title: translate('passwordsList'),
                        tabBarIcon: ({ focused }) => (
                            <Icon name='list' size={24} color={focused ? theme.primary : theme.placeholder} />
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
                            <Icon name='square-plus' size={28} color={focused ? theme.primary : theme.placeholder} />
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
                            <Icon name='gear' size={24} color={focused ? theme.primary : theme.placeholder} />
                        )
                    })}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}