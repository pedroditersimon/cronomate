import { version } from '../../../package.json';
const appVersion = version;

import indexedDBSave from './indexedDBSave';
import { SavedObject, SavedObjectWithId } from 'src/shared/types/SavedObject';
import { IdType } from './indexedDBSave';
import sessionStorageVersionConverter from './sessionStorageVersionConverter';

async function importItems<T extends { id: IdType }>(storeName: string, savedObj: SavedObject<T[]>): Promise<void> {
    const itemsToSave: Array<SavedObjectWithId<T, IdType>> = savedObj.value.map(item => (
        {
            id: item.id,
            generated_date: savedObj.generated_date,
            app_version: savedObj.app_version,
            value: item
        }
    ));
    return indexedDBSave.saveItems(storeName, itemsToSave);
}

// Función para guardar un array de objetos genéricos en IndexedDB
/** [!] If there are sessions with the same ID, they will be overwritten. */
async function saveItems<T extends { id: IdType }>(storeName: string, items: T[]): Promise<void> {
    const itemsToSave: Array<SavedObjectWithId<T, IdType>> = items.map(item => (
        {
            id: item.id,
            generated_date: new Date().getTime(),
            app_version: appVersion,
            value: item
        }
    ));
    return indexedDBSave.saveItems(storeName, itemsToSave);
}


// Función para obtener los objetos almacenados
async function getSavedObjectItems<T extends { id: IdType }>(storeName: string): Promise<SavedObjectWithId<T, IdType>[]> {
    return indexedDBSave.getItems(storeName);
}


// Función para obtener los objetos almacenados
async function getItems<T extends { id: IdType }>(storeName: string): Promise<T[]> {
    const savedObjects = await getSavedObjectItems<T>(storeName);

    // convert each session to actual version
    const convertedSessions = savedObjects.map(savedObject => {
        // is not a ISavedObject
        if (savedObject.value === null) return savedObject;

        return sessionStorageVersionConverter.convertSession(
            savedObject.value,
            savedObject.app_version,
            appVersion
        )
    });

    const nonNullSessions = convertedSessions.filter(s => s !== null);
    return nonNullSessions;
}



// Función para eliminar una lista de ids
async function deleteItems(storeName: string, ids: IdType[]): Promise<void> {
    return indexedDBSave.deleteItems(storeName, ids);
}

export default { saveItems, importItems, getSavedObjectItems, getItems, deleteItems };
