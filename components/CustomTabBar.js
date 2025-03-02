import { View, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useTheme } from '../providers/ThemeProvider';

export default function CustomTabBar() {
    const theme = useTheme();

    const navigation = useNavigation();
    const route = useRoute();

    const styles = {
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: theme.primary,
            paddingVertical: 50,
            paddingHorizontal: '15%'
        },
        tab: {
            aspectRatio: 1,
            backgroundColor: theme.secondary,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 25,
            marginTop: 20
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('PasswordsScreen')} style={[styles.tab, { opacity: route.name === 'PasswordsScreen' ? 1 : 0.5, width: route.name === 'PasswordsScreen' ? '35%' : '30%' }]} >
                <Icon name='lock' size={50} color={theme.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('PasswordCreator')} style={[styles.tab, { opacity: route.name === 'PasswordCreator' ? 1 : 0.5, width: route.name === 'PasswordCreator' ? '35%' : '30%' }]} >
                <Icon name='add' size={50} color={theme.primary} />
            </TouchableOpacity>
        </View>
    )
}
