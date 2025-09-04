import { Text, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import Container from '../components/Container';

import { useSettings } from '../SettingsProvider';

import Colors from '../constants/colors';

export default function DefaultLoginScreen() {
    const [defaultLogin, setDefaultLogin] = useState('');
    const [markField, setMarkField] = useState(false);

    const { getColor, settings, translate, updateSettings } = useSettings();

    const navigation = useNavigation();

    async function saveIfPossible() {
        if (!defaultLogin) setMarkField(true);
        else setMarkField(false);

        if (defaultLogin) {
            updateSettings({ 'defaultLogin': defaultLogin });
            navigation.navigate('SettingsScreen');
        }
    }

    async function clearDefaultLogin() {
        if (settings.defaultLogin) {
            setDefaultLogin('')
            updateSettings({ 'defaultLogin': '' });
        }
    }

    const styles = {
        input: {
            width: '100%',
            backgroundColor: getColor('secondary'),
            height: 60,
            fontFamily: 'Tommy',
            color: getColor('text'),
            borderRadius: 10,
            padding: 15,
            borderWidth: 1
        },
        infoText: {
            fontFamily: 'Tommy',
            fontSize: 12,
            color: getColor('placeholder')
        },
        clearButton: {
            backgroundColor: Colors.red,
            alignSelf: 'flex-start',
            borderRadius: 5,
            paddingVertical: 5,
            paddingHorizontal: 10
        },
        text: {
            fontFamily: 'Tommy',
            fontSize: 16,
            color: Colors.black
        },
        button: {
            backgroundColor: getColor('primary'),
            position: 'absolute',
            bottom: '10%',
            alignSelf: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            paddingVertical: 15,
            paddingHorizontal: 30
        }
    }

    return (
        <Container>
            <TextInput
                style={[styles.input, markField ? { borderColor: Colors.red } : { borderColor: getColor('secondary') }]}
                placeholderTextColor={getColor('placeholder')}
                placeholder='johndoe@mail.com'
                value={defaultLogin}
                onChangeText={(text) => setDefaultLogin(text)}
            />
            <Text style={styles.infoText}>{translate('defaultLoginInfo')}</Text>
            <Text style={[styles.infoText, { marginTop: 10 }]}>{translate('currentDefaultLogin')}{settings.defaultLogin || translate('none')}</Text>
            {settings.defaultLogin ? (
                <TouchableOpacity
                    onPress={() => clearDefaultLogin()}
                    activeOpacity={0.75}
                    style={styles.clearButton}
                >
                    <Text style={[styles.text, { fontSize: 12 }]}>{translate('clear')}</Text>
                </TouchableOpacity >
            ) : null}
            <TouchableOpacity
                onPress={() => saveIfPossible()}
                activeOpacity={0.75}
                style={styles.button}
            >
                <Text style={styles.text}>{translate('save')}</Text>
            </TouchableOpacity >
        </Container>
    )
}