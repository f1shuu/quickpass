import { Text, TouchableOpacity } from 'react-native';

import { useTheme } from '../providers/ThemeProvider';

export default function Button({ onPress, variant, text, children }) {
    const theme = useTheme();

    const styles = {
        common: {
            backgroundColor: theme.tertiary,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10
        },
        wide: {
            height: 60,
            maxWidth: '100%',
            paddingHorizontal: 50
        },
        narrow: {
            width: 60,
            height: 60
        },
        text: {
            fontFamily: 'Tommy',
            fontSize: 20,
            color: theme.primary
        }
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.common, variant === 'wide' ? styles.wide : styles.narrow]}>
            {variant === 'wide' ? <Text style={styles.text}>{text}</Text> : children}
        </TouchableOpacity >
    )
}
