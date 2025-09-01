import { View } from 'react-native';
import * as Haptics from 'expo-haptics';

import Container from '../components/Container';
import Setting from '../components/Setting';

import { useSettings } from '../SettingsProvider';

export default function LanguageSelectionScreen() {
    const { settings, theme, updateSettings } = useSettings();

    const changeLanguage = (newValue) => {
        updateSettings({ 'language': newValue });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    return (
        <Container>
            <View style={{ gap: 10 }}>
                <Setting active={true} name='Polski' color={theme.text} onPress={() => changeLanguage('pl')} type={settings.language === 'pl' ? 'check' : null} style={{ paddingLeft: -10 }} />
                <Setting active={true} name='English' color={theme.text} onPress={() => changeLanguage('en')} type={settings.language === 'en' ? 'check' : null} style={{ paddingLeft: -10 }} />
            </View>
        </Container>
    )
}