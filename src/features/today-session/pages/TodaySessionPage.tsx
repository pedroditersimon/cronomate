import { PomodoroPlinth } from "src/features/pomodoro/components/PomodoroPlinth";
import TodaySession from "src/features/today-session/components/TodaySession";
import PageLayout from "src/shared/layouts/PageLayout";
import TodayNoteAndChecklistPlinth from "src/features/today-session/components/TodayNoteAndChecklistPlinth";


export default function TodaySessionPage() {

    return (
        <PageLayout>

            <TodaySession />

            <div className="flex flex-col gap-3 h-full">
                <PomodoroPlinth />
                <TodayNoteAndChecklistPlinth />
            </div>

        </PageLayout>
    );
}
