import * as Localization from "expo-localization";

export const translate = (key) => translations[Localization.getLocales()[0].languageCode][key] || key;

const translations = {
    pl: {
        createPassword: 'Stwórz nowe hasło',
        fallbackLabel: 'Użyj kodu PIN',
        passwordsList: 'Lista haseł',
        promptMessage: 'Zeskanuj odcisk palca',
        setPasscode: 'Ustaw kod PIN',
        unlock: 'Odblokuj'
    },

    en: {
        createPassword: 'Create a new password',
        fallbackLabel: 'Use passcode',
        passwordsList: 'Passwords list',
        promptMessage: 'Scan your fingerprint',
        setPasscode: 'Set passcode',
        unlock: 'Unlock'
    }
}