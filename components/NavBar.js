import { View, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome6 } from '@expo/vector-icons';

import PasswordGeneratorScreen from '../screens/PasswordGeneratorScreen';
import PasswordsNavigator from '../navigators/PasswordsNavigator';
import SettingsNavigator from '../navigators/SettingsNavigator';

import { useSettings } from '../SettingsProvider';

const Tab = createBottomTabNavigator();

export default function NavigationBar({ onPasscodeReset }) {
    const { getColor, translate } = useSettings();

    const customOptions = {
        headerStyle: {
            backgroundColor: getColor('secondary'),
            elevation: 0
        },
        headerTitleStyle: {
            fontFamily: 'Tommy',
            fontSize: 22,
            color: getColor('text')
        },
        tabBarStyle: {
            backgroundColor: getColor('secondary'),
            height: 80,
            paddingTop: 5,
            elevation: 0,
            borderTopWidth: 0
        },
        tabBarLabelStyle: {
            fontFamily: 'Tommy'
        }
    }

    const navigationTheme = {
        dark: true,
        colors: {
            background: getColor('background'),
            card: getColor('secondary'),
            text: getColor('text'),
            border: getColor('secondary'),
            primary: getColor('primary'),
            notification: getColor('primary')
        }
    };

    return (
        <NavigationContainer theme={navigationTheme}>
            <Tab.Navigator
                initialRouteName='PasswordGeneratorScreen'
                screenOptions={{
                    popToTopOnBlur: true,
                    animationEnabled: false,
                    tabBarHideOnKeyboard: true,
                    sceneStyle: {
                        backgroundColor: getColor('background')
                    },
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
                    listeners={({ navigation }) => ({
                        tabPress: () => {
                            navigation.navigate('PasswordsNavigator', { screen: 'PasswordsListScreen' });
                        }
                    })}
                    options={() => ({
                        ...customOptions,
                        title: translate('passwordsList'),
                        tabBarIcon: ({ focused }) => (
                            <FontAwesome6 name='list' size={24} color={focused ? getColor('primary') : getColor('placeholder')} />
                        ),
                        tabBarActiveTintColor: getColor('primary'),
                        tabBarInactiveTintColor: getColor('placeholder')
                    })}
                />
                <Tab.Screen
                    name='PasswordGeneratorScreen'
                    component={PasswordGeneratorScreen}
                    listeners={({ navigation }) => ({
                        tabPress: () => {
                            navigation.navigate('PasswordGeneratorScreen');
                        }
                    })}
                    options={() => ({
                        ...customOptions,
                        title: translate('passwordGenerator'),
                        tabBarIcon: ({ focused }) => (
                            <FontAwesome6 name='square-plus' size={28} color={focused ? getColor('primary') : getColor('placeholder')} />
                        ),
                        tabBarActiveTintColor: getColor('primary'),
                        tabBarInactiveTintColor: getColor('placeholder')
                    })}
                />
                <Tab.Screen
                    name='SettingsNavigator'
                    listeners={({ navigation }) => ({
                        tabPress: () => {
                            navigation.navigate('SettingsNavigator', { screen: 'SettingsScreen' });
                        }
                    })}
                    options={() => ({
                        ...customOptions,
                        title: translate('settings'),
                        tabBarIcon: ({ focused }) => (
                            <FontAwesome6 name='gear' size={24} color={focused ? getColor('primary') : getColor('placeholder')} />
                        ),
                        tabBarActiveTintColor: getColor('primary'),
                        tabBarInactiveTintColor: getColor('placeholder')
                    })}
                >
                    {() => <SettingsNavigator onPasscodeReset={onPasscodeReset} />}
                </Tab.Screen>
            </Tab.Navigator>
        </NavigationContainer>
    )
}