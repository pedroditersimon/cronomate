import { useEffect, useState } from "react";
import useTodaySession from "src/features/today-session/hooks/useTodaySession";
import NoteAndChecklistPlinth from "src/features/notes/components/NoteAndChecklistPlinth";
import sessionService from "src/features/session/services/sessionService";
import { Note } from "src/features/notes/types/Note";
import { CheckItem } from "src/features/notes/types/CheckItem";
import { subscribeToTimers } from "src/shared/services/timerRegistry";
import { useNotesSettings } from "src/features/notes/hooks/useNotesSettings";

export default function TodayNoteAndChecklistPlinth() {
    const { notes, checklist, todaySession, setSession } = useTodaySession();
    const { settings } = useNotesSettings();
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
        />
    );
}
