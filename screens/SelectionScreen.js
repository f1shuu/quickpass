import { View } from 'react-native';
import * as Haptics from 'expo-haptics';

import Container from '../components/Container';
import Setting from '../components/Setting';

import { useSettings } from '../SettingsProvider';

export default function SelectionScreen({ route }) {
    const { changeTheme, settings, theme, translate, updateSettings } = useSettings();

    const updateLanguage = (newValue) => {
        updateSettings({ 'language': newValue });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const updateTheme = (newValue) => {
        changeTheme(newValue);
        updateSettings({ 'theme': newValue });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    return (
        <Container>
            <View style={{ gap: 10 }}>
                {route.params.screen === 'language' ? (
                    <>
                        <Setting active={true} name='Polski' color={theme.text} onPress={() => updateLanguage('pl')} type={settings.language === 'pl' ? 'check' : null} style={{ paddingLeft: -10 }} />
                        <Setting active={true} name='English' color={theme.text} onPress={() => updateLanguage('en')} type={settings.language === 'en' ? 'check' : null} style={{ paddingLeft: -10 }} />
                    </>
                ) : (
                    <>
                        <Setting active={true} name={translate('dark')} color={theme.text} onPress={() => updateTheme('dark')} type={settings.theme === 'dark' ? 'check' : null} style={{ paddingLeft: -10 }} />
                        <Setting active={true} name={translate('light')} color={theme.text} onPress={() => updateTheme('light')} type={settings.theme === 'light' ? 'check' : null} style={{ paddingLeft: -10 }} />
                    </>
                )}
            </View>
        </Container>
    )
}