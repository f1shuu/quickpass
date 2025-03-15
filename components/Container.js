import { Text, View } from 'react-native';

import { useTheme } from '../providers/ThemeProvider';

export default function Container({ title, children }) {
    const theme = useTheme();

    const styles = {
        container: {
            flex: 1,
            backgroundColor: theme.primary,
            padding: 30
        },
        text: {
            fontFamily: 'Tommy',
            fontSize: 24,
            color: theme.text,
            marginBottom: 30
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{title}</Text>
            {children}
        </View>
    )
}
