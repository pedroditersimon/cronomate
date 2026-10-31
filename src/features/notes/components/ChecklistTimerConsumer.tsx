import { useEffect } from 'react';
import { toast } from 'sonner';
import { subscribeToTimers } from 'src/shared/services/timerRegistry';
import { isToday, toDate } from 'src/shared/utils/TimeUtils';
import { getCheckItemDueStatus } from '../utils/checkItemDueStatus';
import { playNotificationAudio } from 'src/shared/services/notificationAudio';
import sound from 'src/assets/audio/399191__spiceprogram__drip-echo.wav';

export default function ChecklistTimerConsumer() {
    useEffect(() => {
        // Alert history is domain state, not timer lifecycle bookkeeping.
        const alerted = new Set<string>();
        let sessionId: string | undefined;
        const timer = subscribeToTimers({
            everyMs: 1000,
            onTick: ({ state: { todaySession: { session }, notesSettings, appSettings }, now }) => {
                if (sessionId !== session.id || !isToday(toDate(session.createdTimestamp))) {
                    alerted.clear();
                    sessionId = session.id;
                }
                if (!isToday(toDate(session.createdTimestamp))) return;
                for (const item of session.checklist) {
                    const status = getCheckItemDueStatus(item, now, notesSettings.alertBeforeDueMs);
                    if (!status) continue;
                    const key = `${item.id}:${item.due}:${status}`;
                    if (alerted.has(key)) continue;
                    alerted.add(key);
                    toast[status === 'overdue' ? 'warning' : 'info'](`La tarea "${item.content}" ${status === 'overdue' ? 'terminó' : 'vence pronto'}`);
                    playNotificationAudio(sound, appSettings.soundsEnabled);
                }
            },
        });
        return timer.cancel;
    }, []);
    return null;
}
