import { useEffect } from "react";
import { TimeTrackStatus } from "src/features/time-track/types/TimeTrack";
import TodaySessionSettings from "src/features/today-session/components/TodaySessionSettings";
import useTodaySession from "src/features/today-session/hooks/useTodaySession";
import useTodaySessionSettigs from "src/features/today-session/hooks/useTodaySessionSettigs";
import sessionService from "src/features/session/services/sessionService";
import useTimer from "src/shared/hooks/useTimer";
import { isToday, toDate } from "src/shared/utils/TimeUtils";
import WorkSessionComponent from "src/features/session/components/Session";

import { useAudioPlayer } from 'src/shared/hooks/useAudioPlayer';
import sessionEndAudio from "src/assets/audio/399191__spiceprogram__drip-echo.wav";
import { DateTime, Interval } from "luxon";
import { toast } from "sonner";
import activityService from "src/features/activity/services/activityService";


interface Props {
    readOnly?: boolean;
}

export default function TodaySession({ readOnly }: Props) {
    const { todaySession, save, setSession, saveInHistoryAndReset, resetToDefaultState, setEndAlertStatus } = useTodaySession();
    const { todaySessionSettings } = useTodaySessionSettigs();
    const { playAudio } = useAudioPlayer({ volume: 0.5 });

    const hasRunningTracks = todaySession.session.activities.some(act => activityService.hasRunningTracks(act));


    // 1. If session changes, save it
    // 2. Save in history if its another day
    useEffect(() => {
        const isPastSession = !isToday(toDate(todaySession.session.createdTimestamp));
        const hasActivities = todaySession.session.activities.length > 0;
        if (isPastSession) {
            if (hasActivities)
                saveInHistoryAndReset();
            else
                resetToDefaultState();
        }

        // save in every change
        save();
    }, [resetToDefaultState, save, saveInHistoryAndReset, todaySession.session]);


    // save on window close
    useEffect(() => {
        const _save = () => save();
        window.addEventListener("beforeunload", _save);
        return () => window.removeEventListener("beforeunload", _save);
    }, []);

    // stop timer on window close
    useEffect(() => {
        return; // disabled for now
        // Feature not enabled
        if (!todaySessionSettings.stopOnClose) return;
        console.log("stop timer on window close");
        const stopActivities = () => {
            const updatedSession = sessionService.stopActivities(todaySession.session);
            setSession(updatedSession);
        }

        window.addEventListener("beforeunload", stopActivities);
        return () => window.removeEventListener("beforeunload", stopActivities);
    }, [todaySession.session, todaySessionSettings]);

    // if limits changes to future, reset alert and auto-stop
    useEffect(() => {
        if (!todaySession.session.durationLimit.millis) return;
        const sessionDurationMs = sessionService.getSessionDurationMs(todaySession.session);
        if (sessionDurationMs > todaySession.session.durationLimit.millis) {
            setEndAlertStatus("waiting");
            console.log("Reset sessionEndAlertStatus to waiting");
        }
    }, [todaySession.session.durationLimit]);

    // constantly update timer and tracks
    useTimer({
        timerMs: 5000,
        isRunning: hasRunningTracks && !readOnly,
        pauseOnPageNotVisible: false
    }, () => {
        console.log("Update today timer and tracks");
        let _session = todaySession.session;

        _session = sessionService.updateTimerAndTracks(_session);

        // stopOnSessionEnd
        if (todaySessionSettings.stopOnSessionEnd && todaySession.session.durationLimit.millis) {
            const sessionDurationMs = sessionService.getSessionDurationMs(todaySession.session);

            const remainingMs = todaySession.session.durationLimit.millis - sessionDurationMs;
            console.log("Remaining seconds: ", remainingMs / 1000);

            if (!remainingMs && todaySession.endAlertStatus !== "ended") {
                _session = sessionService.stopActivities(_session);
                toast.info("La sesión ha terminado");
                playAudio(sessionEndAudio);
                setEndAlertStatus("ended");
            }
            else if (remainingMs < 5 * 60 * 1000 && todaySession.endAlertStatus === "waiting") {
                toast.info("La sesión terminará en menos de 5 minutos");
                playAudio(sessionEndAudio);
                setEndAlertStatus("alerted");
            }
        }

        setSession(_session);
    });


    return (
        <WorkSessionComponent
            session={todaySession.session}
            onSessionChange={s => { setSession(s); console.log(s) }}
            inBelowSettings={<TodaySessionSettings />}
        />
    );
}