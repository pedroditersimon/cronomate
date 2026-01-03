import { DateTime } from "luxon";
import { Session } from "src/features/session/types/Session";
import { SavedObject } from "src/shared/types/SavedObject";
import { version } from '../../../../package.json';
import indexedDBSave from "src/shared/services/indexedDBSave";
import sessionStorageService from "src/shared/services/sessionStorageService";

function exportHistoryWithFileDownload(sessions: Session[]): { fileName: string } {
    // 1. Create a saved object
    const savedObject: SavedObject<Session[]> = {
        app_version: version,
        generated_date: new Date().getTime(),
        value: sessions
    };

    // 2. Create a blob to download it
    const data = JSON.stringify(savedObject, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // 3. Create the file name
    const formattedDate = DateTime.now().toFormat('yyyy-MM-dd');
    const fileName = `cronomate-history-${formattedDate}`;

    // 4. Download the file
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.json`;
    a.click();
    URL.revokeObjectURL(url);

    return {
        fileName: `${fileName}.json`
    };
}

async function importHistoryFromFile(file: File) {
    const content = await file.text();

    let parsed: SavedObject<Session[]>;
    try {
        parsed = JSON.parse(content);
    } catch (e) {
        throw new Error("El archivo no contiene un historial válido (JSON malformado).");
    }
    if (!parsed.value || !Array.isArray(parsed.value))
        throw new Error("El archivo no contiene un historial válido.");

    const history = parsed.value;
    if (history.length === 0) return;

    // [!] If there are sessions with the same ID, they will be overwritten.
    sessionStorageService.importItems<Session>("History", parsed);
}

async function deleteHistory() {
    return await indexedDBSave.deleteStore("History");
}

export default {
    exportHistoryWithFileDownload,
    importHistoryFromFile,
    deleteHistory
};