import { WorkSessionType } from "../types/Activity";
import useTodaySession from "../hooks/useTodayActivities";
import useAutoSaving from "../hooks/useAutoSaving";
import { WorkSessionPanel } from "../components/WorkSessionPanel";
import PageLayout from "../layouts/PageLayout";
import { History } from "./History";


export function TodaySession() {
    const { todaySession, save, setSession } = useTodaySession();

    useAutoSaving(save, 5000);

    const handleSetSession = async (newSession: WorkSessionType) => {
        setSession(newSession);
    }

    return (
        <WorkSessionPanel
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
