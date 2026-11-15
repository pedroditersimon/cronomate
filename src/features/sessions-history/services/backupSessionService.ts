import { Session } from "src/features/session/types/Session";
import { TimeTrackStatus } from "src/features/time-track/types/TimeTrack";

function mergeById<T extends { id: string }>(current: T[], incoming: T[]): T[] {
    return [...current, ...incoming.filter(item => !current.some(existing => existing.id === item.id))];
}

export function stopImportedSession(session: Session): Session {
    return {
        ...session,
        activities: session.activities.map(activity => ({
            ...activity,
            tracks: activity.tracks.map(track => track.status === TimeTrackStatus.RUNNING
                ? { ...track, status: TimeTrackStatus.STOPPED }
                : track),
        })),
    };
}

export function mergeBackupSession(current: Session, incoming: Session): Session {
    const activities = current.activities.map(activity => {
        const imported = incoming.activities.find(item => item.id === activity.id);
        return imported ? { ...activity, tracks: mergeById(activity.tracks, imported.tracks) } : activity;
    });
    return {
        ...current,
        activities: mergeById(activities, incoming.activities),
        notes: mergeById(current.notes, incoming.notes),
        checklist: mergeById(current.checklist, incoming.checklist),
    };
}
