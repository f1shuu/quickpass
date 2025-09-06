import { Text, View, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import * as SecureStore from 'expo-secure-store';

import Container from '../components/Container';

import { useSettings } from '../SettingsProvider';

import colors from '../constants/colors';

export default function ImportExportScreen() {
    const [overwrite, setOverwrite] = useState(false);
    const [isPasswords, setIsPasswords] = useState(false);

    const { getColor, translate } = useSettings();

    const navigation = useNavigation();

    useEffect(() => {
        return navigation.addListener('focus', () => {
            checkForPasswords();
        })
    }, [navigation])

    const checkForPasswords = async () => {
        try {
            const storedPasswords = await SecureStore.getItemAsync('passwords');
            if (storedPasswords && JSON.parse(storedPasswords).length > 0) setIsPasswords(true);
            else setIsPasswords(false);
        } catch (error) {
            console.error(error);
        }
    }

    const styles = {
        divider: {
            height: '50%',
            borderBottomWidth: 1,
            borderColor: getColor('placeholder')
        },
        title: {
            fontFamily: 'Tommy',
            fontSize: 16,
            color: getColor('placeholder'),
            marginTop: 5
        },
        text: {
            fontFamily: 'Tommy',
            fontSize: 14,
            color: getColor('text')
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 15
        },
        checkBox: {
            width: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: getColor('primary'),
            marginVertical: 10
        },
        checkBoxText: {
            fontFamily: 'Tommy',
            fontSize: 12,
            color: getColor('placeholder'),
            marginLeft: -5,
            marginBottom: 2.5
        },
        button: {
            backgroundColor: getColor('primary'),
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            paddingVertical: 15,
            paddingHorizontal: 30,
            marginVertical: 15
        },
        buttonText: {
            fontFamily: 'Tommy',
            fontSize: 16,
            color: colors.black
        },
        warningText: {
            color: colors.red,
            marginBottom: 15
        }
    }

    return (
        <Container>
            <View style={styles.divider}>
                <Text style={styles.title}>{translate('csvImport')}</Text>
                <Text style={[styles.text, { marginVertical: 15 }]}>{translate('csvImportDescription')}</Text>
                <Text style={[styles.text, { color: getColor('placeholder') }]}>{translate('inCaseOfDuplicates')}</Text>
                <View style={styles.row}>
                    <TouchableOpacity
                        onPress={() => setOverwrite(true)}
                        activeOpacity={0.75}
                        style={[styles.checkBox, { backgroundColor: overwrite ? getColor('primary') : getColor('background') }]}
                    >
                        <Icon name={'check'} size={18} color={getColor('background')} />
                    </TouchableOpacity>
                    <Text style={styles.checkBoxText}>{translate('overwrite')}</Text>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity
                        onPress={() => setOverwrite(false)}
                        activeOpacity={0.75}
                        style={[styles.checkBox, { backgroundColor: !overwrite ? getColor('primary') : getColor('background') }]}
                    >
                        <Icon name={'check'} size={18} color={getColor('background')} />
                    </TouchableOpacity>
                    <Text style={styles.checkBoxText}>{translate('keepBoth')}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => { }}
                    activeOpacity={0.75}
                    style={styles.button}
                >
                    <View style={styles.row}>
                        <Icon name={'right-to-bracket'} size={24} color={colors.black}></Icon>
                        <Text style={styles.buttonText}>{translate('csvImport')}</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View>
                <Text style={styles.title}>{translate('csvExport')}</Text>
                <Text style={[styles.text, { marginVertical: 15 }]}>{translate('csvExportDescription')}</Text>
                <Text style={[styles.text, styles.warningText]}>{translate('csvExportWarning')}</Text>
                <TouchableOpacity
                    onPress={() => { }}
                    activeOpacity={0.75}
                    disabled={!isPasswords}
                    style={[styles.button, { backgroundColor: isPasswords ? getColor('primary') : getColor('tertiary') }]}
                >
                    <View style={styles.row}>
                        <Icon name={'right-from-bracket'} size={24} color={colors.black}></Icon>
                        <Text style={styles.buttonText}>{translate('csvExport')}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </Container>
    )
}