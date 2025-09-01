import { useNavigation } from '@react-navigation/native';

import Container from '../components/Container';
import Setting from '../components/Setting';

import { useSettings } from '../SettingsProvider';

export default function SettingsScreen() {
    const { theme, translate } = useSettings();

    const navigation = useNavigation();

    return (
        <Container>
            <Setting name={translate('language')} icon={'translate'} color={theme.text} type='navigate' onPress={() => navigation.navigate('LanguageSelectionScreen')} />
        </Container>
    )
}
