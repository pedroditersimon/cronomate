import { WorkSessionType } from "../types/Activity";
import useTodaySession from "../hooks/useTodayActivities";
import useAutoSaving from "../hooks/useAutoSaving";
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
    }, [saveInHistoryAndReset, todaySession]);

    useAutoSaving(save, 5000);

    const handleSetSession = async (newSession: WorkSessionType) => {
        setSession(newSession);
    }

    return (
        <WorkSession
            session={todaySession}
            onSessionChange={handleSetSession}
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
