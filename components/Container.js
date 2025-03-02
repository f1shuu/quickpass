import { Text, View } from 'react-native';

import { useTheme } from '../providers/ThemeProvider';

export default function Container({ title, children }) {
    const theme = useTheme();

    const styles = {
        container: {
            flex: 1,
            backgroundColor: theme.secondary,
            marginHorizontal: '2.5%',
            padding: 20,
            borderRadius: 25
        },
        text: {
            fontFamily: 'Tommy',
            fontSize: 20,
            color: theme.primary,
            marginBottom: 20
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{title}</Text>
            {children}
        </View>
    )
}
