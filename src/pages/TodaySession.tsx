import { WorkSessionType } from "../types/Activity";
import useTodaySession from "../hooks/useTodayActivities";
import useAutoSaving from "../hooks/useAutoSaving";
import { WorkSessionPanel } from "../components/WorkSessionPanel";


export function TodaySession() {
    const { todaySession, save, setSession } = useTodaySession();

    useAutoSaving(save, 5000);

    const handleSetSession = async (newSession: WorkSessionType) => {
        setSession(newSession);
    }

    return (
        <div className="flex flex-row gap-5">
            <WorkSessionPanel
                session={todaySession}
                onSessionChange={handleSetSession}
            />
            <WorkSessionPanel
                session={todaySession}
                onSessionChange={handleSetSession}
                readOnly
            />
        </div>

    )
}



