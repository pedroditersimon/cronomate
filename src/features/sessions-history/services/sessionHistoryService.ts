import { DateTime } from "luxon";
import { Session } from "src/features/session/types/Session";
import { SavedObject } from "src/shared/types/SavedObject";
import { version } from '../../../../package.json';
import indexedDBSave from "src/shared/services/indexedDBSave";

function exportHistoryWithDownload(sessions: Session[]): { fileName: string } {
    // 1. Create a saved object
    const savedObject: SavedObject<typeof sessions> = {
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

function importHistory() { }

async function deleteHistory() {
    return await indexedDBSave.deleteStore("History");
}

export default {
    exportHistoryWithDownload,
    importHistory,
    deleteHistory
};