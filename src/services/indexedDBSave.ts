
export type IdType = IDBValidKey | undefined;


// Función para abrir o crear la base de datos
async function openDatabase(storeName: string, version: number): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("cronomateDB", version);

        // Cuando se necesita actualizar la base de datos
        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBRequest<IDBDatabase>).result;

            // Si no existe la tienda de objetos, la creamos
            if (!db.objectStoreNames.contains(storeName)) {
                const objectStore = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: false });
                objectStore.createIndex('id', 'id', { unique: true });
            }
        };

        // Si se abre correctamente la base de datos
        request.onsuccess = (event: Event) => {
            resolve((event.target as IDBRequest<IDBDatabase>).result);
        };

        // Si ocurre un error al abrir la base de datos
        request.onerror = (event: Event) => {
            reject((event.target as IDBRequest<IDBDatabase>).error);
        };
    });
}


// Función para guardar un array de objetos genéricos en IndexedDB
async function saveItems<T extends { id: IdType }>(storeName: string, items: T[]): Promise<void> {

    const db = await openDatabase(storeName, 1);
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    items.forEach(item => {
        store.put(item); // Usar put para sobrescribir elementos existentes
    });

    await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => {
            resolve();
        };

        transaction.onerror = (event: Event) => {
            reject((event.target as IDBRequest<Array<T>>).error);
        };
    });
}


// Función para obtener los objetos almacenados
async function getItems<T extends { id: IdType }>(storeName: string): Promise<T[]> {

    const db = await openDatabase(storeName, 1);
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll(); // Obtener todos los elementos

    return await new Promise<T[]>((resolve, reject) => {
        request.onsuccess = (event: Event) => {
            resolve((event.target as IDBRequest<Array<T>>).result);
        };

        request.onerror = (event: Event) => {
            reject((event.target as IDBRequest<Array<T>>).error);
        };
    });
}

// Función para eliminar una lista de ids
async function deleteItems(storeName: string, ids: IdType[]): Promise<void> {

    const db = await openDatabase(storeName, 1);
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    // Eliminar cada item por su id
    ids.forEach(id => {
        if (!id) return;
        store.delete(id as IDBValidKey); // Eliminar el objeto con el id correspondiente
    });

    await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => {
            resolve();
        };

        transaction.onerror = (event: Event) => {
            reject((event.target as IDBRequest<Array<{ id: string | number }>>).error);
        };
    });
}

export default { saveItems, getItems, deleteItems };
