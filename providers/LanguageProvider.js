import * as Localization from "expo-localization";

export const translate = (key) => translations[Localization.getLocales()[0].languageCode][key] || key;

const translations = {
    pl: {
        addPassword: 'Dodaj hasło',
        allPasswords: 'Wszystkie hasła',
        createPassword: 'Stwórz nowe hasło',
        fallbackLabel: 'Użyj kodu PIN',
        mail: 'E-mail',
        password: 'Hasło',
        promptMessage: 'Zeskanuj odcisk palca',
        setPasscode: 'Ustaw kod PIN',
        unlock: 'Odblokuj',
        website: 'Nazwa'
    },

    en: {
        addPassword: 'Add password',
        allPasswords: 'All passwords',
        createPassword: 'Create a new password',
        fallbackLabel: 'Use passcode',
        mail: 'E-mail',
        password: 'Password',
        promptMessage: 'Scan your fingerprint',
        setPasscode: 'Set passcode',
        unlock: 'Unlock',
        website: 'Webiste name'
    }
}
