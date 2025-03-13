import { Text, TextInput } from 'react-native';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';

import Button from '../components/Button';
import Colors from '../constants/Colors';
import Container from '../components/Container';

import { translate } from '../providers/LanguageProvider';
import { useTheme } from '../providers/ThemeProvider';

export default function PasswordCreatorScreen() {
    const [website, setWebsite] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');

    const theme = useTheme();

    const savePassword = async (website, mail, password) => {
        try {
            const data = JSON.stringify({ mail, password });
            await SecureStore.setItemAsync(website, data);

            const storedWebsites = await SecureStore.getItemAsync('websites');
            const websites = storedWebsites ? JSON.parse(storedWebsites) : [];

            if (!websites.includes(website)) {
                websites.push(website);
                await SecureStore.setItemAsync('websites', JSON.stringify(websites));
            }
        } catch (error) {
            console.error(error);
        }
    }

    const styles = {
        input: {
            backgroundColor: theme.background,
            height: 50,
            color: theme.text,
            padding: 10,
            marginBottom: 25,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: theme.primary
        },
        text: {
            fontFamily: 'Tommy',
            fontSize: 18,
            color: theme.primary,
            paddingBottom: 10
        }
    }

    return (
        <Container title={translate('createPassword')}>
            <Text style={styles.text}>{translate('website')}</Text>
            <TextInput
                style={[styles.input, styles.text, { fontSize: 16 }]}
                placeholder={'Facebook'}
                placeholderTextColor={Colors.placeholder}
                value={website}
                onChangeText={setWebsite}
            />
            <Text style={styles.text}>{translate('mail')}</Text>
            <TextInput
                style={[styles.input, styles.text, { fontSize: 16 }]}
                placeholder={'johndoe@gmail.com'}
                placeholderTextColor={Colors.placeholder}
                value={mail}
                onChangeText={setMail}
            />
            <Text style={styles.text}>{translate('password')}</Text>
            <TextInput
                style={[styles.input, styles.text, { fontSize: 16 }]}
                placeholder={'password123'}
                placeholderTextColor={Colors.placeholder}
                value={password}
                onChangeText={setPassword}
            />
            <Button onPress={() => savePassword(website, mail, password)} variant='primary' text={translate('addPassword')} />
        </Container>
    )
}