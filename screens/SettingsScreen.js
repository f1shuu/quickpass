import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

import Container from '../components/Container';
import Setting from '../components/Setting';

import { useSettings } from '../SettingsProvider';

export default function SettingsScreen() {
    const { theme, translate } = useSettings();

    const navigation = useNavigation();

    const deleteAllPasswords = async () => {
        await SecureStore.deleteItemAsync('passwords');
    }

    return (
        <Container>
            <Setting name={translate('language')} icon={'globe'} color={theme.text} type='navigate' onPress={() => navigation.navigate('SelectionScreen', { screen: 'language' })} />
            <Setting name={translate('theme')} icon={'palette'} color={theme.text} type='navigate' onPress={() => navigation.navigate('SelectionScreen', { screen: 'theme' })} />
            <Setting name={translate('deleteAllPasswords')} icon={'trash-can'} color={'red'} onPress={deleteAllPasswords} />
        </Container>
    )
}
