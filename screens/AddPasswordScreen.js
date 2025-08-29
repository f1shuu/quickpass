import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/FontAwesome6';

import Button from '../components/Button';
import Container from '../components/Container';

import { translate } from '../providers/LanguageProvider';
import { useTheme } from '../providers/ThemeProvider';

import { apps } from '../constants/apps';

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

export default function AddPasswordScreen() {
    const [icon, setIcon] = useState(null);
    const [app, setApp] = useState(null);
    const [login, setLogin] = useState(null);
    const [password, setPassword] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [passwordVisible, setIsPasswordVisible] = useState(false);

    const theme = useTheme();

    const navigation = useNavigation();

    const changeApp = (item) => {
        setIcon(item.icon);
        setApp(item.value);
        setIsFocus(false);
    }

    const styles = {
        text: {
            fontFamily: 'Tommy',
            fontSize: 14,
            color: theme.placeholder,
            marginVertical: 5
        },
        dropdown: {
            width: '100%',
            backgroundColor: theme.secondary,
            height: 60,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderWidth: 1,
            borderColor: theme.tertiary,
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
            borderColor: theme.tertiary
        },
        itemText: {
            fontFamily: 'Tommy',
            color: theme.text,
        },
        placeholder: {
            fontFamily: 'Tommy',
            color: theme.placeholder
        },
        item: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 15
        },
        itemIcon: {
            color: theme.text,
            marginRight: 10
        },
        input: {
            width: '100%',
            backgroundColor: theme.secondary,
            height: 60,
            fontFamily: 'Tommy',
            color: theme.text,
            borderRadius: 10,
            padding: 15
        },
        inputView: {
            flexDirection: "row",
            alignItems: "center"
        },
        visibilityToggle: {
            position: 'absolute',
            right: '5%'
        }
    }

    return (
        <Container>
            <Text style={styles.text}>{translate('appOrWebsite')}</Text>
            <Dropdown
                style={isFocus ? [styles.dropdown, { borderBottomWidth: 0 }] : [styles.dropdown, { borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }]}
                containerStyle={styles.container}
                itemTextStyle={styles.itemText}
                placeholderStyle={styles.placeholder}
                selectedTextStyle={styles.itemText}
                activeColor={theme.tertiary}
                data={apps}
                labelField='value'
                valueField='value'
                placeholder={isFocus ? '...' : translate('choose')}
                value={app}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => changeApp(item)}
                renderItem={item => (
                    <View style={styles.item}>
                        <Icon name={item.icon} size={20} style={styles.itemIcon} />
                        <Text style={styles.itemText}>{item.value}</Text>
                    </View>
                )}
            />
            <Text style={styles.text}>{translate('login')}/{translate('mail')}</Text>
            <TextInput
                style={styles.input}
                placeholderTextColor={theme.placeholder}
                placeholder='johndoe@mail.com'
                onChangeText={(text) => setLogin(text)}
            />
            <Text style={styles.text}>{translate('password')}</Text>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.input}
                    placeholderTextColor={theme.placeholder}
                    placeholder='••••••••••••••••'
                    secureTextEntry={!passwordVisible}
                    onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity style={styles.visibilityToggle} onPress={() => setIsPasswordVisible(!passwordVisible)}>
                    <Icon
                        name={passwordVisible ? 'eye' : 'eye-slash'}
                        size={18}
                        color={theme.placeholder}
                    />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Button onPress={icon && app && login && password ? async () => await storePassword(null, { icon, app, login, password }, navigation, 'PasswordsListScreen') : null} variant='wide' text={translate('save')} />
            </View>
        </Container>
    )
}