import { Text, View, TouchableOpacity } from 'react-native';
import { memo, useState, useCallback } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

const Password = memo(({ item, activeId, setActiveId, starPassword, handleModal, navigation, getColor, colors, translate }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isActive = activeId === item.id;

    const togglePasswordVisiblity = useCallback(() => {
        if (activeId === null || activeId !== item.id) setIsPasswordVisible(false);
        setActiveId(activeId === item.id ? null : item.id);
    }, [activeId, item.id])

    const toggleVisibility = useCallback(() => {
        setIsPasswordVisible((prev) => !prev);
    }, [])

    const copyToClipboard = useCallback((text) => {
        Clipboard.setStringAsync(text);
    }, [])

    const handleEdit = useCallback(() => {
        navigation.navigate('AddPasswordScreen', {
            id: item.id,
            name: item.name,
            icon: item.icon,
            username: item.username,
            password: item.password,
            mode: 'edit'
        })
    }, [item])

    const handleDelete = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Error);
        handleModal(item.id);
    }, [item.id])

    const styles = {
        header: {
            backgroundColor: getColor('secondary'),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
            padding: 15,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderWidth: 1,
            height: 70
        },
        activeHeader: {
            borderColor: getColor('primary'),
            borderBottomWidth: 0
        },
        inactiveHeader: {
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10
        },
        text: {
            fontFamily: 'Tommy',
            fontSize: 16,
            color: getColor('text')
        },
        content: {
            backgroundColor: getColor('secondary'),
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
            padding: 10,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderWidth: 1,
            borderTopWidth: 0,
            borderColor: getColor('primary')
        },
        textBoxes: {
            gap: 10,
            marginBottom: 10
        },
        textBox: {
            backgroundColor: getColor('tertiary'),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: 10,
            borderRadius: 7.5
        },
        smallText: {
            fontFamily: 'Tommy',
            fontSize: 16,
            color: getColor('placeholder')
        },
        visibilityToggle: {
            position: 'absolute',
            right: '125%',
            width: 45,
            height: 45,
            justifyContent: 'center',
            alignItems: 'center'
        },
        button: {
            flex: 1,
            alignItems: 'center',
            borderRadius: 7.5,
            paddingVertical: 10
        }
    }

    return (
        <View>
            <TouchableOpacity
                onPress={togglePasswordVisiblity}
                activeOpacity={0.75}
                style={isActive ? [styles.header, styles.activeHeader] : [styles.header, styles.inactiveHeader]}
            >
                <View style={[styles.row, { gap: 15 }]}>
                    <FontAwesome6 name={item.icon} size={32} color={getColor('text')} />
                    <Text style={styles.text}>{item.name}</Text>
                </View>
                <View style={[styles.row, { gap: 15 }]}>
                    <TouchableOpacity onPress={() => starPassword(item.id)} activeOpacity={0.75}>
                        <FontAwesome6
                            name={'star'}
                            size={20}
                            color={colors.golden}
                            solid={item.favorited ? true : false}
                        />
                    </TouchableOpacity>
                    <FontAwesome6 name={isActive ? 'caret-up' : 'caret-down'} size={24} color={getColor('text')} />
                </View>
            </TouchableOpacity>

            {isActive && (
                <View style={styles.content}>
                    <View style={styles.textBoxes}>
                        <View style={styles.textBox}>
                            <FontAwesome6 name={'user'} size={20} color={getColor('placeholder')} solid={true} />
                            <Text style={styles.smallText}>{item.username}</Text>
                            <TouchableOpacity onPress={() => copyToClipboard(item.username)} activeOpacity={0.75}>
                                <FontAwesome6 name='copy' size={24} color={getColor('placeholder')} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.textBox}>
                            <FontAwesome6 name={'key'} size={20} color={getColor('placeholder')} />
                            <Text style={styles.smallText}>
                                {isPasswordVisible ? item.password : '•'.repeat(item.password.length)}
                            </Text>
                            <View style={styles.row}>
                                <TouchableOpacity style={styles.visibilityToggle} onPress={toggleVisibility}>
                                    <FontAwesome6
                                        name={isPasswordVisible ? 'eye' : 'eye-slash'}
                                        size={20}
                                        color={getColor('placeholder')}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => copyToClipboard(item.password)} activeOpacity={0.75}>
                                    <FontAwesome6 name='copy' size={24} color={getColor('placeholder')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.row, { width: '100%' }]}>
                        <TouchableOpacity
                            onPress={handleEdit}
                            activeOpacity={0.75}
                            style={[styles.button, { backgroundColor: getColor('primary') }]}
                        >
                            <Text style={[styles.text, { color: colors.black }]}>{translate('edit')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleDelete}
                            activeOpacity={0.75}
                            style={[styles.button, { backgroundColor: colors.red }]}
                        >
                            <Text style={[styles.text, { color: colors.black }]}>{translate('delete')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    )
})

export default Password;