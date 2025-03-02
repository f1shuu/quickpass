import * as Localization from "expo-localization";

export const translate = (key) => translations[Localization.getLocales()[0].languageCode][key] || key;

const translations = {
    pl: {
        fallbackLabel: 'Użyj kodu PIN',
        promptMessage: 'Zeskanuj odcisk palca',
        setPasscode: 'Ustaw kod PIN',
        unlock: 'Odblokuj'
    },

    en: {
        fallbackLabel: 'Use passcode',
        promptMessage: 'Scan your fingerprint',
        setPasscode: 'Set passcode',
        unlock: 'Unlock'
    }
}