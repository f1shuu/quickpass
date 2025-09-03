import { Text, View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

import { useSettings } from '../SettingsProvider';

import Colors from '../constants/Colors';

export default function CustomModal({ isVisible, text, twoButtons, buttonOneText, buttonOneOnPress, buttonTwoText, buttonTwoOnPress }) {
    const { getColor } = useSettings();

    const styles = {
        modal: {
            backgroundColor: getColor('secondary'),
            position: 'absolute',
            bottom: 0,
            width: '100%',
            margin: 0,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15
        },
        text: {
            fontFamily: 'Tommy',
            fontSize: 18,
            color: getColor('text'),
            textAlign: 'center'
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 20
        },
        button: {
            borderRadius: 10,
            paddingVertical: 15,
            paddingHorizontal: 60
        }
    }

    return (
        <Modal isVisible={isVisible} style={[styles.modal, { height: (twoButtons == true ? '25%' : '20%') }]} backdropTransitionOutTiming={1} >
            <Text style={styles.text}>{text}</Text>
            {twoButtons ? (<View style={styles.row}>
                <TouchableOpacity
                    onPress={buttonOneOnPress}
                    activeOpacity={0.75}
                    style={[styles.button, { backgroundColor: Colors.red }]}
                >
                    <Text style={[styles.text, { color: Colors.black }]}>{buttonOneText}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={buttonTwoOnPress}
                    activeOpacity={0.75}
                    style={[styles.button, { backgroundColor: getColor('primary') }]}
                >
                    <Text style={[styles.text, { color: Colors.black }]}>{buttonTwoText}</Text>
                </TouchableOpacity>
            </View>) :
                <View style={styles.row}>
                    <TouchableOpacity
                        onPress={buttonOneOnPress}
                        activeOpacity={0.75}
                        style={[styles.button, { backgroundColor: getColor('primary') }]}
                    >
                        <Text style={[styles.text, { color: Colors.black }]}>{buttonOneText}</Text>
                    </TouchableOpacity>
                </View>}
        </Modal >
    )
}
