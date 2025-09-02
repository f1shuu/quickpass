import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

import Container from '../components/Container';
import Setting from '../components/Setting';

import { useSettings } from '../SettingsProvider';

import Colors from '../constants/Colors';

var pkg = require('../package.json');

export default function SettingsScreen() {
    const { getColor, translate } = useSettings();

    const navigation = useNavigation();

    const deleteAllPasswords = async () => {
        await SecureStore.deleteItemAsync('passwords');
    }

    const styles = {
        text: {
            fontFamily: 'Tommy',
            fontSize: 12,
            color: getColor('placeholder'),
            alignSelf: 'center',
            position: 'absolute',
            bottom: 10
        }
    }

    return (
        <Container>
            <Setting name={translate('language')} icon={'globe'} color={getColor('text')} type='navigate' onPress={() => navigation.navigate('SelectionScreen', { screen: 'language' })} />
            <Setting name={translate('theme')} icon={'palette'} color={getColor('text')} type='navigate' onPress={() => navigation.navigate('SelectionScreen', { screen: 'theme' })} />
            <Setting name={translate('deleteAllPasswords')} icon={'trash-can'} color={Colors.red} onPress={deleteAllPasswords} />
            <Text style={styles.text}>v{pkg.version}</Text>
        </Container>
    )
}
