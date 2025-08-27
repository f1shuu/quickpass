import { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { translate } from '../providers/LanguageProvider';
import { useTheme } from '../providers/ThemeProvider';

export default function PasscodeScreen({ onAuthSuccess }) {
    const PASSCODE_LENGTH = 6;
    const PASSCODE_PLACEHOLDER = '•'.repeat(PASSCODE_LENGTH);

    const [passcode, setPasscode] = useState('');
    const [maskedPasscode, setMaskedPasscode] = useState('');
    const [storedPasscode, setStoredPasscode] = useState('');
    const [tempPasscode, setTempPasscode] = useState('');
    const [secondTime, setSecondTime] = useState(false);
    const [message, setMessage] = useState(translate('createPasscode'));

    const theme = useTheme();

    useEffect(() => {
        checkStoredPasscode();
    }, [])

    useEffect(() => {
        if (passcode.length === PASSCODE_LENGTH) handlePasscodeSubmit();
    }, [passcode])

    async function checkStoredPasscode() {
        const storedPasscode = await SecureStore.getItemAsync('passcode');
        setStoredPasscode(storedPasscode);
        if (storedPasscode) {
            setMessage(translate('enterPasscode'));
            handleBiometricAuth();
        }
    }

    const handlePasscodeInput = (value) => {
        if (maskedPasscode.length + 1 <= PASSCODE_LENGTH && passcode.length + 1 <= PASSCODE_LENGTH) {
            setMaskedPasscode(maskedPasscode + '•');
            setPasscode(passcode + value);
        }
    }

    async function handlePasscodeSubmit() {
        if (!storedPasscode) {
            if (!secondTime) {
                setSecondTime(true);
                setMessage(translate('confirmPasscode'));
                setTempPasscode(passcode);
                setMaskedPasscode('');
                setPasscode('');
                return;
            } else {
                if (passcode !== tempPasscode) {
                    setSecondTime(false);
                    setMessage(translate('passcodesDontMatch'));
                    setTempPasscode('');
                    setMaskedPasscode('');
                    setPasscode('');
                    return;
                }
            }
            await SecureStore.setItemAsync('passcode', passcode);
            onAuthSuccess();
        } else {
            if (passcode === storedPasscode) onAuthSuccess();
            else {
                setMessage(translate('incorrectPasscode'));
                setMaskedPasscode('');
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
            paddingTop: 50
        },
        logo: {
            alignItems: 'center',
            gap: 20
        },
        title: {
            fontFamily: 'Tommy',
            fontSize: 22,
            color: theme.text
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
            width: '90%',
            marginBottom: 10
        },
        button: {
            width: '27.5%',
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%'
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.primary }}>
            <View style={styles.container}>
                <View style={styles.logo}>
                    <Image source={require('../assets/images/splash.png')} style={{ width: 200, height: 200 }} />
                    <Text style={styles.title}>{message}</Text>
                </View>
                <View>
                    <Text style={[styles.text, styles.placeholderText]}>{PASSCODE_PLACEHOLDER}</Text>
                    <Text style={[styles.text, styles.passcodeText]}>{maskedPasscode}</Text>
                </View>
                <View style={styles.grid}>
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                        <TouchableOpacity key={num} style={styles.button} onPress={() => handlePasscodeInput(num)}>
                            <Text style={styles.text}>{num}</Text>
                        </TouchableOpacity>
                    ))}
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
        </SafeAreaView>
    )
}
