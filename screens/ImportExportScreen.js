import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import * as DocumentPicker from 'expo-document-picker';
import { Directory, File } from 'expo-file-system';

import Container from '../components/Container';

import { useSettings } from '../SettingsProvider';

import { getAppNames } from '../constants/appNames';
import colors from '../constants/colors';
import { getPasswords, savePasswords } from '../storage/passwordStorage';
import {
    createExportFileName,
    createPasswordsExportCsv,
    isCsvFileAsset,
    mergePasswordsForImport,
    parsePasswordsImportCsv
} from '../utils/passwordCsv';

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

    const isPickerCancelError = (error) => {
        const message = error?.message?.toLowerCase() ?? '';
        const code = error?.code?.toLowerCase() ?? '';

        return message.includes('cancel') || code.includes('cancel');
    }

    const getImportErrorMessage = (error) => {
        const message = translate(error?.code || error?.message || 'unknownError');
        const skippedRows = (error?.stats?.emptyRows ?? 0) + (error?.stats?.emptyFieldRows ?? 0);

        if (skippedRows > 0) return `${message}\n${translate('csvImportSkippedEmpty')}: ${skippedRows}`;

        return message;
    }

    const buildImportSummary = (parseStats, mergeStats) => {
        const emptyRows = parseStats.emptyRows + parseStats.emptyFieldRows;
        const duplicateRows = mergeStats.appDuplicates + mergeStats.importDuplicates;
        const lines = [
            `${translate('csvImportImported')}: ${mergeStats.savedImportedRows}`
        ];

        if (emptyRows > 0) lines.push(`${translate('csvImportSkippedEmpty')}: ${emptyRows}`);
        if (duplicateRows > 0) {
            lines.push(`${translate(overwrite ? 'csvImportDuplicatesOverwritten' : 'csvImportDuplicatesKept')}: ${duplicateRows}`);
        }

        return lines.join('\n');
    }

    const checkForPasswords = async () => {
        try {
            const storedPasswords = await getPasswords();
            setIsPasswords(storedPasswords.length > 0);
        } catch (error) {
            console.error(error);
        }
    }

    const handleImport = async () => {
        let existingPasswords = null;
        let shouldRollback = false;

        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            })

            if (result.canceled) return;

            const asset = result.assets[0];
            if (!isCsvFileAsset(asset)) throw new Error('csvImportInvalidFile');

            const file = new File(asset.uri);

            let text;
            if (typeof file.text === 'function') text = await file.text();
            else if (typeof file.textSync === 'function') text = file.textSync();
            else throw new Error('File API does not support reading text in this runtime.');

            const parsedImport = parsePasswordsImportCsv(text, getAppNames(translate), uuidv4);

            existingPasswords = await getPasswords();

            const mergedImport = mergePasswordsForImport(existingPasswords, parsedImport.passwords, overwrite);

            shouldRollback = true;
            await savePasswords(mergedImport.passwords);
            shouldRollback = false;

            setIsPasswords(mergedImport.passwords.length > 0);

            Alert.alert(translate('csvImportSuccess'), buildImportSummary(parsedImport.stats, mergedImport.stats));
        } catch (err) {
            if (shouldRollback && existingPasswords) {
                try {
                    await savePasswords(existingPasswords);
                } catch (rollbackError) {
                    console.error('Import rollback failed:', rollbackError);
                }
            }

            console.error('Import failed:', err);
            Alert.alert(translate('csvImportFailed'), getImportErrorMessage(err));
        }
    };

    const handleExport = async () => {
        try {
            const passwords = await getPasswords();

            if (passwords.length === 0) {
                setIsPasswords(false);
                Alert.alert(translate('csvExportFailed'), translate('noPasswordsToExport'));
                return;
            }

            const fileName = createExportFileName();
            const csv = createPasswordsExportCsv(passwords);
            const directory = await Directory.pickDirectoryAsync();

            if (!directory) return;

            const file = directory.createFile(fileName, 'text/csv');
            file.write(csv, { encoding: 'utf8' });

            Alert.alert(translate('csvExportSaved'), fileName);
        } catch (err) {
            if (isPickerCancelError(err)) return;

            console.error('Export failed:', err);
            Alert.alert(translate('csvExportFailed'), err.message || translate('unknownError'));
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
                    onPress={handleExport}
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