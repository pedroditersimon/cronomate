import useTodaySession from "src/features/today-session/hooks/useTodaySession";
import { useAudioPlayer } from "src/shared/hooks/useAudioPlayer";
import NoteAndChecklistPlinth from "src/features/notes/components/NoteAndChecklistPlinth";
import sessionService from "src/features/session/services/sessionService";
import { Note } from "src/features/notes/types/Note";
import { CheckItem } from "src/features/notes/types/CheckItem";

export default function TodayNoteAndChecklistPlinth() {
    const { note, checklist, todaySession, setSession } = useTodaySession();
    const { playAudio } = useAudioPlayer({ volume: 0.5 });

    const updateNote = (note: Note) => {
        const updatedSession = sessionService.updateNote(todaySession.session, note.content);
        setSession(updatedSession);
    }

    const updateChecklist = (item: CheckItem) => {
        const updatedSession = sessionService.updateCheckItem(
            todaySession.session,
            item.id, item.content, item.due, item.isDone
        );
        setSession(updatedSession);
    }

    const addCheckItem = (item: CheckItem) => {
        const updatedSession = sessionService.createCheckItem(todaySession.session, item.content);
        setSession(updatedSession);
    }

    const deleteCheckItem = (itemId: string) => {
        const updatedSession = sessionService.removeCheckItem(todaySession.session, itemId);
        setSession(updatedSession);
    }

    return (
        <NoteAndChecklistPlinth
            className="h-[26rem]"
            note={note}
            onNoteChange={updateNote}
            checklist={checklist}
            onCheckItemAdd={addCheckItem}
            onCheckItemDelete={deleteCheckItem}
            onCheckItemUpdate={updateChecklist}
        />
    );
}
