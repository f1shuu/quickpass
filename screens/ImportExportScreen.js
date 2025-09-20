import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import Papa from 'papaparse';

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

    const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

    const normalizeName = (raw) => {
        if (!raw || raw.trim() === '') return '-';
        return raw;
    }

    const checkForPasswords = async () => {
        try {
            const storedPasswords = await AsyncStorage.getItem('passwords');
            if (storedPasswords && JSON.parse(storedPasswords).length > 0) setIsPasswords(true);
            else setIsPasswords(false);
        } catch (error) {
            console.error(error);
        }
    }

    const handleImport = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'text/csv',
                copyToCacheDirectory: true,
            })

            if (result.canceled) return;

            const asset = result.assets[0];
            const file = new File(asset);

            let text;
            if (typeof file.text === 'function') text = await file.text();
            else if (typeof file.textSync === 'function') text = file.textSync();
            else throw new Error('File API does not support reading text in this runtime.');

            const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
            if (parsed.errors?.length) {
                console.warn('CSV parse errors:', parsed.errors);
                Alert.alert('Import warning', `${parsed.errors.length} rows had issues.`);
            }

            const importedPasswords = parsed.data.map((r) => ({
                id: generateId(),
                name: normalizeName(r.site || r.name),
                username: r.username || '',
                password: r.password || '',
                favorited: false
            }))

            const existingRaw = await AsyncStorage.getItem('passwords');
            let existing = [];
            if (existingRaw) existing = JSON.parse(existingRaw);

            let updated;
            if (overwrite) {
                const existingFiltered = existing.filter(
                    (item) =>
                        !importedPasswords.some(
                            (imp) =>
                                imp.name.toLowerCase() === item.name.toLowerCase() &&
                                imp.username.toLowerCase() === item.username.toLowerCase()
                        )
                );
                updated = [...existingFiltered, ...importedPasswords];
            } else updated = [...existing, ...importedPasswords];

            await AsyncStorage.setItem('passwords', JSON.stringify(updated));

            Alert.alert('Success', `Imported ${importedPasswords.length} passwords`);
        } catch (err) {
            console.error('Import failed:', err);
            Alert.alert('Import failed', err.message || 'Unknown error');
        }
    };

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
                        onPress={() => setOverwrite(false)}
                        activeOpacity={0.75}
                        style={[styles.checkBox, { backgroundColor: !overwrite ? getColor('primary') : getColor('background') }]}
                    >
                        <FontAwesome6 name={'check'} size={18} color={getColor('background')} />
                    </TouchableOpacity>
                    <Text style={styles.checkBoxText}>{translate('keepBoth')}</Text>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity
                        onPress={() => setOverwrite(true)}
                        activeOpacity={0.75}
                        style={[styles.checkBox, { backgroundColor: overwrite ? getColor('primary') : getColor('background') }]}
                    >
                        <FontAwesome6 name={'check'} size={18} color={getColor('background')} />
                    </TouchableOpacity>
                    <Text style={styles.checkBoxText}>{translate('overwrite')}</Text>
                </View>
                <TouchableOpacity
                    onPress={handleImport}
                    activeOpacity={0.75}
                    style={styles.button}
                >
                    <View style={styles.row}>
                        <FontAwesome6 name={'right-to-bracket'} size={24} color={colors.black}></FontAwesome6>
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
                        <FontAwesome6 name={'right-from-bracket'} size={24} color={colors.black}></FontAwesome6>
                        <Text style={styles.buttonText}>{translate('csvExport')}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </Container>
    )
}