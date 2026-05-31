import * as Haptics from 'expo-haptics';

import Container from '../components/Container';
import Setting from '../components/Setting';

import { useSettings } from '../SettingsProvider';

export default function SelectionScreen({ route }) {
    const { getColor, settings, translate, updateSettings } = useSettings();

    const updateLanguage = (newValue) => {
        updateSettings({ 'language': newValue });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    return (
        <Container>
            <Setting flag={'pl'} name='Polski' color={getColor('text')} onPress={() => updateLanguage('pl')} type={settings.language === 'pl' ? 'check' : null} style={{ paddingLeft: -10 }} />
            <Setting flag={'gb'} name='English' color={getColor('text')} onPress={() => updateLanguage('en')} type={settings.language === 'en' ? 'check' : null} style={{ paddingLeft: -10 }} />
        </Container>
    )
}