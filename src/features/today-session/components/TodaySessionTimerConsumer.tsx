import { useEffect } from 'react';
import { toast } from 'sonner';
import store from 'src/app/states/redux/store';
import { subscribeToTimers } from 'src/shared/services/timerRegistry';
import { observeState } from 'src/app/services/observeState';
import sessionService from 'src/features/session/services/sessionService';
import activityService from 'src/features/activity/services/activityService';
import sessionStorageService from 'src/shared/services/sessionStorageService';
import { isToday, toDate } from 'src/shared/utils/TimeUtils';
import { save, setSession, resetToDefaultState, setEndAlertStatus } from '../states/todaySessionSlice';
import { playNotificationAudio } from 'src/shared/services/notificationAudio';
import sound from 'src/assets/audio/399191__spiceprogram__drip-echo.wav';

export default function TodaySessionTimerConsumer() {
    useEffect(() => {
        // Persiste los cambios en memoria (redux), incluso con el temporizador detenido o sin su vista montada.
        const stopSaving = observeState(state => state.todaySession, () => store.dispatch(save()));
        const timer = subscribeToTimers({
            everyMs: 1000,
            onTick: ({ state: { todaySession, todaySessionSettings: settings, appSettings } }) => {
                const { soundsEnabled } = appSettings;
                let session = todaySession.session;
                if (!isToday(toDate(session.createdTimestamp))) {
                    if (session.activities.length) sessionStorageService.saveItems('History', [session]);
                    store.dispatch(resetToDefaultState({ settings }));
                    return;
                }
                if (session.activities.some(activityService.hasRunningTracks)) {
                    session = sessionService.updateTimerAndTracks(session);
                }
                const limit = session.durationLimit.millis;
                const remaining = limit ? limit - sessionService.getSessionDurationMs(session) : Infinity;
                let status = todaySession.endAlertStatus;
                if (remaining > 5 * 60_000) status = 'waiting';
                else if (remaining > 0 && status === 'ended') status = 'waiting';
                if (settings.stopOnSessionEnd && limit) {
                    if (remaining <= 0 && status !== 'ended') {
                        session = sessionService.stopActivities(session);
                        toast.warning('La sesión ha terminado');
                        playNotificationAudio(sound, soundsEnabled);
                        status = 'ended';
                    } else if (remaining > 0 && remaining < 5 * 60_000 && status === 'waiting') {
                        toast.info('La sesión terminará en menos de 5 minutos');
                        playNotificationAudio(sound, soundsEnabled);
                        status = 'alerted';
                    }
                }
                if (session !== todaySession.session) store.dispatch(setSession(session));
                if (status !== todaySession.endAlertStatus) store.dispatch(setEndAlertStatus(status));
            },
        });
        return () => { timer.cancel(); stopSaving(); };
    }, []);
    return null;
}
