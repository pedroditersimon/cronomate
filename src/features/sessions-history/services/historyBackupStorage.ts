import localSave from "src/shared/services/localSave";

const listeners = new Set<() => void>();

export const getLastBackup = () => localSave.load<string | null>("lastHistoryBackup", null);

export function recordBackup() {
    localSave.save("lastHistoryBackup", new Date().toISOString());
    listeners.forEach(listener => listener());
}

export function subscribeToBackups(listener: () => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
}

export function isCurrentMonth(date: string | null, now = new Date()) {
    if (!date) return false;
    const saved = new Date(date);
    return saved.getFullYear() === now.getFullYear() && saved.getMonth() === now.getMonth();
}

export const getLastBackupReminder = () => localSave.load<string | null>("lastHistoryBackupReminder", null);
export const recordBackupReminder = () => localSave.save("lastHistoryBackupReminder", new Date().toISOString());
