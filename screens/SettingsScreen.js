import { Text } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import * as Haptics from 'expo-haptics';

import Container from '../components/Container';
import Modal from '../components/Modal';
import Setting from '../components/Setting';

import { useSettings } from '../SettingsProvider';

import Colors from '../constants/colors';

var pkg = require('../package.json');

export default function SettingsScreen({ onPasscodeReset }) {
    const [isModal1Visible, setIsModal1Visible] = useState(false);
    const [isModal2Visible, setIsModal2Visible] = useState(false);
    const [isConfirmationModal1Visible, setIsConfirmationModal1Visible] = useState(false);
    const [isConfirmationModal2Visible, setIsConfirmationModal2Visible] = useState(false);

    const { getColor, restoreDefault, translate } = useSettings();

    const navigation = useNavigation();

    const handleModal = (modalID) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Error);
        if (modalID === 1) setIsModal1Visible(!isModal1Visible);
        else setIsModal2Visible(!isModal2Visible);
    }

    const deleteAllPasswords = async () => {
        await SecureStore.deleteItemAsync('passwords');
        setIsModal1Visible(false);
        setIsConfirmationModal1Visible(true);
    }

    const restoreDefaultSettings = () => {
        restoreDefault();
        setIsModal2Visible(false);
        setIsConfirmationModal2Visible(true);
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
            <Setting name={translate('defaultLogin')} icon={'user'} color={getColor('text')} type='navigate' onPress={() => navigation.navigate('DefaultLoginScreen')} />
            <Setting name={translate('changePasscode')} icon={'hashtag'} color={getColor('text')} type='navigate' onPress={onPasscodeReset} />
            <Setting name={translate('deleteAllPasswords')} icon={'trash-can'} color={Colors.red} onPress={() => handleModal(1)} />
            <Setting name={translate('restoreDefault')} icon={'rotate-right'} color={getColor('text')} onPress={() => handleModal(2)} />
            <Text style={styles.text}>v{pkg.version}</Text>
            <Modal
                isVisible={isModal1Visible}
                text={translate('areYouSureYouWantToDeleteAllPasswords')}
                twoButtons={true}
                buttonOneText={translate('yes')}
                buttonOneOnPress={deleteAllPasswords}
                buttonTwoText={translate('no')}
                buttonTwoOnPress={() => setIsModal1Visible(!isModal1Visible)}
            />
            <Modal
                isVisible={isConfirmationModal1Visible}
                text={translate('allPasswordsDeletedSuccessfully')}
                twoButtons={false}
                buttonOneText={translate('ok')}
                buttonOneOnPress={() => setIsConfirmationModal1Visible(!isConfirmationModal1Visible)}
            />
            <Modal
                isVisible={isModal2Visible}
                text={translate('areYouSureYouWantToRestoreDefaultSettings')}
                twoButtons={true}
                buttonOneText={translate('yes')}
                buttonOneOnPress={restoreDefaultSettings}
                buttonTwoText={translate('no')}
                buttonTwoOnPress={() => setIsModal2Visible(!isModal2Visible)}
            />
            <Modal
                isVisible={isConfirmationModal2Visible}
                text={translate('defaultSettingsSuccessfullyRestored')}
                twoButtons={false}
                buttonOneText={translate('ok')}
                buttonOneOnPress={() => setIsConfirmationModal2Visible(!isConfirmationModal2Visible)}
            />
        </Container>
    )
}
