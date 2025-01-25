import useTodaySession from "../hooks/useTodayActivities";
import { WorkSession } from "../components/WorkSession/WorkSession";
import PageLayout from "../layouts/PageLayout";
import { isToday, toDate } from "../utils/TimeUtils";
import { useEffect } from "react";


export function TodaySession() {
    const { todaySession, save, setSession, saveInHistoryAndReset } = useTodaySession();


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

    return (
        <WorkSession
            session={todaySession}
            onSessionChange={setSession}
        />
    )
}


export function TodaySessionPage() {
    return (
        <PageLayout>
            <TodaySession />
        </PageLayout>
    );
}
