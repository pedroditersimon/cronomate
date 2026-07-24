import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import sessionEndAudio from "src/assets/audio/399191__spiceprogram__drip-echo.wav";
import useTodaySession from "src/features/today-session/hooks/useTodaySession";
import { useAudioPlayer } from "src/shared/hooks/useAudioPlayer";
import NoteAndChecklistPlinth from "src/features/notes/components/NoteAndChecklistPlinth";
import sessionService from "src/features/session/services/sessionService";
import { Note } from "src/features/notes/types/Note";
import { CheckItem } from "src/features/notes/types/CheckItem";
import useTimer from "src/shared/hooks/useTimer";
import { getCheckItemDueStatus } from "src/features/notes/utils/checkItemDueStatus";

export default function TodayNoteAndChecklistPlinth() {
    const { note, checklist, todaySession, setSession } = useTodaySession();
    const { playAudio } = useAudioPlayer({ volume: 0.5 });
    const alertedItems = useRef(new Set<string>());
    const [currentTime, setCurrentTime] = useState(() => Date.now());

    const checkDueAlerts = () => {
        const now = Date.now();
        setCurrentTime(now);

        checklist.forEach(item => {
            const dueStatus = getCheckItemDueStatus(item, now);
            if (!dueStatus) return;

            const alertKey = `${item.id}-${item.due}`;

            if (dueStatus === "overdue" && !alertedItems.current.has(`${alertKey}-due`)) {
                toast.warning(`La tarea "${item.content}" terminó`);
                playAudio(sessionEndAudio);
                alertedItems.current.add(`${alertKey}-due`);
            } else if (dueStatus === "upcoming" && !alertedItems.current.has(`${alertKey}-upcoming`)) {
                toast.info(`La tarea "${item.content}" vence en menos de 10 minutos`);
                playAudio(sessionEndAudio);
                alertedItems.current.add(`${alertKey}-upcoming`);
            }
        });
    };

    useEffect(() => {
        checkDueAlerts();
    }, [checkDueAlerts]);

    useTimer({
        timerMs: 30 * 1000,
        isRunning: true,
        pauseOnPageNotVisible: false,
    }, checkDueAlerts);

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
        const updatedSession = sessionService.createCheckItem(todaySession.session, item.content, item.due);
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
            currentTime={currentTime}
            onCheckItemAdd={addCheckItem}
            onCheckItemDelete={deleteCheckItem}
            onCheckItemUpdate={updateChecklist}
        />
    );
}
