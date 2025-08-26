import { View, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';

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
            backgroundColor: theme.secondary
        },
        headerTitleStyle: {
            fontFamily: 'Tommy',
            fontSize: 22,
            color: theme.text
        },
        tabBarStyle: {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.secondary,
            elevation: 0,
            borderTopWidth: 0,
        },
        tabBarLabel: () => null
    }

    const styles = {
        addButton: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 75,
            height: 75,
            borderRadius: 37.5
        }
    }

    return (
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
                            <Icon name='list' size={30} color={focused ? theme.tertiary : theme.placeholder} style={{ marginBottom: -10 }} />
                        )
                    })}
                />
                <Tab.Screen
                    name='PasswordGeneratorScreen'
                    component={PasswordGeneratorScreen}
                    options={() => ({
                        ...customOptions,
                        title: translate('strongPasswordGenerator'),
                        tabBarIcon: ({ focused }) => (
                            <View style={[styles.addButton, { backgroundColor: focused ? theme.tertiary : theme.placeholder }]}>
                                <Icon name="plus" size={36} color={theme.secondary} />
                            </View>
                        ),
                    })}
                />
                <Tab.Screen
                    name='SettingsScreen'
                    component={SettingsScreen}
                    options={() => ({
                        ...customOptions,
                        title: translate('settings'),
                        tabBarIcon: ({ focused }) => (
                            <Icon name='cog' size={30} color={focused ? theme.tertiary : theme.placeholder} style={{ marginBottom: -10 }} />
                        )
                    })}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}