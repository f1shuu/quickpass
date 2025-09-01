import { View } from 'react-native';

import { useSettings } from '../SettingsProvider';

export default function Container({ children }) {
    const { theme } = useSettings();

    const styles = {
        container: {
            flex: 1,
            backgroundColor: theme.background,
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
