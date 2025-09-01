import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/FontAwesome6';

import Container from '../components/Container';

import { useSettings } from '../SettingsProvider';

import { getApps } from '../constants/Apps';

async function storePassword(id, data = {}, navigation, navigator) {
    try {
        const storedData = await SecureStore.getItemAsync('passwords');
        const parsedData = storedData ? JSON.parse(storedData) : [];

        if (id) {
            const existingElementId = parsedData.findIndex(item => item.id === id);
            parsedData[existingElementId] = { ...parsedData[existingElementId], data: { ...parsedData[existingElementId].data, ...data } };
        } else {
            id = uuidv4();
            parsedData.push({ id, data: data });
        }

        await SecureStore.setItemAsync('passwords', JSON.stringify(parsedData, null, 2));
        navigation.navigate(navigator);
    } catch (error) {
        console.error(error);
    }
}

export default function AddPasswordScreen({ route, navigation }) {
    const { id } = route.params || {};

    const [app, setApp] = useState(route.params?.app ?? null);
    const [icon, setIcon] = useState(route.params?.icon ?? null);
    const [login, setLogin] = useState(route.params?.login ?? null);
    const [password, setPassword] = useState(route.params?.password ?? null);

    const [markAppField, setMarkAppField] = useState(false);
    const [markLoginField, setMarkLoginField] = useState(false);
    const [markPasswordField, setMarkPasswordField] = useState(false);

    const [isFocus, setIsFocus] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [otherChosen, setOtherChosen] = useState(false);

    const { theme, translate } = useSettings();

    const apps = getApps(translate);

    const changeApp = (item) => {
        if (item.value === translate('other')) setOtherChosen(true);
        setIcon(item.icon);
        setApp(item.value);
        setIsFocus(false);
    }

    async function saveIfPossible() {
        if (!app) setMarkAppField(true);
        else setMarkAppField(false);

        if (!login) setMarkLoginField(true);
        else setMarkLoginField(false);

        if (!password) setMarkPasswordField(true);
        else setMarkPasswordField(false);

        if (app && login && password) await storePassword(id, { icon, app, login, password }, navigation, 'PasswordsListScreen')
    }

    const styles = {
        text: {
            fontFamily: 'Tommy',
            fontSize: 14,
            color: theme.placeholder,
            marginVertical: 5
        },
        icon: {
            position: 'absolute',
            left: 20,
            top: 20,
            zIndex: 2,
            color: theme.text
        },
        dropdown: {
            width: '100%',
            backgroundColor: theme.secondary,
            height: 60,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderWidth: 1,
            padding: 15
        },
        container: {
            marginTop: -2,
            marginLeft: 1,
            backgroundColor: theme.secondary,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderWidth: 1,
            borderTopWidth: 0,
            borderColor: theme.primary
        },
        itemText: {
            fontFamily: 'Tommy',
            fontSize: 16,
            color: theme.text
        },
        item: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 15,
            paddingHorizontal: 10
        },
        iconBox: {
            width: 35,
            alignItems: 'center',
            marginRight: 10
        },
        input: {
            width: '100%',
            backgroundColor: theme.secondary,
            height: 60,
            fontFamily: 'Tommy',
            color: theme.text,
            borderRadius: 10,
            padding: 15,
            paddingRight: 0,
            borderWidth: 1
        },
        inputView: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        visibilityToggle: {
            position: 'absolute',
            right: '0%',
            width: 60,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center'
        },
        button: {
            backgroundColor: theme.primary,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            marginTop: 100,
            paddingVertical: 15,
            paddingHorizontal: 30
        }
    }

    return (
        <Container>
            <Text style={styles.text}>{translate('appOrWebsite')}</Text>
            {!otherChosen ? (
                <>
                    <View>
                        {icon && (
                            <Icon
                                name={icon}
                                size={20}
                                style={styles.icon}
                            />
                        )}
                        <Dropdown
                            style={[
                                isFocus
                                    ? { ...styles.dropdown, borderBottomWidth: 0 }
                                    : { ...styles.dropdown, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 },
                                app && { paddingLeft: 55 },
                                markAppField ? { borderColor: 'red' } : { borderColor: theme.primary }
                            ]}
                            containerStyle={styles.container}
                            itemTextStyle={styles.itemText}
                            placeholderStyle={[styles.itemText, { color: theme.placeholder }]}
                            selectedTextStyle={styles.itemText}
                            activeColor={theme.primary}
                            data={apps}
                            labelField='value'
                            valueField='value'
                            value={app}
                            autoScroll={false}
                            placeholder={isFocus ? '...' : translate('choose')}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={(item) => changeApp(item)}
                            renderItem={item => (
                                <View style={styles.item}>
                                    <View style={styles.iconBox}>
                                        <Icon name={item.icon} size={20} style={{ color: theme.text }} />
                                    </View>
                                    <Text style={styles.itemText}>{item.value}</Text>
                                </View>
                            )}
                        />
                    </View>
                </>
            ) : (
                <TextInput
                    style={[styles.input, markAppField ? { borderColor: 'red' } : { borderColor: theme.secondary }]}
                    placeholderTextColor={theme.placeholder}
                    placeholder='Google'
                    value={app}
                    onChangeText={(text) => setApp(text)}
                />
            )}
            <Text style={styles.text}>{translate('login')}/{translate('mail')}</Text>
            <TextInput
                style={[styles.input, markLoginField ? { borderColor: 'red' } : { borderColor: theme.secondary }]}
                placeholderTextColor={theme.placeholder}
                placeholder='johndoe@mail.com'
                value={login}
                onChangeText={(text) => setLogin(text)}
            />
            <Text style={styles.text}>{translate('password')}</Text>
            <View style={styles.inputView}>
                <TextInput
                    style={[styles.input, markPasswordField ? { borderColor: 'red' } : { borderColor: theme.secondary }]}
                    placeholderTextColor={theme.placeholder}
                    placeholder='••••••••••••••••'
                    secureTextEntry={!isPasswordVisible}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity style={styles.visibilityToggle} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                    <Icon
                        name={isPasswordVisible ? 'eye' : 'eye-slash'}
                        size={18}
                        color={theme.placeholder}
                    />
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                onPress={() => saveIfPossible()}
                activeOpacity={0.75}
                style={styles.button}
            >
                <Text style={[styles.itemText, { color: theme.background }]}>{translate('save')}</Text>
            </TouchableOpacity >
        </Container>
    )
}