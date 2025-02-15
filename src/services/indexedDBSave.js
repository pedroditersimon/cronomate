var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Función para abrir o crear la base de datos
function openDatabase(storeName, version) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("cronomateDB", version);
            // Cuando se necesita actualizar la base de datos
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                // Si no existe la tienda de objetos, la creamos
                if (!db.objectStoreNames.contains(storeName)) {
                    const objectStore = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: false });
                    objectStore.createIndex('id', 'id', { unique: true });
                }
            };
            // Si se abre correctamente la base de datos
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            // Si ocurre un error al abrir la base de datos
            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    });
}
// Función para guardar un array de objetos genéricos en IndexedDB
function saveItems(storeName, items) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield openDatabase(storeName, 1);
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        items.forEach(item => {
            store.put(item); // Usar put para sobrescribir elementos existentes
        });
        yield new Promise((resolve, reject) => {
            transaction.oncomplete = () => {
                resolve();
            };
            transaction.onerror = (event) => {
                reject(event.target.error);
            };
        });
    });
}
// Función para obtener los objetos almacenados
function getItems(storeName) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield openDatabase(storeName, 1);
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.getAll(); // Obtener todos los elementos
        return yield new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    });
}
// Función para eliminar una lista de ids
function deleteItems(storeName, ids) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield openDatabase(storeName, 1);
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        // Eliminar cada item por su id
        ids.forEach(id => {
            if (!id)
                return;
            store.delete(id); // Eliminar el objeto con el id correspondiente
        });
        yield new Promise((resolve, reject) => {
            transaction.oncomplete = () => {
                resolve();
            };
            transaction.onerror = (event) => {
                reject(event.target.error);
            };
        });
    });
}
export default { saveItems, getItems, deleteItems };
