import { Text } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import * as Haptics from 'expo-haptics';

import Container from '../components/Container';
import Modal from '../components/Modal';
import Setting from '../components/Setting';

import { useSettings } from '../SettingsProvider';

import Colors from '../constants/Colors';

var pkg = require('../package.json');

export default function SettingsScreen() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);

    const { getColor, translate } = useSettings();

    const navigation = useNavigation();

    const handleModal = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Error);
        setIsModalVisible(!isModalVisible);
    }

    const deleteAllPasswords = async () => {
        await SecureStore.deleteItemAsync('passwords');
        setIsModalVisible(false);
        setIsConfirmationModalVisible(true);
    }

    const styles = {
        text: {
            fontFamily: 'Tommy',
            fontSize: 12,
            color: getColor('placeholder'),
            alignSelf: 'center',
            position: 'absolute',
            bottom: 10
        }
    }

    return (
        <Container>
            <Setting name={translate('language')} icon={'globe'} color={getColor('text')} type='navigate' onPress={() => navigation.navigate('SelectionScreen', { screen: 'language' })} />
            <Setting name={translate('theme')} icon={'palette'} color={getColor('text')} type='navigate' onPress={() => navigation.navigate('SelectionScreen', { screen: 'theme' })} />
            <Setting name={translate('deleteAllPasswords')} icon={'trash-can'} color={Colors.red} onPress={handleModal} />
            <Text style={styles.text}>v{pkg.version}</Text>
            <Modal
                isVisible={isModalVisible}
                text={translate('areYouSureYouWantToDeleteAllPasswords')}
                twoButtons={true}
                buttonOneText={translate('yes')}
                buttonOneOnPress={deleteAllPasswords}
                buttonTwoText={translate('no')}
                buttonTwoOnPress={() => setIsModalVisible(!isModalVisible)}
            />
            <Modal
                isVisible={isConfirmationModalVisible}
                text={translate('allPasswordsDeletedSuccessfully')}
                twoButtons={false}
                buttonOneText={translate('ok')}
                buttonOneOnPress={() => setIsConfirmationModalVisible(!isConfirmationModalVisible)}
            />
        </Container>
    )
}
