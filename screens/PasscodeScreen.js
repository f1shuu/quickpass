import { useState, useEffect } from 'react';
import { View, TextInput } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

import Button from '../components/Button';

import { translate } from '../providers/LanguageProvider';
import { useTheme } from '../providers/ThemeProvider';

export default function PasscodeScreen({ onAuthSuccess }) {
    const [passcode, setPasscode] = useState('');
    const [storedPasscode, setStoredPasscode] = useState('');

    const theme = useTheme();

    useEffect(() => {
        checkStoredPasscode();
    }, [])

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
        text: {
            fontFamily: 'Tommy',
            fontSize: 20,
            color: theme.primary
        }
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, styles.text, { color: theme.secondary }]}
                value={passcode}
                onChangeText={setPasscode}
                secureTextEntry
                keyboardType="numeric"
                maxLength={4}
            />
            <Button onPress={handlePasscodeSubmit} theme='secondary' text={storedPasscode ? translate('unlock') : translate('setPasscode')} />
        </View>
    )
}
