import { version } from '../../package.json';
const appVersion = version;
// save in local storage
function save(keyName, value) {
    localStorage.setItem(keyName, JSON.stringify({
        savedTimeStamp: new Date().getTime(),
        appVersion,
        value
    }));
}
;
// load SaveObjectType from local storage
function getSaveObject(keyName) {
    const savedValue = localStorage.getItem(keyName);
    if (!savedValue)
        return null;
    try {
        return JSON.parse(savedValue);
    }
    catch (error) {
        console.error("Error loading from localStorage:", error);
        return null;
    }
}
;
// load SaveObjectType.value from local storage
function load(keyName, defaultValue) {
    const savedObj = getSaveObject(keyName);
    if (!savedObj)
        return defaultValue;
    try {
        return savedObj.value;
    }
    catch (error) {
        console.error("Error loading from localStorage:", error);
        return defaultValue;
    }
}
;
export default { save, load, getSaveObject };
