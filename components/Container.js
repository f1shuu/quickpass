import { View } from 'react-native';

import { useTheme } from '../providers/ThemeProvider';

export default function Container({ children }) {
    const theme = useTheme();

    const styles = {
        container: {
            flex: 1,
            backgroundColor: theme.primary,
            padding: 10,
            gap: 10
        },
        text: {
            fontFamily: 'Tommy',
            fontSize: 24,
            color: theme.text
        }
    }

    return (
        <View style={styles.container}>
            {children}
        </View>
    )
}
