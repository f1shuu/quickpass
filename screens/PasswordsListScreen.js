import { Text, View, TouchableOpacity, TextInput, SectionList } from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

import Container from '../components/Container';
import Modal from '../components/Modal';

import { useSettings } from '../SettingsProvider';

import colors from '../constants/colors';

export default function PasswordsListScreen() {
    const [passwords, setPasswords] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const { getColor, translate } = useSettings();

    const navigation = useNavigation();

    useEffect(() => {
        return navigation.addListener('focus', () => {
            getPasswords();
        })
    }, [navigation])

    const sections = useMemo(() => {
        if (!passwords) return;

        const filtered = passwords.filter((p) => p.data.name.toLowerCase().includes(searchQuery.toLowerCase()));

        const favorited = filtered.filter(p => p.favorited).sort((a, b) => a.data.name.localeCompare(b.data.name));
        const regular = filtered.filter(p => !p.favorited).sort((a, b) => a.data.name.localeCompare(b.data.name));

        const grouped = regular.reduce((acc, item) => {
            const letter = item.data.name[0].toUpperCase();
            if (!acc[letter]) acc[letter] = [];
            acc[letter].push(item);
            return acc;
        }, {})

        const result = [];

        if (favorited.length > 0) {
            result.push({
                title: translate('favorited'),
                data: favorited
            })
        }

        Object.keys(grouped).sort().forEach(letter => {
            result.push({
                title: letter,
                data: grouped[letter]
            })
        })

        return result;
    }, [passwords, searchQuery])

    const getPasswords = async () => {
        try {
            const storedPasswords = await SecureStore.getItemAsync('passwords');
            if (storedPasswords) {
                const parsedPasswords = JSON.parse(storedPasswords);
                setPasswords(parsedPasswords);
            } else setPasswords([]);
        } catch (error) {
            console.error(error);
        }
    }

    const deletePassword = async (id) => {
        try {
            const storedPasswords = await SecureStore.getItemAsync('passwords');
            if (!storedPasswords) return;

            const parsedPasswords = JSON.parse(storedPasswords);
            const updatedPasswords = parsedPasswords.filter(item => item.id !== id);

            await SecureStore.setItemAsync('passwords', JSON.stringify(updatedPasswords));
            setPasswords(updatedPasswords);

            setIsModalVisible(false);
        } catch (error) {
            console.error(error);
        }
    }

    const togglePasswordVisiblity = (item) => {
        if (activeId === null || activeId !== item.id) setIsPasswordVisible(false);
        setActiveId(activeId === item.id ? null : item.id);
    }

    const starPassword = async (id) => {
        try {
            const updatedPasswords = passwords.map(p => p.id === id ? { ...p, favorited: !p.favorited } : p);
            setPasswords(updatedPasswords);
            await SecureStore.setItemAsync('passwords', JSON.stringify(updatedPasswords));
        } catch (error) {
            console.error(error);
        }
    }

    const handleModal = (id) => {
        setModalData(id);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Error);
        setIsModalVisible(!isModalVisible);
    }

    const styles = {
        searchBarBackground: {
            backgroundColor: getColor('background'),
            paddingBottom: 10
        },
        searchBar: {
            width: '100%',
            height: 50,
            fontFamily: 'Tommy',
            color: getColor('text'),
            borderRadius: 10,
            padding: 15,
            borderWidth: 1,
            borderColor: getColor('primary')
        },
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
            height: 70
        },
        activeHeader: {
            borderColor: getColor('primary'),
            borderBottomWidth: 0
        },
        inactiveHeader: {
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10
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
            alignItems: 'center',
            borderRadius: 7.5,
            paddingVertical: 10
        },
        paddings: {
            paddingTop: 15,
            paddingLeft: 10,
            paddingBottom: 5
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
                    style={isActive ? [styles.header, styles.activeHeader] : [styles.header, styles.inactiveHeader]}
                >
                    <View style={[styles.row, { gap: 15 }]}>
                        <FontAwesome6 name={item.data.icon} size={32} color={getColor('text')} />
                        <Text style={styles.text}>{item.data.name}</Text>
                    </View>
                    <View style={[styles.row, { gap: 15 }]}>
                        <TouchableOpacity onPress={() => starPassword(item.id)} activeOpacity={0.75}>
                            <FontAwesome6 name={'star'} size={20} color={colors.golden} solid={item.favorited ? true : false} />
                        </TouchableOpacity>
                        <FontAwesome6 name={isActive ? 'caret-up' : 'caret-down'} size={24} color={getColor('text')} />
                    </View>
                </TouchableOpacity>
                {isActive ? (
                    <View style={styles.content}>
                        <View style={styles.textBoxes}>
                            <View style={styles.textBox}>
                                <FontAwesome6 name={'user'} size={20} color={getColor('placeholder')} solid={true} />
                                <Text style={styles.smallText}>{item.data.username}</Text>
                                <TouchableOpacity onPress={() => Clipboard.setStringAsync(item.data.username)} activeOpacity={0.75}>
                                    <FontAwesome6 name='copy' size={24} color={getColor('placeholder')} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.textBox}>
                                <FontAwesome6 name={'key'} size={20} color={getColor('placeholder')} />
                                <Text style={styles.smallText}>{isPasswordVisible ? item.data.password : '•'.repeat(item.data.password.length)}</Text>
                                <View style={styles.row}>
                                    <TouchableOpacity style={styles.visibilityToggle} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                        <FontAwesome6 name={isPasswordVisible ? 'eye' : 'eye-slash'} size={20} color={getColor('placeholder')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => Clipboard.setStringAsync(item.data.password)} activeOpacity={0.75}>
                                        <FontAwesome6 name='copy' size={24} color={getColor('placeholder')} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.row, { width: '100%' }]}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('AddPasswordScreen', { id: item.id, name: item.data.name, icon: item.data.icon, username: item.data.username, password: item.data.password, mode: 'edit' })}
                                activeOpacity={0.75}
                                style={[styles.button, { backgroundColor: getColor('primary') }]}
                            >
                                <Text style={[styles.text, { color: colors.black }]}>{translate('edit')}</Text>
                            </TouchableOpacity >
                            <TouchableOpacity
                                onPress={() => handleModal(item.id)}
                                activeOpacity={0.75}
                                style={[styles.button, { backgroundColor: colors.red }]}
                            >
                                <Text style={[styles.text, { color: colors.black }]}>{translate('delete')}</Text>
                            </TouchableOpacity >
                        </View>
                    </View>
                ) : null}
            </View>
        )
    }

    return (
        <Container>
            <View style={styles.searchBarBackground}>
                <TextInput
                    style={[styles.searchBar, { borderColor: isSearchFocused ? getColor('primary') : getColor('placeholder') }]}
                    placeholder={translate('search')}
                    placeholderTextColor={getColor('placeholder')}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                />
            </View>
            {passwords.length !== 0 ? (
                <SectionList
                    style={{ marginTop: -10 }}
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <Password item={item} />}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={[styles.text, styles.paddings]}>{title}</Text>
                    )}
                />
            ) : (
                <>
                    <FontAwesome6 name='shield' size={150} color={getColor('secondary')} style={styles.icon} />
                    <Text style={styles.noPasswordsText}>{translate('noPasswords')}</Text>
                </>
            )}
            <TouchableOpacity onPress={() => navigation.navigate('AddPasswordScreen')} style={styles.addButton} activeOpacity={0.75}>
                <FontAwesome6 name='plus' size={28} color={getColor('background')} />
            </TouchableOpacity>
            <Modal
                isVisible={isModalVisible}
                text={translate('areYouSureYouWantToDeleteThisPassword')}
                twoButtons={true}
                buttonOneText={translate('yes')}
                buttonOneOnPress={() => deletePassword(modalData)}
                buttonTwoText={translate('no')}
                buttonTwoOnPress={() => setIsModalVisible(!isModalVisible)}
            />
        </Container>
    )
}