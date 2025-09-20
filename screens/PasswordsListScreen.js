import { Text, View, TouchableOpacity, TextInput, SectionList } from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

import Container from '../components/Container';
import Modal from '../components/Modal';
import Password from '../components/Password';

import { useSettings } from '../SettingsProvider';

import colors from '../constants/colors';

export default function PasswordsListScreen() {
    const [passwords, setPasswords] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const { getColor, translate } = useSettings();

    const navigation = useNavigation();

    useEffect(() => {
        return navigation.addListener('focus', () => { getPasswords(); })
    }, [navigation])

    const sections = useMemo(() => {
        if (!passwords) return;

        const filtered = passwords.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

        const favorited = filtered.filter(p => p.favorited).sort((a, b) => a.name.localeCompare(b.name));
        const regular = filtered.filter(p => !p.favorited).sort((a, b) => a.name.localeCompare(b.name));

        const grouped = regular.reduce((acc, item) => {
            const letter = item.name ? item.name[0].toUpperCase() : '-';
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
            const storedPasswords = await AsyncStorage.getItem('passwords');
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
            const storedPasswords = await AsyncStorage.getItem('passwords');
            if (!storedPasswords) return;

            const parsedPasswords = JSON.parse(storedPasswords);
            const updatedPasswords = parsedPasswords.filter(item => item.id !== id);

            await AsyncStorage.setItem('passwords', JSON.stringify(updatedPasswords));
            setPasswords(updatedPasswords);

            setIsModalVisible(false);
        } catch (error) {
            console.error(error);
        }
    }

    const starPassword = async (id) => {
        try {
            const updatedPasswords = passwords.map(p => p.id === id ? { ...p, favorited: !p.favorited } : p);
            setPasswords(updatedPasswords);
            await AsyncStorage.setItem('passwords', JSON.stringify(updatedPasswords));
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
        text: {
            fontFamily: 'Tommy',
            fontSize: 16,
            color: getColor('text')
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
                    renderItem={({ item }) => (
                        <Password
                            item={item}
                            activeId={activeId}
                            setActiveId={setActiveId}
                            starPassword={starPassword}
                            handleModal={handleModal}
                            navigation={navigation}
                            getColor={getColor}
                            colors={colors}
                            translate={translate}
                        />
                    )}
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