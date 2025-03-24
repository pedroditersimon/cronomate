import { version } from '../../../package.json';
const appVersion = version;

import indexedDBSave from './indexedDBSave';
import { SavedObjectWithId } from 'src/shared/types/SavedObject';
import { IdType } from './indexedDBSave';
import sessionStorageVersionConverter from './sessionStorageVersionConverter';


// Función para guardar un array de objetos genéricos en IndexedDB
async function saveItems<T extends { id: IdType }>(storeName: string, items: T[]): Promise<void> {
    const itemsToSave: Array<SavedObjectWithId<T, IdType>> = items.map(item => (
        {
            id: item.id,
            savedTimestamp: new Date().getTime(),
            appVersion,
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
    return savedObjects.map(savedObject => {
        // is not a ISavedObject
        if (savedObject.value === null) return savedObject;

        return sessionStorageVersionConverter.convertSession(
            savedObject.value,
            savedObject.app_version,
            appVersion
        )
    });
}



// Función para eliminar una lista de ids
async function deleteItems(storeName: string, ids: IdType[]): Promise<void> {
    return indexedDBSave.deleteItems(storeName, ids);
}

export default { saveItems, getSavedObjectItems, getItems, deleteItems };
