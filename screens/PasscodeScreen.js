import { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { MaterialIcons } from '@expo/vector-icons';

import { translate } from '../providers/LanguageProvider';
import { useTheme } from '../providers/ThemeProvider';

export default function PasscodeScreen({ onAuthSuccess }) {
    const PASSCODE_LENGTH = 6;
    const PASSCODE_PLACEHOLDER = '•'.repeat(PASSCODE_LENGTH);

    const [passcode, setPasscode] = useState('');
    const [maskedPasscode, setMaskedPasscode] = useState('');
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
            if (passcode === storedPasscode) onAuthSuccess();
            else {
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

    const handlePasscodeInput = (value) => {
        if (passcode.length < PASSCODE_LENGTH) setPasscode(passcode + value);
        if (maskedPasscode.length < PASSCODE_LENGTH) setMaskedPasscode(maskedPasscode + '•');
        if (passcode.length === PASSCODE_LENGTH - 1) handlePasscodeSubmit();
    }

    const handleDelete = () => {
        if (passcode.length > 0) setPasscode(passcode.slice(0, -1));
        if (maskedPasscode.length > 0) setMaskedPasscode(maskedPasscode.slice(0, -1));
    }

    const styles = {
        container: {
            flex: 1,
            backgroundColor: theme.primary,
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 100
        },
        logo: {
            alignItems: 'center',
            gap: 20
        },
        title: {
            fontFamily: 'Tommy',
            fontSize: 28,
            color: theme.tertiary
        },
        text: {
            fontFamily: 'Tommy',
            fontSize: 36,
            color: theme.tertiary,
            letterSpacing: 10
        },
        placeholderText: {
            fontSize: 56,
            color: theme.placeholder
        },
        passcodeText: {
            fontSize: 56,
            color: theme.tertiary,
            position: 'absolute',
            top: 0,
            left: 0
        },
        grid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            alignItems: 'center',
            width: '90%'
        },
        button: {
            width: '27.5%',
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            margin: 10
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.logo}>
                <Image source={require('../assets/images/logo.png')} style={{ width: 100, height: 100 }} />
                <Text style={styles.title}>QUICKPASS</Text>
            </View>
            <View>
                <Text style={[styles.text, styles.placeholderText]}>{PASSCODE_PLACEHOLDER}</Text>
                <Text style={[styles.text, styles.passcodeText]}>{maskedPasscode}</Text>
            </View>
            <View style={styles.grid}>
                <TouchableOpacity style={styles.button} onPress={() => handlePasscodeInput('1')}>
                    <Text style={styles.text}>1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handlePasscodeInput('2')}>
                    <Text style={styles.text}>2</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handlePasscodeInput('3')}>
                    <Text style={styles.text}>3</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handlePasscodeInput('4')}>
                    <Text style={styles.text}>4</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handlePasscodeInput('5')}>
                    <Text style={styles.text}>5</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handlePasscodeInput('6')}>
                    <Text style={styles.text}>6</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handlePasscodeInput('7')}>
                    <Text style={styles.text}>7</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handlePasscodeInput('8')}>
                    <Text style={styles.text}>8</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handlePasscodeInput('9')}>
                    <Text style={styles.text}>9</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handleBiometricAuth()}>
                    <MaterialIcons name='fingerprint' size={36} color={theme.tertiary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handlePasscodeInput('0')}>
                    <Text style={styles.text}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handleDelete()}>
                    <MaterialIcons name='backspace' size={32} color={theme.tertiary} />
                </TouchableOpacity>
            </View>
        </View>
    )
}
