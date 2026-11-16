import { useEffect, useState } from "react";
import useTodaySession from "src/features/today-session/hooks/useTodaySession";
import NoteAndChecklistPlinth from "src/features/notes/components/NoteAndChecklistPlinth";
import sessionService from "src/features/session/services/sessionService";
import { Note } from "src/features/notes/types/Note";
import { CheckItem } from "src/features/notes/types/CheckItem";
import { subscribeToTimers } from "src/shared/services/timerRegistry";
import { useNotesSettings } from "src/features/notes/hooks/useNotesSettings";
import { DateTime } from "luxon";
import { generateId } from "src/shared/utils/generateId";
import { TimeTrackStatus } from "src/features/time-track/types/TimeTrack";
import useAppSettings from "src/features/app-settings/hooks/useAppSettings";
import { extractProjectFromTitle } from "src/features/projects/services/projectService";

export default function TodayNoteAndChecklistPlinth() {
    const { notes, checklist, todaySession, setSession } = useTodaySession();
    const { settings } = useNotesSettings();
    const { appSettings } = useAppSettings();
    const [currentTime, setCurrentTime] = useState(() => Date.now());
    useEffect(() => {
        const timer = subscribeToTimers({ everyMs: 1000, onTick: ({ now }) => setCurrentTime(now) });
        return timer.cancel;
    }, []);

    const updateNote = (note: Note) => {
        const updatedSession = sessionService.updateNote(todaySession.session, note);
        setSession(updatedSession);
    }

    const addNote = (note: Note) => {
        setSession(sessionService.createNote(todaySession.session, note));
    }

    const deleteNote = (noteId: string) => {
        setSession(sessionService.removeNote(todaySession.session, noteId));
    }

    const reorderNotes = (noteId: string, targetNoteId: string) => {
        setSession(sessionService.reorderNotes(todaySession.session, noteId, targetNoteId));
    }

    const updateChecklist = (item: CheckItem) => {
        const updatedSession = sessionService.updateCheckItem(todaySession.session, item);
        setSession(updatedSession);
    }

    const addCheckItems = (items: CheckItem[]) => {
        const updatedSession = sessionService.createCheckItems(todaySession.session, items);
        setSession(updatedSession);
    }

    const deleteCheckItem = (itemId: string) => {
        const updatedSession = sessionService.removeCheckItem(todaySession.session, itemId);
        setSession(updatedSession);
    }

    const reorderCheckItems = (itemId: string, targetItemId?: string) => {
        const updatedSession = sessionService.reorderCheckItems(todaySession.session, itemId, targetItemId);
        setSession(updatedSession);
    }

    const createActivity = (item: CheckItem) => {
        const title = item.content.trim();
        if (!title) return;

        const projects = todaySession.session.activities.flatMap(activity => activity.project ? [activity.project] : []);
        const extracted = appSettings.detectProjectFromActivityTitle
            ? extractProjectFromTitle(title, projects)
            : { title, project: undefined };
        const now = DateTime.now().toFormat("HH:mm");
        const session = sessionService.stopActivities(todaySession.session);
        setSession(sessionService.addActivity(session, {
            id: generateId(),
            title: extracted.title,
            project: extracted.project,
            tracks: [{ id: generateId(), start: now, end: now, status: TimeTrackStatus.RUNNING }],
        }));
    };

    return (
        <NoteAndChecklistPlinth
            className="h-[26rem]"
            notes={notes}
            onNoteChange={updateNote}
            onNoteAdd={addNote}
            onNoteDelete={deleteNote}
            onNoteReorder={reorderNotes}
            checklist={checklist}
            currentTime={currentTime}
            alertWindowMs={settings.alertBeforeDueMs}
            onCheckItemAdd={addCheckItems}
            onCheckItemDelete={deleteCheckItem}
            onCheckItemUpdate={updateChecklist}
            onCheckItemReorder={reorderCheckItems}
            onCheckItemCreateActivity={createActivity}
        />
    );
}
