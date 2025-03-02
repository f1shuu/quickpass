import { Text, View } from 'react-native';

import { useTheme } from '../providers/ThemeProvider';

export default function Container({ title, children }) {
    const theme = useTheme();

    const styles = {
        container: {
            flex: 1,
            backgroundColor: theme.secondary,
            marginHorizontal: '2.5%',
            padding: 30,
            borderRadius: 25
        },
        text: {
            fontFamily: 'Tommy',
            fontSize: 24,
            color: theme.primary,
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
