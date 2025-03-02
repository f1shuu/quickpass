import { Text, TouchableOpacity } from 'react-native';

import { useTheme } from '../providers/ThemeProvider';

export default function Button({ onPress, variant, text }) {
    const theme = useTheme();

    const styles = {
        button: {
            padding: 10,
            width: 200,
            height: 60,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            marginTop: 25
        },
        text: {
            fontFamily: 'Tommy',
            fontSize: 20
        }
    }

    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: variant === 'primary' ? theme.primary : theme.secondary }]} >
            <Text style={[styles.text, { color: variant === 'primary' ? theme.secondary : theme.primary }]}>{text}</Text>
        </TouchableOpacity >
    )
}
