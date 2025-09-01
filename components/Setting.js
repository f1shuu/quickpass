import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import * as Haptics from 'expo-haptics';
import CountryFlag from 'react-native-country-flag';

import { useSettings } from '../SettingsProvider';

export default function Setting({ flag, icon, name, color, onPress, type, parameter }) {
    const { settings, theme, updateSettings } = useSettings();

    const styles = {
        widget: {
            backgroundColor: theme.secondary,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            borderRadius: 10,
            height: 70
        },
        text: {
            fontFamily: 'Tommy',
            fontSize: 16,
            alignSelf: 'center',
            marginLeft: 15
        }
    }

    const toggleSetting = (newValue) => {
        updateSettings({ [parameter]: newValue });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    return (
        <TouchableOpacity onPress={type === 'toggle' ? () => toggleSetting(!settings[parameter]) : onPress} style={styles.widget} activeOpacity={0.8} >
            <View style={{ flexDirection: 'row' }}>
                {flag ? (
                    <CountryFlag isoCode={flag} size={16} style={{ alignSelf: 'center' }} />
                ) : (
                    <Icon name={icon} size={24} color={color} />
                )}
                <Text style={[styles.text, { color }]}>{name}</Text>
            </View>
            {type === 'navigate' ? (
                <Icon name='caret-right' size={24} color={color} />
            ) : type === 'check' ? (
                <Icon name='check' size={24} color={theme.primary} />
            ) : null}
        </TouchableOpacity>
    )
}
