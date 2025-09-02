import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import * as SecureStore from 'expo-secure-store';
import * as Clipboard from 'expo-clipboard';

import Container from '../components/Container';

import { useSettings } from '../SettingsProvider';

import Colors from '../constants/Colors';

export default function PasswordsListScreen() {
    const [passwords, setPasswords] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const { getColor, translate } = useSettings();

    const navigation = useNavigation();

    useEffect(() => {
        return navigation.addListener('focus', () => {
            getPasswords();
        })
    }, [navigation])

    const getPasswords = async () => {
        try {
            const storedPasswords = await SecureStore.getItemAsync('passwords');
            if (storedPasswords) {
                const parsedPasswords = JSON.parse(storedPasswords);
                setPasswords(parsedPasswords)
            } else setPasswords([]);
        } catch (error) {
            console.error(error)
        }
    }

    const deletePassword = async (id, setPasswords) => {
        try {
            const storedPasswords = await SecureStore.getItemAsync('passwords');
            if (!storedPasswords) return;

            const parsedPasswords = JSON.parse(storedPasswords);
            const updatedPasswords = parsedPasswords.filter(item => item.id !== id);

            await SecureStore.setItemAsync('passwords', JSON.stringify(updatedPasswords));
            setPasswords(updatedPasswords);

        } catch (error) {
            console.error(error);
        }
    }

    const togglePasswordVisiblity = (item) => {
        if (activeId === null || activeId !== item.id) setIsPasswordVisible(false);
        setActiveId(activeId === item.id ? null : item.id)
    }

    const styles = {
        header: {
            backgroundColor: getColor('secondary'),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
            padding: 15,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderWidth: 1,
            borderColor: getColor('primary'),
            height: 70
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10
        },
        text: {
            fontFamily: 'Tommy',
            fontSize: 16,
            color: getColor('text')
        },
        content: {
            backgroundColor: getColor('secondary'),
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
            padding: 10,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderWidth: 1,
            borderTopWidth: 0,
            borderColor: getColor('primary')
        },
        textBoxes: {
            gap: 10,
            marginBottom: 10
        },
        textBox: {
            backgroundColor: getColor('tertiary'),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: 10,
            borderRadius: 7.5
        },
        smallText: {
            fontFamily: 'Tommy',
            fontSize: 16,
            color: getColor('placeholder')
        },
        visibilityToggle: {
            position: 'absolute',
            right: '125%',
            width: 45,
            height: 45,
            justifyContent: 'center',
            alignItems: 'center'
        },
        button: {
            flex: 1,
            backgroundColor: getColor('primary'),
            alignItems: 'center',
            borderRadius: 7.5,
            paddingVertical: 10
        },
        icon: {
            position: 'absolute',
            alignSelf: 'center',
            top: '33%'
        },
        noPasswordsText: {
            fontFamily: 'Tommy',
            fontSize: 20,
            color: getColor('secondary'),
            position: 'absolute',
            alignSelf: 'center',
            top: '60%'
        },
        addButton: {
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            bottom: 20,
            right: 20,
            width: 65,
            height: 65,
            backgroundColor: getColor('primary'),
            borderRadius: 50
        }
    }

    const Password = ({ item }) => {
        const isActive = activeId === item.id;

        return (
            <View>
                <TouchableOpacity
                    onPress={() => togglePasswordVisiblity(item)}
                    activeOpacity={0.75}
                    style={isActive ? styles.header : [styles.header, { borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }]}
                >
                    <View style={[styles.row, { gap: 15 }]}>
                        <Icon name={item.data.icon} size={32} color={getColor('text')} />
                        <Text style={styles.text}>{item.data.app}</Text>
                    </View>
                    <Icon name={isActive ? 'caret-up' : 'caret-down'} size={24} color={getColor('text')} />
                </TouchableOpacity>
                {isActive ? (
                    <View style={styles.content}>
                        <View style={styles.textBoxes}>
                            <View style={styles.textBox}>
                                <Icon name={'user'} size={20} color={getColor('placeholder')} />
                                <Text style={styles.smallText}>{item.data.login}</Text>
                                <TouchableOpacity onPress={() => Clipboard.setStringAsync(item.data.login)} activeOpacity={0.75}>
                                    <Icon name='copy' size={24} color={getColor('placeholder')} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.textBox}>
                                <Icon name={'key'} size={20} color={getColor('placeholder')} />
                                <Text style={styles.smallText}>{isPasswordVisible ? item.data.password : '•'.repeat(item.data.password.length)}</Text>
                                <View style={styles.row}>
                                    <TouchableOpacity style={styles.visibilityToggle} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                        <Icon
                                            name={isPasswordVisible ? 'eye' : 'eye-slash'}
                                            size={20}
                                            color={getColor('placeholder')}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => Clipboard.setStringAsync(item.data.password)} activeOpacity={0.75}>
                                        <Icon name='copy' size={24} color={getColor('placeholder')} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.row, { width: '100%' }]}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('AddPasswordScreen', { id: item.id, app: item.data.app, icon: item.data.icon, login: item.data.login, password: item.data.password, mode: 'edit' })}
                                activeOpacity={0.75}
                                style={styles.button}
                            >
                                <Text style={[styles.text, { color: Colors.black }]}>{translate('edit')}</Text>
                            </TouchableOpacity >
                            <TouchableOpacity
                                onPress={() => deletePassword(item.id, setPasswords)}
                                activeOpacity={0.75}
                                style={styles.button}
                            >
                                <Text style={[styles.text, { color: Colors.black }]}>{translate('delete')}</Text>
                            </TouchableOpacity >
                        </View>
                    </View>
                ) : null}
            </View>
        )
    }

    return (
        <Container>
            {passwords.length !== 0 ? (
                <FlatList
                    style={{ marginTop: -10 }}
                    data={passwords}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <Password item={item} />}
                />
            ) : (
                <>
                    <Icon name='shield' size={150} color={getColor('secondary')} style={styles.icon} />
                    <Text style={styles.noPasswordsText}>{translate('noPasswords')}</Text>
                </>
            )}
            <TouchableOpacity onPress={() => navigation.navigate('AddPasswordScreen')} style={styles.addButton} activeOpacity={0.75}>
                <Icon name='plus' size={28} color={getColor('background')} />
            </TouchableOpacity>
        </Container>
    )
}