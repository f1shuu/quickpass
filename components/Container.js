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
        }
    }

    return (
        <View style={styles.container}>
            {children}
        </View>
    )
}
