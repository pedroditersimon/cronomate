import { useEffect } from 'react';
import { DateTime } from 'luxon';
import { toast } from 'sonner';
import store from 'src/app/states/redux/store';
import { subscribeToTimers } from 'src/shared/services/timerRegistry';
import { observeState } from 'src/app/services/observeState';
import { playNotificationAudio } from 'src/shared/services/notificationAudio';
import sound from 'src/assets/audio/pomodoro-end.wav';
import { save, update, setEndAlertStatus } from '../states/pomodoroSlice';
import { PomodoroState } from '../types/Pomodoro';
import { getStateLabel } from '../utils/getStateLabel';

export default function PomodoroTimerConsumer() {
    useEffect(() => {
        const originalTitle = document.title;
        // Persiste los cambios en memoria (redux), incluso con el temporizador detenido o sin su vista montada. 
        const stopSaving = observeState(state => state.pomodoro, () => store.dispatch(save()));
        const timer = subscribeToTimers({
            everyMs: 500,
            onTick: ({ state: { pomodoro, pomodoroSettings: settings, appSettings }, now }) => {
                const { soundsEnabled } = appSettings;
                if (pomodoro.startTime === null) {
                    document.title = originalTitle;
                    return;
                }
                const duration = pomodoro.state === PomodoroState.FOCUS ? settings.focusDurationMs : settings.restDurationMs;
                const remaining = duration - (now - pomodoro.startTime);
                if (remaining <= 0 && pomodoro.endAlertStatus !== 'ended') {
                    toast.success('Pomodoro finalizado!');
                    playNotificationAudio(sound, soundsEnabled);
                    store.dispatch(setEndAlertStatus('ended'));
                } else if (remaining > 0 && settings.alertOnRemainingMs && remaining <= settings.alertOnRemainingMs && pomodoro.endAlertStatus === 'waiting') {
                    toast.info('Pomodoro esta cerca de finalizar!');
                    playNotificationAudio(sound, soundsEnabled);
                    store.dispatch(setEndAlertStatus('alerted'));
                } else if (remaining > (settings.alertOnRemainingMs || 0) && pomodoro.endAlertStatus !== 'waiting') {
                    store.dispatch(setEndAlertStatus('waiting'));
                }
                // At most one new phase, starting now rather than replaying missed phases.
                if (remaining > 0 || settings.continueOnEnd || pomodoro.remainingMs > 0) store.dispatch(update(settings));
                const current = store.getState().pomodoro;
                document.title = `${getStateLabel(current.state)} ${DateTime.fromMillis(Math.max(0, current.remainingMs)).toFormat('mm:ss')}`;
            },
        });
        return () => { timer.cancel(); stopSaving(); document.title = originalTitle; };
    }, []);
    return null;
}
