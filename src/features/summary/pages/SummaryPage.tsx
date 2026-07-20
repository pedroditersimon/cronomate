import Dropdown from "src/shared/components/interactable/Dropdown";
import Container from "src/shared/layouts/Container";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";
import PageLayout from "src/shared/layouts/PageLayout";
import { DateTime } from "luxon";
import { capitalize, maxBy } from "lodash";
import { useMemo, useState } from "react";
import useSessionsHistory from "src/features/sessions-history/hooks/useSessionsHistory";
import { Session } from "src/features/session/types/Session";
import sessionService from "src/features/session/services/sessionService";
import useTodaySession from "src/features/today-session/hooks/useTodaySession";
import BarChartThreshold, { BarChartDataItem, BarChartThreshold as BarChartThresholdType } from "src/shared/components/charts/BarChartThreshold";
import activityService from "src/features/activity/services/activityService";
import { convertElapsedTimeToText } from "src/shared/utils/TimeUtils";

function calculateHoursForMonth(history: Array<Session>, currentSession: Session | null, month: string) {
    const monthIndex = DateTime.fromFormat(month, "LLLL").month;
    const currentYear = DateTime.now().year;

    // Calculate from history
    let totalHours = history.reduce((sum, session) => {
        const sessionDate = DateTime.fromMillis(session.createdTimestamp);
        if (sessionDate.month === monthIndex && sessionDate.year === currentYear) {
            return sum + (sessionService.getSessionDurationMs(session) || 0) / (1000 * 60 * 60);
        }
        return sum;
    }, 0);

    // Add current session if it matches the selected month and year
    if (currentSession) {
        const sessionDate = DateTime.fromMillis(currentSession.createdTimestamp);
        if (sessionDate.month === monthIndex && sessionDate.year === currentYear) {
            totalHours += (sessionService.getSessionDurationMs(currentSession) || 0) / (1000 * 60 * 60);
        }
    }

    return totalHours;
};

export default function SummaryPage() {
    const sessionsHistory = useSessionsHistory();
    const { todaySession } = useTodaySession();

    const currentMonth = capitalize(DateTime.now().toFormat('LLLL'));
    const [month, setMonth] = useState(currentMonth);

    const months = Array.from({ length: 12 }, (_, i) =>
        capitalize(DateTime.fromObject({ month: i + 1, day: 1 }).toFormat('LLLL'))
    );

    const selectedMonthHours = useMemo(() => {
        return calculateHoursForMonth(sessionsHistory, todaySession.session, month);
    }, [month, sessionsHistory, todaySession.session]);

    const chartData = [...sessionsHistory, todaySession.session]
        .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
        .slice(-7)
        .map(s => ({
            label: DateTime.fromMillis(s.createdTimestamp).toFormat("d LLL"),
            value: activityService.getAllElapsedTime(s.activities),
            valueLabelFormatter: v => convertElapsedTimeToText(v)
        } as BarChartDataItem));

    const maxY = maxBy(chartData, "value")?.value ?? 0;
    const sessionLimit = todaySession?.session?.durationLimit?.millis ?? 0;
    const chartThreshold: BarChartThresholdType[] | undefined = sessionLimit > 0
        ? [
            {
                label: "Limite",
                value: sessionLimit,
                thresholdBorderColorClass: "border-red-400"
            },
            {
                label: "",
                value: maxY,
                segmentColorClass: "bg-red-400",
                thresholdBorderColorClass: "border-red-400"
            }
        ]
        : undefined;

    return (
        <PageLayout>
            <Container className='min-w-80'>
                {/* Topbar */}
                <ContainerTopbar
                    title='Resumen'
                    right={
                        <Dropdown
                            options={months}
                            value={month}
                            onOption={setMonth}
                        />
                    }
                />

                <p>Total {month}: {selectedMonthHours.toFixed(2)} hours</p>

                <BarChartThreshold data={chartData} thresholds={chartThreshold} />
            </Container>
        </PageLayout>
    );
}