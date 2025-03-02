import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

import { useTheme } from '../providers/ThemeProvider';
import { translate } from '../providers/LanguageProvider';

export default function PasscodeScreen({ onAuthSuccess }) {
    const theme = useTheme();

    const [passcode, setPasscode] = useState('');
    const [storedPasscode, setStoredPasscode] = useState('');

    useEffect(() => {
        checkStoredPasscode();
    }, []);

    async function checkStoredPasscode() {
        const passcode = await SecureStore.getItemAsync('passcode');
        setStoredPasscode(passcode);

        if (passcode) handleBiometricAuth();
    }

    async function handlePasscodeSubmit() {
        if (!storedPasscode) {
            await SecureStore.setItemAsync('passcode', passcode);
            onAuthSuccess();
        } else {
            if (passcode === storedPasscode) {
                onAuthSuccess();
            } else {
                alert('Incorrect passcode');
                setPasscode('');
            }
        }
    }

    async function handleBiometricAuth() {
        const isBiometricAuthAvailable = await LocalAuthentication.hasHardwareAsync();
        if (!isBiometricAuthAvailable) return;

        const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
        if (!savedBiometrics) return;

        const biometricAuth = await LocalAuthentication.authenticateAsync({
            promptMessage: translate('promptMessage'),
            fallbackLabel: translate('fallbackLabel')
        })

        if (biometricAuth.success) onAuthSuccess();
    }

    const styles = {
        container: {
            flex: 1,
            backgroundColor: theme.primary,
            justifyContent: 'center',
            alignItems: 'center'
        },
        input: {
            width: '90%',
            height: 60,
            borderColor: theme.secondary,
            borderWidth: 2,
            marginVertical: 20,
            padding: 10,
            borderRadius: 10,
            color: theme.secondary
        },
        button: {
            backgroundColor: theme.secondary,
            padding: 10,
            width: 200,
            height: 60,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10
        },
        text: {
            fontFamily: 'Tommy',
            fontSize: 20,
            color: theme.primary
        }
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.text, { color: theme.secondary }]}>Enter passcode</Text>
            <TextInput
                style={styles.input}
                value={passcode}
                onChangeText={setPasscode}
                secureTextEntry
                keyboardType="numeric"
                maxLength={4}
            />
            <TouchableOpacity onPress={handlePasscodeSubmit} style={styles.button}>
                <Text style={styles.text}>{ storedPasscode ? translate('unlock') : translate('setPasscode')}</Text>
            </TouchableOpacity>
        </View>
    );
}
