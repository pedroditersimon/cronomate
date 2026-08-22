import { PomodoroPlinth } from "src/features/pomodoro/components/PomodoroPlinth";
import TodaySession from "src/features/today-session/components/TodaySession";
import PageLayout from "src/shared/layouts/PageLayout";
import TodayNoteAndChecklistPlinth from "src/features/today-session/components/TodayNoteAndChecklistPlinth";


export default function TodaySessionPage() {

    return (
        <PageLayout>

            <TodaySession />

            <div className="flex h-full w-96 min-w-0 flex-col gap-3">
                <PomodoroPlinth />
                <TodayNoteAndChecklistPlinth />
            </div>

        </PageLayout>
    );
}
