import { useEffect } from "react";
import { TimeTrackStatus } from "src/features/time-track/types/TimeTrack";
import TodaySessionSettings from "src/features/today-session/components/TodaySessionSettings";
import useTodaySession from "src/features/today-session/hooks/useTodayActivities";
import useTodaySessionSettigs from "src/features/today-session/hooks/useTodaySessionSettigs";
import workSessionService from "src/features/work-session/services/workSessionService";
import useTimer from "src/shared/hooks/useTimer";
import { isPast, isToday, toDate } from "src/shared/utils/TimeUtils";
import WorkSessionComponent from "src/features/work-session/components/WorkSession";

interface Props {
    readOnly?: boolean;
}

export default function TodaySession({ readOnly }: Props) {
    const { todaySession, save, setSession, saveInHistoryAndReset } = useTodaySession();
    const { todaySessionSettings } = useTodaySessionSettigs();



    // Save in history if its another day
    useEffect(() => {
        const isPastSession = !isToday(toDate(todaySession.createdTimeStamp));
        if (isPastSession && todaySession.activities.length > 0) {
            saveInHistoryAndReset();
        }

        // save in every change
        save();
        console.log(todaySession);
    }, [save, saveInHistoryAndReset, todaySession]);


    // save on window close
    useEffect(() => {
        const _save = () => save();
        window.addEventListener("beforeunload", _save);
        return () => window.removeEventListener("beforeunload", _save);
    });

    // replaced with: save in every change
    // useAutoSaving(save, 5000);

    // stop timer on window close
    useEffect(() => {
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


    // constantly update todaySession timer
    useTimer(() => {
        const now = toDate().getTime();
        let _session = todaySession;

        _session = workSessionService.setTimer(_session, {
            ...todaySession.timer,
            start: todaySession.timer.start || now,
            end: now,
        });

        // stopOnSessionEnd
        if (todaySessionSettings.stopOnSessionEnd) {
            const sessionShouldEnd = isPast(todaySession.timer.endOverride ?? undefined);
            if (sessionShouldEnd)
                _session = workSessionService.stopTimerAndActivities(_session);
        }

        setSession(_session);

        console.log("Today timer");
    }, 5000, todaySession.timer.status === TimeTrackStatus.RUNNING && !readOnly);


    return (
        <WorkSessionComponent
            session={todaySession}
            onSessionChange={setSession}
            inBelowSettings={<TodaySessionSettings />}
        />
    );
}