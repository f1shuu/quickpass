import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FontAwesome6 } from '@expo/vector-icons';

import Container from '../components/Container';

import { useSettings } from '../SettingsProvider';

import { getAppNames } from '../constants/appNames';
import colors from '../constants/colors';

async function storePassword(id, favorited, icon, name, username, password, navigation, navigator) {
    try {
        const storedData = await AsyncStorage.getItem('passwords');
        const parsedData = storedData ? JSON.parse(storedData) : [];

        if (id) {
            const existingElementId = parsedData.findIndex(item => item.id === id);
            parsedData[existingElementId] = {
                ...parsedData[existingElementId],
                ...parsedData[existingElementId].favorited,
                ...parsedData[existingElementId].icon,
                ...parsedData[existingElementId].name,
                ...parsedData[existingElementId].username,
                ...parsedData[existingElementId].password
            }
        } else {
            id = uuidv4();
            parsedData.push({ id, favorited, icon, name, username, password });
        }

        await AsyncStorage.setItem('passwords', JSON.stringify(parsedData, null, 2));
        navigation.navigate(navigator);
    } catch (error) {
        console.error(error);
    }
}

export default function AddPasswordScreen({ route, navigation }) {
    const { id } = route.params || {};

    const [name, setName] = useState(route.params?.name ?? null);
    const [icon, setIcon] = useState(route.params?.icon ?? null);
    const [password, setPassword] = useState(route.params?.password ?? null);
    const [favorited] = useState(route.params?.favorited ?? false);

    const [markNameField, setMarkNameField] = useState(false);
    const [markUsernameField, setMarkUsernameField] = useState(false);
    const [markPasswordField, setMarkPasswordField] = useState(false);

    const [isFocus, setIsFocus] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [otherChosen, setOtherChosen] = useState(false);

    const { getColor, settings, translate } = useSettings();

    const [username, setUsername] = useState(route.params?.username ?? settings.defaultUsername ?? null);

    const names = getAppNames(translate);

    const changeName = (item) => {
        if (item.value === translate('other')) setOtherChosen(true);
        setIcon(item.icon);
        setName(item.value);
        setIsFocus(false);
    }

    async function saveIfPossible() {
        if (!name) setMarkNameField(true);
        else setMarkNameField(false);

        if (!username) setMarkUsernameField(true);
        else setMarkUsernameField(false);

        if (!password) setMarkPasswordField(true);
        else setMarkPasswordField(false);

        if (name && username && password) await storePassword(id, favorited, { icon, name, username, password }, navigation, 'PasswordsListScreen');
    }

    const styles = {
        text: {
            fontFamily: 'Tommy',
            fontSize: 14,
            color: getColor('placeholder'),
            marginVertical: 5
        },
        icon: {
            position: 'absolute',
            left: 20,
            top: 20,
            zIndex: 2,
            color: getColor('text')
        },
        dropdown: {
            width: '100%',
            backgroundColor: getColor('secondary'),
            height: 60,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderWidth: 1,
            padding: 15
        },
        container: {
            marginTop: -2,
            marginLeft: 1,
            backgroundColor: getColor('secondary'),
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderWidth: 1,
            borderTopWidth: 0,
            borderColor: getColor('primary')
        },
        itemText: {
            fontFamily: 'Tommy',
            fontSize: 16,
            color: getColor('text')
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
            backgroundColor: getColor('secondary'),
            height: 60,
            fontFamily: 'Tommy',
            color: getColor('text'),
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
            backgroundColor: getColor('primary'),
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
                        {icon && <FontAwesome6 name={icon} size={20} style={styles.icon} />}
                        <Dropdown
                            style={[
                                isFocus
                                    ? { ...styles.dropdown, borderBottomWidth: 0 }
                                    : { ...styles.dropdown, borderBottomWidth: 1, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 },
                                name && { paddingLeft: 55 },
                                markNameField ? { borderColor: colors.red } : { borderColor: getColor('primary') }
                            ]}
                            containerStyle={styles.container}
                            itemTextStyle={styles.itemText}
                            placeholderStyle={[styles.itemText, { color: getColor('placeholder') }]}
                            selectedTextStyle={styles.itemText}
                            activeColor={getColor('primary')}
                            data={names}
                            labelField='value'
                            valueField='value'
                            value={name}
                            autoScroll={false}
                            placeholder={isFocus ? '...' : translate('choose')}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={(item) => changeName(item)}
                            renderItem={item => (
                                <View style={styles.item}>
                                    <View style={styles.iconBox}>
                                        <FontAwesome6 name={item.icon} size={20} style={{ color: getColor('text') }} />
                                    </View>
                                    <Text style={styles.itemText}>{item.value}</Text>
                                </View>
                            )}
                        />
                    </View>
                </>
            ) : (
                <TextInput
                    style={[styles.input, markNameField ? { borderColor: colors.red } : { borderColor: getColor('secondary') }]}
                    placeholderTextColor={getColor('placeholder')}
                    placeholder='Google'
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
            )}
            <Text style={styles.text}>{translate('username')}/{translate('mail')}</Text>
            <TextInput
                style={[styles.input, markUsernameField ? { borderColor: colors.red } : { borderColor: getColor('secondary') }]}
                placeholderTextColor={getColor('placeholder')}
                placeholder='johndoe@mail.com'
                value={username}
                onChangeText={(text) => setUsername(text)}
            />
            <Text style={styles.text}>{translate('password')}</Text>
            <View style={styles.inputView}>
                <TextInput
                    style={[styles.input, markPasswordField ? { borderColor: colors.red } : { borderColor: getColor('secondary') }]}
                    placeholderTextColor={getColor('placeholder')}
                    placeholder='••••••••••••••••'
                    secureTextEntry={!isPasswordVisible}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity style={styles.visibilityToggle} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                    <FontAwesome6 name={isPasswordVisible ? 'eye' : 'eye-slash'} size={18} color={getColor('placeholder')} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                onPress={() => saveIfPossible()}
                activeOpacity={0.75}
                style={styles.button}
            >
                <Text style={[styles.itemText, { color: colors.black }]}>{translate('save')}</Text>
            </TouchableOpacity >
        </Container>
    )
}