import { useEffect, useState } from "react";
import { TimeTrackStatus } from "src/features/time-track/types/TimeTrack";
import TodaySessionSettings from "src/features/today-session/components/TodaySessionSettings";
import useTodaySession from "src/features/today-session/hooks/useTodaySession";
import useTodaySessionSettigs from "src/features/today-session/hooks/useTodaySessionSettigs";
import workSessionService from "src/features/work-session/services/workSessionService";
import useTimer from "src/shared/hooks/useTimer";
import { getElapsedTime, isPastOrNow, isToday, toDate } from "src/shared/utils/TimeUtils";
import WorkSessionComponent from "src/features/work-session/components/WorkSession";

import { useAudioPlayer } from 'src/shared/hooks/useAudioPlayer';
import sessionEndAudio from "src/assets/audio/399191__spiceprogram__drip-echo.wav";
import { DateTime, Interval } from "luxon";
import { toast } from "sonner";


interface Props {
    readOnly?: boolean;
}

export default function TodaySession({ readOnly }: Props) {
    const { todaySession, save, setSession, saveInHistoryAndReset } = useTodaySession();
    const { todaySessionSettings } = useTodaySessionSettigs();
    const { playAudio } = useAudioPlayer({ volume: 0.5 });
    const [sessionEndAlertStatus, setSessionEndAlertStatus] = useState<"waiting" | "alerted" | "ended">("waiting");

    // 1. If session changes, save it
    // 2. Save in history if its another day
    useEffect(() => {
        const isPastSession = !isToday(toDate(todaySession.createdTimeStamp));
        if (isPastSession) {
            saveInHistoryAndReset();
        }

        // save in every change
        save();
    }, [todaySession, save, saveInHistoryAndReset]);


    // save on window close
    useEffect(() => {
        const _save = () => save();
        window.addEventListener("beforeunload", _save);
        return () => window.removeEventListener("beforeunload", _save);
    }, [save]);

    // stop timer on window close
    useEffect(() => {
        return; // disabled for now
        // Feature not enabled
        if (!todaySessionSettings.stopOnClose) return;
        console.log("stop timer on window close");
        const stopActivities = () => {
            const updatedSession = workSessionService.stopTimerAndActivities(todaySession);
            setSession(updatedSession);
        }

        window.addEventListener("beforeunload", stopActivities);
        return () => window.removeEventListener("beforeunload", stopActivities);
    }, [setSession, todaySession, todaySessionSettings]);

    // if endOverride changes to future, reset alert and auto-stop
    useEffect(() => {
        if (!todaySession.timer.endOverride) return;
        const endDate = DateTime.fromMillis(todaySession.timer.endOverride);
        if (endDate > DateTime.now()) {
            setSessionEndAlertStatus("waiting");
            console.log("Reset sessionEndAlertStatus to waiting");
        }
    }, [todaySession.timer.endOverride]);

    // constantly update timer and tracks
    useTimer(() => {
        console.log("Update today timer and tracks");
        let _session = todaySession;

        _session = workSessionService.updateTimerAndTracks(_session);

        // stopOnSessionEnd
        if (todaySessionSettings.stopOnSessionEnd && todaySession.timer.endOverride) {
            const interval = Interval.fromDateTimes(DateTime.now(), DateTime.fromMillis(todaySession.timer.endOverride))
            const remainingSecs = interval.length("seconds");
            console.log("Remaining time: ", remainingSecs);

            if (!remainingSecs && sessionEndAlertStatus !== "ended") {
                _session = workSessionService.stopTimerAndActivities(_session);
                toast.info("La sesión ha terminado");
                playAudio(sessionEndAudio);
                setSessionEndAlertStatus("ended");
            }
            else if (remainingSecs < 60 * 5 && sessionEndAlertStatus === "waiting") {
                toast.info("La sesión terminará en menos de 5 minutos");
                playAudio(sessionEndAudio);
                setSessionEndAlertStatus("alerted");
            }
        }

        setSession(_session);
    }, 5000, todaySession.timer.status === TimeTrackStatus.RUNNING && !readOnly);


    return (
        <WorkSessionComponent
            session={todaySession}
            onSessionChange={s => { setSession(s); console.log(s) }}
            inBelowSettings={<TodaySessionSettings />}
        />
    );
}