var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { version } from '../../package.json';
const appVersion = version;
import indexedDBSave from './indexedDBSave';
import sessionStorageVersionConverter from './sessionStorageVersionConverter';
// Función para guardar un array de objetos genéricos en IndexedDB
function saveItems(storeName, items) {
    return __awaiter(this, void 0, void 0, function* () {
        const itemsToSave = items.map(item => ({
            id: item.id,
            savedTimeStamp: new Date().getTime(),
            appVersion,
            value: item
        }));
        return indexedDBSave.saveItems(storeName, itemsToSave);
    });
}
// Función para obtener los objetos almacenados
function getSavedObjectItems(storeName) {
    return __awaiter(this, void 0, void 0, function* () {
        return indexedDBSave.getItems(storeName);
    });
}
// Función para obtener los objetos almacenados
function getItems(storeName) {
    return __awaiter(this, void 0, void 0, function* () {
        const savedObjects = yield getSavedObjectItems(storeName);
        // convert each session to actual version
        return savedObjects.map(savedObject => {
            // is not a ISavedObject
            if (savedObject.value === null)
                return savedObject;
            return sessionStorageVersionConverter.convertSession(savedObject.value, savedObject.appVersion, appVersion);
        });
    });
}
// Función para eliminar una lista de ids
function deleteItems(storeName, ids) {
    return __awaiter(this, void 0, void 0, function* () {
        return indexedDBSave.deleteItems(storeName, ids);
    });
}
export default { saveItems, getSavedObjectItems, getItems, deleteItems };
