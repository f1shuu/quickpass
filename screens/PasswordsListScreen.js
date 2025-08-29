import { Text, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/FontAwesome6';

import Container from '../components/Container';

import { translate } from '../providers/LanguageProvider';
import { useTheme } from '../providers/ThemeProvider';

export default function PasswordsListScreen() {
    const [passwords, setPasswords] = useState([]);

    const theme = useTheme();

    const navigation = useNavigation();

    useEffect(() => {
        getPasswords();
    }, [])

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

    const styles = {
        item: {
            backgroundColor: theme.secondary,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: 7.5,
            padding: 20,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.tertiary
        },
        text: {
            fontFamily: 'Tommy',
            fontSize: 16,
            color: theme.text
        },
        icon: {
            position: 'absolute',
            alignSelf: 'center',
            top: '33%'
        },
        noPasswordsText: {
            fontFamily: 'Tommy',
            fontSize: 20,
            color: theme.secondary,
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
            backgroundColor: theme.tertiary,
            borderRadius: 50
        }
    }

    const Item = ({ id, icon, app }) => (
        <TouchableOpacity style={styles.item} onPress={() => deletePassword(id, setPasswords)}>
            <Icon name={icon} size={25} color={theme.text} />
            <Text style={styles.text}>{app}</Text>
        </TouchableOpacity>
    )

    return (
        <Container>
            <FlatList
                data={passwords}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Item id={item.id} icon={item.data.icon} app={item.data.app} />
                )}
            />
            {passwords.length === 0 ? (
                <>
                    <Icon name='shield' size={150} color={theme.secondary} style={styles.icon} />
                    <Text style={styles.noPasswordsText}>{translate('noPasswords')}</Text>
                </>
            ) : null}
            <TouchableOpacity onPress={() => navigation.navigate('AddPasswordScreen')} style={styles.addButton} activeOpacity={0.8}>
                <Icon name='plus' size={28} color={theme.textHeader} />
            </TouchableOpacity>
        </Container>
    )
}