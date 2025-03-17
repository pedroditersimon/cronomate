import { version } from '../../../package.json';
const appVersion = version;
import { ISavedObject } from 'src/types/types';

// save in local storage
function save<T>(keyName: string, value: T) {
    localStorage.setItem(keyName, JSON.stringify({
        savedTimeStamp: new Date().getTime(),
        appVersion,
        value
    } as ISavedObject<T>));
};

// load SaveObjectType from local storage
function getSaveObject<T>(keyName: string): ISavedObject<T> | null {
    const savedValue = localStorage.getItem(keyName);
    if (!savedValue) return null;
    try {
        return JSON.parse(savedValue) as ISavedObject<T>;
    }
    catch (error) {
        console.error("Error loading from localStorage:", error);
        return null;
    }
};

// load SaveObjectType.value from local storage
function load<T>(keyName: string, defaultValue: T): T {
    const savedObj = getSaveObject<T>(keyName);
    if (!savedObj) return defaultValue;
    try {
        return savedObj.value;
    }
    catch (error) {
        console.error("Error loading from localStorage:", error);
        return defaultValue;
    }
};

export default { save, load, getSaveObject };