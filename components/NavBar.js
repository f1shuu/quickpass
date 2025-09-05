import { View, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome6';

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
            height: 60,
            elevation: 0,
            borderTopWidth: 0
        },
        tabBarLabelStyle: {
            fontFamily: 'Tommy'
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
                            <Icon name='list' size={24} color={focused ? getColor('primary') : getColor('placeholder')} />
                        ),
                        tabBarActiveTintColor: getColor('primary'),
                        tabBarInactiveTintColor: getColor('placeholder')
                    })}
                />
                <Tab.Screen
                    name='PasswordGeneratorScreen'
                    component={PasswordGeneratorScreen}
                    options={() => ({
                        ...customOptions,
                        title: translate('passwordGenerator'),
                        tabBarIcon: ({ focused }) => (
                            <Icon name='square-plus' size={28} color={focused ? getColor('primary') : getColor('placeholder')} />
                        ),
                        tabBarActiveTintColor: getColor('primary'),
                        tabBarInactiveTintColor: getColor('placeholder')
                    })}
                />
                <Tab.Screen
                    name='SettingsNavigator'
                    options={() => ({
                        ...customOptions,
                        title: translate('settings'),
                        tabBarIcon: ({ focused }) => (
                            <Icon name='gear' size={24} color={focused ? getColor('primary') : getColor('placeholder')} />
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