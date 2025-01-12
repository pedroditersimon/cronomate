import { version } from '../../package.json';
const appVersion = version;

interface SaveObjectType {
    version: string;
    value: unknown;
}

// save in local storage
function save<T>(keyName: string, value: T) {
    localStorage.setItem(keyName, JSON.stringify({
        version: appVersion,
        value
    } as SaveObjectType));
};

// save from local storage
function load<T>(keyName: string, defaultValue: T) {
    const savedValue = localStorage.getItem(keyName);
    if (!savedValue) return defaultValue;
    try {
        const parsedValue = JSON.parse(savedValue) as SaveObjectType;
        return parsedValue.value as T;
    }
    catch (error) {
        console.error("Error loading from localStorage:", error);
        return defaultValue;
    }
};

export default { save, load };