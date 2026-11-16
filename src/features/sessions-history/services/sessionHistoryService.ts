import { DateTime } from "luxon";
import { Session } from "src/features/session/types/Session";
import { SavedObject } from "src/shared/types/SavedObject";
import { version } from '../../../../package.json';
import indexedDBSave from "src/shared/services/indexedDBSave";
import sessionStorageService from "src/shared/services/sessionStorageService";
import { recordBackup } from "./historyBackupStorage";
import store from "src/app/states/redux/store";
import { Backup } from "../types/Backup";
import { setSession, save, resetToDefaultState } from "src/features/today-session/states/todaySessionSlice";
import { setSettings as setAppSettings } from "src/features/app-settings/states/appSettingsSlice";
import { setSettings as setTodaySettings, save as saveTodaySettings } from "src/features/today-session/states/todaySessionSettingsSlice";
import { setSettings as setPomodoroSettings } from "src/features/pomodoro/states/pomodoroSettingsSlice";
import { setSettings as setNotesSettings } from "src/features/notes/states/notesSettingsSlice";
import { addProjects } from "src/features/projects/states/projectsSlice";
import sessionStorageVersionConverter from "src/shared/services/sessionStorageVersionConverter";
import { mergeBackupSession, stopImportedSession } from "./backupSessionService";


function exportHistoryWithFileDownload(sessions: Session[]): { fileName: string } {
    // 1. Create a saved object
    const { todaySession, appSettings, todaySessionSettings, pomodoroSettings, notesSettings, projects } = store.getState();
    const today = stopImportedSession(todaySession.session);
    const matching = sessions.find(session => session.id === today.id);
    const allSessions = matching
        ? sessions.map(session => session.id === today.id ? mergeBackupSession(today, stopImportedSession(session)) : session)
        : [...sessions, today];
    const savedObject: SavedObject<Backup> = {
        app_version: version,
        generated_date: new Date().getTime(),
        value: {
            sessions: allSessions.map(stopImportedSession),
            settings: { appSettings, todaySessionSettings, pomodoroSettings, notesSettings, projects },
        },
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
    recordBackup();

    return {
        fileName: `${fileName}.json`
    };
}

async function importHistoryFromFile(file: File) {
    const content = await file.text();

    let parsed: SavedObject<Backup | Session[]>;
    try {
        parsed = JSON.parse(content);
    } catch {
        throw new Error("El archivo no contiene un historial válido (JSON malformado).");
    }
    const sessions = Array.isArray(parsed?.value) ? parsed.value : parsed?.value?.sessions;
    if (!Array.isArray(sessions))
        throw new Error("El archivo no contiene un historial válido.");

    const history: Session[] = sessions.map(session => {
        const converted = sessionStorageVersionConverter.convertSession(session, parsed.app_version, version);
        if (!converted || typeof converted.id !== "string" || !Number.isFinite(converted.createdTimestamp)
            || !Array.isArray(converted.activities) || !Array.isArray(converted.notes) || !Array.isArray(converted.checklist)
            || converted.activities.some((activity: Session["activities"][number]) => !Array.isArray(activity.tracks))) {
            throw new Error("El archivo no contiene un historial válido.");
        }
        return stopImportedSession(converted);
    });
    const isToday = (session: Session) => DateTime.fromMillis(session.createdTimestamp).hasSame(DateTime.now(), "day");
    await sessionStorageService.saveItems("History", history.filter(session => !isToday(session)));

    const todaySessions = history.filter(isToday);
    if (todaySessions.length) {
        const current = store.getState().todaySession.session;
        if (!isToday(current)) {
            if (current.activities.length) await sessionStorageService.saveItems("History", [stopImportedSession(current)]);
            store.dispatch(resetToDefaultState({ settings: store.getState().todaySessionSettings }));
        }
        const merged = todaySessions.reduce(mergeBackupSession, store.getState().todaySession.session);
        store.dispatch(setSession(merged));
        store.dispatch(save());
    }

    const settings = Array.isArray(parsed.value) ? undefined : parsed.value.settings;
    const current = store.getState();
    if (settings?.appSettings) store.dispatch(setAppSettings({ ...current.appSettings, ...settings.appSettings }));
    if (settings?.todaySessionSettings) {
        store.dispatch(setTodaySettings({ newSettings: { ...current.todaySessionSettings, ...settings.todaySessionSettings } }));
        store.dispatch(saveTodaySettings());
    }
    if (settings?.pomodoroSettings) store.dispatch(setPomodoroSettings({ ...current.pomodoroSettings, ...settings.pomodoroSettings }));
    if (settings?.notesSettings) store.dispatch(setNotesSettings({ ...current.notesSettings, ...settings.notesSettings }));
    if (settings?.projects) store.dispatch(addProjects(settings.projects));
}

async function deleteHistory() {
    return await indexedDBSave.deleteStore("History");
}

export default {
    exportHistoryWithFileDownload,
    importHistoryFromFile,
    deleteHistory
};
