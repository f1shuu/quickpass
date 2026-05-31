import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

const LEGACY_PASSWORDS_KEY = 'passwords';
const ENCRYPTED_PASSWORDS_KEY = 'passwordsVault';
const VAULT_SECRET_KEY = 'passwordsVaultSecret';
const VAULT_VERSION = 1;
const SECURE_STORE_OPTIONS = {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY
};

const createVaultSecret = () => `${uuidv4()}${uuidv4()}`;

const getOrCreateVaultSecret = async () => {
    let secret = await SecureStore.getItemAsync(VAULT_SECRET_KEY, SECURE_STORE_OPTIONS);

    if (!secret) {
        secret = createVaultSecret();
        await SecureStore.setItemAsync(VAULT_SECRET_KEY, secret, SECURE_STORE_OPTIONS);
    }

    return secret;
}

const getExistingVaultSecret = async () => {
    const secret = await SecureStore.getItemAsync(VAULT_SECRET_KEY, SECURE_STORE_OPTIONS);
    if (!secret) throw new Error('Password vault key is missing.');

    return secret;
}

const deriveKeys = (secret) => ({
    encryptionKey: CryptoJS.SHA256(`${secret}:encryption`),
    macKey: CryptoJS.SHA256(`${secret}:mac`)
})

const buildMacInput = ({ version, iv, ciphertext }) => `${version}:${iv}:${ciphertext}`;

const createMac = (payload, macKey) => CryptoJS.HmacSHA256(buildMacInput(payload), macKey).toString(CryptoJS.enc.Hex);

const areStringsEqual = (a, b) => {
    if (a.length !== b.length) return false;

    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);

    return diff === 0;
}

const encryptPasswords = async (passwords) => {
    const secret = await getOrCreateVaultSecret();
    const { encryptionKey, macKey } = deriveKeys(secret);
    const iv = CryptoJS.lib.WordArray.random(16);

    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(passwords), encryptionKey, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })

    const payload = {
        version: VAULT_VERSION,
        iv: iv.toString(CryptoJS.enc.Hex),
        ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64)
    }

    return JSON.stringify({
        ...payload,
        mac: createMac(payload, macKey)
    })
}

const decryptPasswords = async (encryptedVault) => {
    const payload = JSON.parse(encryptedVault);

    if (
        payload.version !== VAULT_VERSION ||
        typeof payload.iv !== 'string' ||
        typeof payload.ciphertext !== 'string' ||
        typeof payload.mac !== 'string'
    ) {
        throw new Error('Unsupported password vault format.');
    }

    const secret = await getExistingVaultSecret();
    const { encryptionKey, macKey } = deriveKeys(secret);
    const expectedMac = createMac(payload, macKey);

    if (!areStringsEqual(payload.mac, expectedMac)) throw new Error('Password vault integrity check failed.');

    const decrypted = CryptoJS.AES.decrypt(
        CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Base64.parse(payload.ciphertext)
        }),
        encryptionKey,
        {
            iv: CryptoJS.enc.Hex.parse(payload.iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    )

    const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
    if (!plaintext) throw new Error('Password vault could not be decrypted.');

    const passwords = JSON.parse(plaintext);
    if (!Array.isArray(passwords)) throw new Error('Password vault data is invalid.');

    return passwords;
}

export const getPasswords = async () => {
    const encryptedVault = await AsyncStorage.getItem(ENCRYPTED_PASSWORDS_KEY);
    if (encryptedVault) return decryptPasswords(encryptedVault);

    const legacyPasswords = await AsyncStorage.getItem(LEGACY_PASSWORDS_KEY);
    if (!legacyPasswords) return [];

    const passwords = JSON.parse(legacyPasswords);
    if (!Array.isArray(passwords)) throw new Error('Stored passwords data is invalid.');

    await savePasswords(passwords);
    await AsyncStorage.removeItem(LEGACY_PASSWORDS_KEY);

    return passwords;
}

export const savePasswords = async (passwords) => {
    if (!Array.isArray(passwords)) throw new Error('Passwords must be saved as an array.');

    const encryptedVault = await encryptPasswords(passwords);
    await AsyncStorage.setItem(ENCRYPTED_PASSWORDS_KEY, encryptedVault);
    await AsyncStorage.removeItem(LEGACY_PASSWORDS_KEY);
}

export const clearPasswords = async () => {
    await AsyncStorage.multiRemove([ENCRYPTED_PASSWORDS_KEY, LEGACY_PASSWORDS_KEY]);
    await SecureStore.deleteItemAsync(VAULT_SECRET_KEY, SECURE_STORE_OPTIONS);
}
