import TodaySessionSettings from 'src/features/today-session/components/TodaySessionSettings';
import useTodaySession from 'src/features/today-session/hooks/useTodaySession';
import useTodaySessionSettigs from 'src/features/today-session/hooks/useTodaySessionSettigs';
import WorkSessionComponent from 'src/features/session/components/Session';

export default function TodaySession() {
    const { todaySession, setSession } = useTodaySession();
    const { todaySessionSettings } = useTodaySessionSettigs();
    return (
        <WorkSessionComponent
            session={todaySession.session}
            onSessionChange={setSession}
            inBelowSettings={<TodaySessionSettings />}
            activityOrder={todaySessionSettings.activityOrder}
        />
    );
}
