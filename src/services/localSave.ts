import { version } from '../../package.json';
const appVersion = version;

interface SaveObjectType {
    savedTimeStamp: number; // saved time
    appVersion: string;
    value: unknown;
}

// save in local storage
function save<T>(keyName: string, value: T) {
    localStorage.setItem(keyName, JSON.stringify({
        savedTimeStamp: new Date().getTime(),
        appVersion,
        value
    } as SaveObjectType));
};

// load SaveObjectType from local storage
function getSaveObject(keyName: string): SaveObjectType | null {
    const savedValue = localStorage.getItem(keyName);
    if (!savedValue) return null;
    try {
        return JSON.parse(savedValue) as SaveObjectType;
    }
    catch (error) {
        console.error("Error loading from localStorage:", error);
        return null;
    }
};

// load SaveObjectType.value from local storage
function load<T>(keyName: string, defaultValue: T) {
    const savedObj = getSaveObject(keyName);
    if (!savedObj) return defaultValue;
    try {
        return savedObj.value as T;
    }
    catch (error) {
        console.error("Error loading from localStorage:", error);
        return defaultValue;
    }
};

export default { save, load, getSaveObject };