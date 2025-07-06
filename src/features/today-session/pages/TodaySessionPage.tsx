
import { PomodoroPlinth } from "src/features/pomodoro/components/PomodoroPlinth";
import TodaySession from "src/features/today-session/components/TodaySession";
import PageLayout from "src/shared/layouts/PageLayout";


export default function TodaySessionPage() {

    return (
        <PageLayout>
            <TodaySession />
            <PomodoroPlinth />
        </PageLayout>
    );
}
