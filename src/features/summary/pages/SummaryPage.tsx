import BarChart from "src/features/summary/components/BarChart";
import MonthRangeSelector from "src/features/summary/components/MonthRangeSelector";
import Container from "src/shared/layouts/Container";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";
import PageLayout from "src/shared/layouts/PageLayout";
import { DateTime } from "luxon";
import { capitalize } from "lodash";
import { useMemo, useState } from "react";
import useSessionsHistory from "src/features/sessions-history/hooks/useSessionsHistory";
import useTodaySession from "src/features/today-session/hooks/useTodaySession";
import { Session } from "src/features/session/types/Session";
import sessionService from "src/features/session/services/sessionService";

interface MonthRange {
    start: string | null;
    end: string | null;
}

function calculateHoursInRange(history: Array<Session>, range: MonthRange): number {
    if (!range.start || !range.end) return 0;

    const startDate = DateTime.fromFormat(range.start, "yyyy-MM").startOf("month");
    const endDate = DateTime.fromFormat(range.end, "yyyy-MM").endOf("month");

    const totalHours = history.reduce((sum, session) => {
        const sessionDate = DateTime.fromMillis(session.createdTimestamp);
        if (sessionDate >= startDate && sessionDate <= endDate) {
            return sum + (sessionService.getSessionDurationMs(session) || 0) / (1000 * 60 * 60);
        }
        return sum;
    }, 0);
    return totalHours;
}

function isTodayInRange(range: MonthRange): boolean {
    if (!range.start || !range.end) return false;
    const today = DateTime.now();
    const startDate = DateTime.fromFormat(range.start, "yyyy-MM").startOf("month");
    const endDate = DateTime.fromFormat(range.end, "yyyy-MM").endOf("month");
    return today >= startDate && today <= endDate;
}

export default function SummaryPage() {
    const sessionsHistory = useSessionsHistory();
    const { todaySession } = useTodaySession();

    // Default to current month
    const getDefaultRange = (): MonthRange => {
        const now = DateTime.now();
        const currentMonth = now.toFormat("yyyy-MM");
        return {
            start: currentMonth,
            end: currentMonth,
        };
    };

    const [monthRange, setMonthRange] = useState<MonthRange>(getDefaultRange);

    const selectedRangeHours = useMemo(() => {
        const historyHours = calculateHoursInRange(sessionsHistory, monthRange);
        
        // Add todaySession if today is in range
        let todaySessionHours = 0;
        if (isTodayInRange(monthRange) && todaySession.session.activities.length > 0) {
            todaySessionHours = (sessionService.getSessionDurationMs(todaySession.session) || 0) / (1000 * 60 * 60);
        }
        
        return historyHours + todaySessionHours;
    }, [monthRange, sessionsHistory, todaySession]);

    // Format range for display
    const rangeDisplay = useMemo(() => {
        if (!monthRange.start || !monthRange.end) return "Sin selección";
        const start = capitalize(DateTime.fromFormat(monthRange.start, "yyyy-MM").toFormat("LLLL yyyy"));
        const end = capitalize(DateTime.fromFormat(monthRange.end, "yyyy-MM").toFormat("LLLL yyyy"));
        return start === end ? start : `${start} - ${end}`;
    }, [monthRange]);

    return (
        <PageLayout>
            <Container className='min-w-80'>
                {/* Topbar */}
                <ContainerTopbar
                    title='Resumen'
                    right={
                        <MonthRangeSelector
                            value={monthRange}
                            onOption={setMonthRange}
                        />
                    }
                />

                <h1>Summary Page</h1>
                <p>Total hours for {rangeDisplay}: {selectedRangeHours.toFixed(2)} hours</p>
                <BarChart></BarChart>
            </Container>
        </PageLayout>
    );
}