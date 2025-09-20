import { Text, View, TouchableOpacity, Switch } from 'react-native';
import { useState, useEffect } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

import Container from '../components/Container';

import { useSettings } from '../SettingsProvider';

import colors from '../constants/colors';

export default function PasswordGeneratorScreen() {
    const MIN_PASSWORD_LENGTH = 8;
    const MAX_PASSWORD_LENGTH = 32;
    const UPPERCASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const LOWERCASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz';
    const NUMBERS = '1234567890';
    const SPECIAL_CHARACTERS = '`~!@#$%^&*()-_=+[]{}\\|;:<.>/?\'';

    const [useUpperCaseLetters, setUseUpperCaseLetters] = useState(true);
    const [useLowerCaseLetters, setUseLowerCaseLetters] = useState(true);
    const [useNumbers, setUseNumbers] = useState(true);
    const [useSpecialCharacters, setUseSpecialCharacters] = useState(true);
    const [passwordLength, setPasswordLength] = useState(16);
    const [minNumbers, setMinNumbers] = useState(3);
    const [minSpecialCharacters, setMinSpecialCharacters] = useState(3);
    const [password, setPassword] = useState('');

    const { getColor, translate } = useSettings();

    useEffect(() => {
        generateStrongPassword(
            useUpperCaseLetters,
            useLowerCaseLetters,
            useNumbers,
            useSpecialCharacters,
            passwordLength,
            minNumbers,
            minSpecialCharacters
        );
    }, [useUpperCaseLetters, useLowerCaseLetters, useNumbers, useSpecialCharacters, passwordLength, minNumbers, minSpecialCharacters]);

    const toggleUseUpperCaseLetters = () => {
        setUseUpperCaseLetters(previousState => !previousState);
        if (useUpperCaseLetters) setUseLowerCaseLetters(true);
    }
    const toggleUseLowerCaseLetters = () => {
        setUseLowerCaseLetters(previousState => !previousState);
        if (useLowerCaseLetters) setUseUpperCaseLetters(true);
    }
    const toggleUseNumbers = () => setUseNumbers(previousState => !previousState);
    const toggleUseSpecialCharacters = () => setUseSpecialCharacters(previousState => !previousState);

    const generateStrongPassword = (useUpperCaseLetters, useLowerCaseLetters, useNumbers, useSpecialCharacters, passwordLength, minNumbers, minSpecialCharacters) => {
        let tempPassword = '';

        let numbersLength;
        if (useNumbers) numbersLength = Math.floor(Math.random() * (Math.floor(passwordLength / 3) - minNumbers + 1)) + minNumbers;
        else numbersLength = 0;

        let specialCharactersLength;
        if (useSpecialCharacters) specialCharactersLength = Math.floor(Math.random() * (Math.floor(passwordLength / 3) - minSpecialCharacters + 1)) + minSpecialCharacters;
        else specialCharactersLength = 0;

        let lettersLength = passwordLength - numbersLength - specialCharactersLength;

        let letters = '';
        if (useUpperCaseLetters) letters += UPPERCASE_LETTERS;
        if (useLowerCaseLetters) letters += LOWERCASE_LETTERS;

        if (useNumbers) {
            Array.from({ length: numbersLength }).forEach((_) => {
                tempPassword += NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
            });
        }

        if (useSpecialCharacters) {
            Array.from({ length: specialCharactersLength }).forEach((_) => {
                tempPassword += SPECIAL_CHARACTERS[Math.floor(Math.random() * SPECIAL_CHARACTERS.length)];
            });
        }

        Array.from({ length: lettersLength }).forEach((_) => {
            tempPassword += letters[Math.floor(Math.random() * letters.length)];
        });

        tempPassword = tempPassword.split('').sort(() => Math.random() - 0.5).join('');

        setPassword(tempPassword);

        tempPassword = '';

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const getFontSize = () => {
        if (passwordLength <= 16) return 18;
        if (passwordLength <= 24) return 15;
        return 12;
    }

    const styles = {
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        input: {
            flex: 1,
            width: '80%',
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: getColor('secondary'),
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderBottomWidth: 1,
            borderColor: getColor('primary')
        },
        text: {
            fontFamily: 'Tommy',
            fontSize: 16,
            color: getColor('text')
        },
        copyButton: {
            width: 60,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: getColor('secondary'),
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            borderTopWidth: 1,
            borderRightWidth: 1,
            borderBottomWidth: 1,
            borderColor: getColor('primary')
        },
        section: {
            backgroundColor: getColor('secondary'),
            padding: 15,
            paddingBottom: 0,
            borderRadius: 10
        },
        slider: {
            width: '80%',
            marginVertical: 25
        },
        button: {
            backgroundColor: getColor('primary'),
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            paddingVertical: 15,
            paddingHorizontal: 30
        }
    }

    return (
        <Container>
            <View style={styles.row}>
                <View style={styles.input}>
                    <Text style={[styles.text, { fontSize: getFontSize() }]}>{password}</Text>
                </View>
                <TouchableOpacity onPress={() => Clipboard.setStringAsync(password)} activeOpacity={0.75} style={styles.copyButton}>
                    <FontAwesome6 name='copy' size={28} color={getColor('placeholder')} />
                </TouchableOpacity>
            </View>
            <View style={styles.section}>
                <Text style={styles.text}>{translate('passwordLength')}: {passwordLength}</Text>
                <View style={styles.row}>
                    <Text style={styles.text}>{MIN_PASSWORD_LENGTH}</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={MIN_PASSWORD_LENGTH}
                        maximumValue={MAX_PASSWORD_LENGTH}
                        minimumTrackTintColor={getColor('primary')}
                        maximumTrackTintColor={getColor('text')}
                        thumbTintColor={getColor('primary')}
                        step={1}
                        value={passwordLength}
                        onValueChange={setPasswordLength}
                    />
                    <Text style={styles.text}>{MAX_PASSWORD_LENGTH}</Text>
                </View>
            </View>
            <View style={[styles.section, { paddingBottom: 15 }]}>
                <View style={styles.row}>
                    <View style={[styles.row, { marginBottom: 15 }]}>
                        <Text style={styles.text}>[A-Z]</Text>
                        <Switch
                            trackColor={{ false: colors.red, true: getColor('primary') }}
                            thumbColor={getColor('text')}
                            onValueChange={toggleUseUpperCaseLetters}
                            value={useUpperCaseLetters}
                        />
                    </View>
                    <View style={[styles.row, { marginBottom: 15 }]}>
                        <Text style={styles.text}>[a-z]</Text>
                        <Switch
                            trackColor={{ false: colors.red, true: getColor('primary') }}
                            thumbColor={getColor('text')}
                            onValueChange={toggleUseLowerCaseLetters}
                            value={useLowerCaseLetters}
                        />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.row}>
                        <Text style={styles.text}>[0-9]</Text>
                        <Switch
                            trackColor={{ false: colors.red, true: getColor('primary') }}
                            thumbColor={getColor('text')}
                            onValueChange={toggleUseNumbers}
                            value={useNumbers}
                        />
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>[!@#]</Text>
                        <Switch
                            trackColor={{ false: colors.red, true: getColor('primary') }}
                            thumbColor={getColor('text')}
                            onValueChange={toggleUseSpecialCharacters}
                            value={useSpecialCharacters}
                        />
                    </View>
                </View>
            </View>
            {useNumbers || useSpecialCharacters ? (
                <>
                    <View style={styles.section}>
                        {useNumbers ? (
                            <>
                                <Text style={styles.text}>{translate('minNumbers')}: {minNumbers}</Text>
                                <View style={styles.row}>
                                    <Text style={styles.text}>1</Text>
                                    <Slider
                                        style={styles.slider}
                                        minimumValue={1}
                                        maximumValue={Math.floor(passwordLength / 4)}
                                        minimumTrackTintColor={getColor('primary')}
                                        maximumTrackTintColor={getColor('text')}
                                        thumbTintColor={getColor('primary')}
                                        step={1}
                                        value={minNumbers}
                                        onValueChange={setMinNumbers}
                                    />
                                    <Text style={styles.text}>{Math.floor(passwordLength / 4)}</Text>
                                </View>
                            </>
                        ) : null}
                        {useSpecialCharacters ? (
                            <>
                                <Text style={styles.text}>{translate('minSpecialCharacters')}: {minSpecialCharacters}</Text>
                                <View style={styles.row}>
                                    <Text style={styles.text}>1</Text>
                                    <Slider
                                        style={styles.slider}
                                        minimumValue={1}
                                        maximumValue={Math.floor(passwordLength / 4)}
                                        minimumTrackTintColor={getColor('primary')}
                                        maximumTrackTintColor={getColor('text')}
                                        thumbTintColor={getColor('primary')}
                                        step={1}
                                        value={minSpecialCharacters}
                                        onValueChange={setMinSpecialCharacters}
                                    />
                                    <Text style={styles.text}>{Math.floor(passwordLength / 4)}</Text>
                                </View>
                            </>
                        ) : null}
                    </View>
                </>
            ) : null}
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <TouchableOpacity
                    onPress={() => generateStrongPassword(
                        useUpperCaseLetters,
                        useLowerCaseLetters,
                        useNumbers,
                        useSpecialCharacters,
                        passwordLength,
                        minNumbers,
                        minSpecialCharacters
                    )}
                    activeOpacity={0.75}
                    style={styles.button}
                >
                    <Text style={[styles.text, { color: colors.black }]}>{translate('regenerate')}</Text>
                </TouchableOpacity >
            </View>
        </Container>
    )
}