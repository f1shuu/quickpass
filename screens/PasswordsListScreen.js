import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import Colors from '../constants/Colors';
import Container from '../components/Container';

import { translate } from '../providers/LanguageProvider';
import { useTheme } from '../providers/ThemeProvider';

export default function PasswordsListScreen() {
    const [passwords, setPasswords] = useState([]);

    const theme = useTheme();

    useEffect(() => {
        loadWebsites();
    }, [])

    const loadWebsites = async () => {
        const storedWebsites = await SecureStore.getItemAsync('websites');
        if (!storedWebsites) return;

        const websites = JSON.parse(storedWebsites);
        const passwordList = [];

        for (const website of websites) {
            const storedData = await SecureStore.getItemAsync(website);
            if (storedData) {
                try {
                    const { mail, password } = JSON.parse(storedData);
                    passwordList.push({ key: website, mail, password });
                } catch (error) {
                    console.error(error);
                }
            }
        }
        setPasswords(passwordList);
    }

    const deletePassword = async (key) => {
        try {
            await SecureStore.deleteItemAsync(key);

            const storedWebsites = await AsyncStorage.getItem('websites');
            const websites = storedWebsites ? JSON.parse(storedWebsites) : [];
            const updatedWebsites = websites.filter(svc => svc !== key);
            await AsyncStorage.setItem('websites', JSON.stringify(updatedWebsites));

            loadWebsites();
        } catch (error) {
            console.error('Error deleting password:', error);
        }
    }

    const Item = ({ website }) => (
        <TouchableOpacity style={styles.item}>
            <View style={styles.row}>
                <Icon name={website.toLowerCase()} size={25} color={theme.primary} />
                <Text style={styles.text}>{website}</Text>
            </View>
            <TouchableOpacity onPress={() => deletePassword(website)}>
                <MIcon name='close' size={25} color={Colors.red} />
            </TouchableOpacity>
        </TouchableOpacity>
    )

    const styles = {
        item: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 20,
            borderBottomWidth: 1,
            borderBottomColor: theme.primary
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 15,
            width: '50%'
        },
        text: {
            fontFamily: 'Tommy',
            fontSize: 16,
            color: theme.primary
        }
    }

    return (
        <Container title={translate('allPasswords') + ` (${passwords.length})`}>
            <FlatList
                data={passwords}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => (
                    <Item website={item.key} />
                )}
            />
        </Container>
    )
}