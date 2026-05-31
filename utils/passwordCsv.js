import Papa from 'papaparse';

const EXPORT_FIELDS = ['name', 'url', 'username', 'password', 'note'];
const IMPORT_REQUIRED_FIELDS = ['name', 'username', 'password'];
const OTHER_ICON = 'circle-question';

const padDatePart = (value) => String(value).padStart(2, '0');

const createImportError = (code, details = {}) => {
    const error = new Error(code);
    error.code = code;
    Object.assign(error, details);
    return error;
}

const trimValue = (value) => value == null ? '' : String(value).trim();

const normalizeHeader = (header) => trimValue(header).toLowerCase();

const normalizeDuplicateKey = (item) => `${trimValue(item.name).toLowerCase()}|${trimValue(item.username).toLowerCase()}`;

const isEmptyRow = (row) => Object.values(row).every((value) => trimValue(value) === '');

const getAppMatch = (name, appNames) => {
    const normalizedName = name.toLowerCase();
    return appNames.find((item) => item.value.toLowerCase() === normalizedName);
}

export const createExportFileName = (date = new Date()) => {
    const year = date.getFullYear();
    const month = padDatePart(date.getMonth() + 1);
    const day = padDatePart(date.getDate());
    const hours = padDatePart(date.getHours());
    const minutes = padDatePart(date.getMinutes());
    const seconds = padDatePart(date.getSeconds());

    return `QuickPass-export-${year}-${month}-${day}_${hours}.${minutes}.${seconds}.csv`;
}

export const createPasswordsExportCsv = (passwords) => {
    const rows = passwords.map((item) => [
        item.name ?? '',
        '',
        item.username ?? '',
        item.password ?? '',
        ''
    ])

    return Papa.unparse({
        fields: EXPORT_FIELDS,
        data: rows
    })
}

export const isCsvFileAsset = (asset) => {
    const fileName = trimValue(asset?.name).toLowerCase();
    const mimeType = trimValue(asset?.mimeType || asset?.type).toLowerCase();

    if (fileName) return fileName.endsWith('.csv');

    return (
        mimeType === 'text/csv' ||
        mimeType === 'application/csv' ||
        mimeType === 'text/comma-separated-values' ||
        mimeType === 'application/vnd.ms-excel'
    )
}

export const parsePasswordsImportCsv = (text, appNames, createId) => {
    if (typeof createId !== 'function') throw createImportError('csvImportFailed');

    const csvText = String(text ?? '').replace(/^\uFEFF/, '').replace(/[\r\n]+$/, '');
    if (trimValue(csvText) === '') throw createImportError('csvImportInvalidStructure');

    const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: false,
        transformHeader: normalizeHeader
    })

    const fatalErrors = parsed.errors?.filter((error) => error.code !== 'TooFewFields') ?? [];
    if (fatalErrors.length > 0) throw createImportError('csvImportInvalidStructure');

    const fields = parsed.meta?.fields?.map(normalizeHeader).filter(Boolean) ?? [];
    const hasRequiredFields = IMPORT_REQUIRED_FIELDS.every((field) => fields.includes(field));

    if (!hasRequiredFields) throw createImportError('csvImportInvalidStructure');

    const stats = {
        emptyRows: 0,
        emptyFieldRows: 0,
        validRows: 0
    }

    const passwords = [];

    parsed.data.forEach((row) => {
        if (isEmptyRow(row)) {
            stats.emptyRows += 1;
            return;
        }

        const rawName = trimValue(row.name);
        const username = trimValue(row.username);
        const password = trimValue(row.password);

        if (!rawName || !username || !password) {
            stats.emptyFieldRows += 1;
            return;
        }

        const appMatch = getAppMatch(rawName, appNames);

        passwords.push({
            id: createId(),
            icon: appMatch?.icon ?? OTHER_ICON,
            name: appMatch?.value ?? rawName,
            username,
            password,
            favorited: false
        })

        stats.validRows += 1;
    })

    if (passwords.length === 0) throw createImportError('csvImportNoValidRows', { stats });

    return { passwords, stats };
}

export const mergePasswordsForImport = (existingPasswords, importedPasswords, overwrite) => {
    const stats = {
        appDuplicates: 0,
        importDuplicates: 0,
        savedImportedRows: importedPasswords.length
    }

    const importedKeys = new Set();
    importedPasswords.forEach((item) => {
        const key = normalizeDuplicateKey(item);
        if (importedKeys.has(key)) stats.importDuplicates += 1;
        importedKeys.add(key);
    })

    existingPasswords.forEach((item) => {
        if (importedKeys.has(normalizeDuplicateKey(item))) stats.appDuplicates += 1;
    })

    if (!overwrite) {
        return {
            passwords: [...existingPasswords, ...importedPasswords],
            stats
        }
    }

    const importedByKey = new Map();
    const importedOrder = [];

    importedPasswords.forEach((item) => {
        const key = normalizeDuplicateKey(item);

        if (!importedByKey.has(key)) importedOrder.push(key);
        importedByKey.set(key, item);
    })

    const favoritedByKey = new Map();
    const existingWithoutDuplicates = existingPasswords.filter((item) => {
        const key = normalizeDuplicateKey(item);
        const shouldOverwrite = importedByKey.has(key);

        if (shouldOverwrite && !favoritedByKey.has(key)) favoritedByKey.set(key, item.favorited);

        return !shouldOverwrite;
    })

    const deduplicatedImported = importedOrder.map((key) => {
        const item = importedByKey.get(key);
        return { ...item, favorited: favoritedByKey.get(key) ?? item.favorited };
    })

    stats.savedImportedRows = deduplicatedImported.length;

    return {
        passwords: [...existingWithoutDuplicates, ...deduplicatedImported],
        stats
    }
}