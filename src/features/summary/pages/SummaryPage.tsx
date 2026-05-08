import BarChart from "src/features/summary/components/BarChart";
import Dropdown from "src/shared/components/interactable/Dropdown";
import Container from "src/shared/layouts/Container";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";
import PageLayout from "src/shared/layouts/PageLayout";
import { DateTime } from "luxon";
import { capitalize } from "lodash";
import { useMemo, useState } from "react";
import useSessionsHistory from "src/features/sessions-history/hooks/useSessionsHistory";
import { Session } from "src/features/session/types/Session";
import sessionService from "src/features/session/services/sessionService";

function calculateHoursForMonth(history: Array<Session>, month: string) {
    const monthIndex = DateTime.fromFormat(month, "LLLL").month;
    const totalHours = history.reduce((sum, session) => {
        const sessionDate = DateTime.fromMillis(session.createdTimestamp);
        if (sessionDate.month === monthIndex) {
            return sum + (sessionService.getSessionDurationMs(session) || 0) / (1000 * 60 * 60); // Convert ms to hours
        }
        return sum;
    }, 0);
    return totalHours;
};

export default function SummaryPage() {
    const sessionsHistory = useSessionsHistory();

    const currentMonth = capitalize(DateTime.now().toFormat('LLLL'));
    const [month, setMonth] = useState(currentMonth);

    const months = Array.from({ length: 12 }, (_, i) =>
        capitalize(DateTime.fromObject({ month: i + 1, day: 1 }).toFormat('LLLL'))
    );

    const selectedMonthHours = useMemo(() => {
        return calculateHoursForMonth(sessionsHistory, month);
    }, [month, sessionsHistory]);

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

                <h1>Summary Page</h1>
                <p>Total hours for {month}: {selectedMonthHours.toFixed(3)} hours</p>
                <BarChart></BarChart>
            </Container>
        </PageLayout>
    );
}