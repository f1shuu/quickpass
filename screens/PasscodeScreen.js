import { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSettings } from '../SettingsProvider';


import colors from '../constants/colors';

export default function PasscodeScreen({ isResetMode, onAuthSuccess }) {
    const PASSCODE_LENGTH = 6;
    const PASSCODE_PLACEHOLDER = '•'.repeat(PASSCODE_LENGTH);

    const [passcode, setPasscode] = useState('');
    const [maskedPasscode, setMaskedPasscode] = useState('');
    const [storedPasscode, setStoredPasscode] = useState('');
    const [tempPasscode, setTempPasscode] = useState('');
    const [remembersCurrentPasscode, setRemembersCurrentPasscode] = useState(false);

    const { getColor, translate } = useSettings();

    const [message, setMessage] = useState(translate('createPasscode'));

    useEffect(() => {
        if (isResetMode) setMessage(translate('firstEnterCurrentPasscode'));
        else checkIfPasscodeSet();
    }, [])

    useEffect(() => {
        if (passcode.length === PASSCODE_LENGTH) handlePasscodeSubmit();
    }, [passcode])

    async function checkIfPasscodeSet() {
        const currentPasscode = await SecureStore.getItemAsync('passcode');
        setStoredPasscode(currentPasscode);
        if (currentPasscode) {
            setMessage(translate('enterPasscode'));
            handleBiometricAuth();
        } else setMessage(translate('createPasscode'));
    }

    const handlePasscodeInput = (value) => {
        if (maskedPasscode.length + 1 <= PASSCODE_LENGTH && passcode.length + 1 <= PASSCODE_LENGTH) {
            setMaskedPasscode(maskedPasscode + '•');
            setPasscode(passcode + value);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
    }

    const handleDelete = () => {
        if (passcode.length > 0) setPasscode(passcode.slice(0, -1));
        if (maskedPasscode.length > 0) setMaskedPasscode(maskedPasscode.slice(0, -1));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const firstTry = (passcode) => {
        setMessage(translate('confirmPasscode'));
        setTempPasscode(passcode);
        setMaskedPasscode('');
        setPasscode('');
    }

    async function secondTry(passcode) {
        if (passcode !== tempPasscode) {
            setMessage(translate('passcodesDontMatch'));
            setTempPasscode('');
            setMaskedPasscode('');
            setPasscode('');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Error);
        } else {
            await SecureStore.setItemAsync('passcode', passcode);
            onAuthSuccess();
        }
    }

    const login = (passcode) => {
        if (passcode === storedPasscode) onAuthSuccess();
        else {
            setMessage(translate('incorrectPasscode'));
            setMaskedPasscode('');
            setPasscode('');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
    }

    async function createNewPasscode(passcode) {
        const storedPasscode = await SecureStore.getItemAsync('passcode');
        setStoredPasscode(storedPasscode);
        if (passcode === storedPasscode) {
            setRemembersCurrentPasscode(true);
            setMessage(translate('createPasscode'));
            setMaskedPasscode('');
            setPasscode('');
        }
        else {
            setRemembersCurrentPasscode(false);
            setMessage(translate('incorrectPasscode'));
            setMaskedPasscode('');
            setPasscode('');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Error);
        }
    }

    async function handlePasscodeSubmit() {
        if (!isResetMode && !storedPasscode && !tempPasscode) firstTry(passcode);
        else if (!isResetMode && !storedPasscode && tempPasscode) secondTry(passcode);
        else if (!isResetMode && storedPasscode) login(passcode);
        else if (isResetMode && !remembersCurrentPasscode) createNewPasscode(passcode);
        else if (isResetMode && remembersCurrentPasscode && !tempPasscode) firstTry(passcode);
        else if (isResetMode && tempPasscode) secondTry(passcode);
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
            backgroundColor: getColor('background'),
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
            fontSize: 20,
            color: getColor('text'),
            textAlign: 'center'
        },
        text: {
            fontFamily: 'Tommy',
            fontSize: 36,
            color: getColor('primary'),
            letterSpacing: 10
        },
        placeholderText: {
            fontSize: 48,
            color: getColor('placeholder')
        },
        passcodeText: {
            fontSize: 48,
            color: getColor('primary'),
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
            borderRadius: 15
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: getColor('background') }}>
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
                    <TouchableOpacity style={styles.button} onPress={!storedPasscode || isResetMode ? () => { } : () => handleBiometricAuth()}>
                        <MaterialIcons name='fingerprint' size={36} color={!storedPasscode || isResetMode ? colors.red : getColor('primary')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => handlePasscodeInput('0')}>
                        <Text style={styles.text}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => handleDelete()}>
                        <MaterialIcons name='backspace' size={32} color={getColor('primary')} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}
