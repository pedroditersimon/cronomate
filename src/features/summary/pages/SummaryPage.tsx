import Container from "src/shared/layouts/Container";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";
import PageLayout from "src/shared/layouts/PageLayout";
import { DateTime } from "luxon";
import { maxBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import useSessionsHistory from "src/features/sessions-history/hooks/useSessionsHistory";
import sessionService from "src/features/session/services/sessionService";
import useTodaySession from "src/features/today-session/hooks/useTodaySession";
import BarChartThreshold, { BarChartDataItem, BarChartThreshold as BarChartThresholdType } from "src/shared/components/charts/BarChartThreshold";
import activityService from "src/features/activity/services/activityService";
import { convertElapsedTimeToText } from "src/shared/utils/TimeUtils";
import DateRangePicker from "src/shared/components/interactable/DateRangePicker";

const toRangeValue = (start: DateTime, end: DateTime) =>
    `${start.toISODate()}/${end.toISODate()}`;
const maxChartSegments = 7;

function parseRange(range: string) {
    const [start, end] = range.split("/").map(date => DateTime.fromISO(date));
    return start.isValid && end.isValid ? { start, end } : null;
}

export default function SummaryPage() {
    const sessionsHistory = useSessionsHistory();
    const { todaySession } = useTodaySession();

    const [range, setRange] = useState(() => {
        const now = DateTime.now();
        return toRangeValue(now.startOf("month"), now);
    });

    const rangeDates = useMemo(() => parseRange(range), [range]);

    const sessionsInRange = useMemo(() => {
        if (!rangeDates) return [];

        return [...sessionsHistory, todaySession.session].filter(session => {
            const date = DateTime.fromMillis(session.createdTimestamp);
            return date >= rangeDates.start.startOf("day")
                && date <= rangeDates.end.endOf("day");
        });
    }, [rangeDates, sessionsHistory, todaySession.session]);

    const totalHours = useMemo(() => sessionsInRange.reduce(
        (total, session) =>
            total + (sessionService.getSessionDurationMs(session) || 0) / 3_600_000,
        0
    ), [sessionsInRange]);

    const chartData = sessionsInRange
        .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
        .map(s => ({
            label: DateTime.fromMillis(s.createdTimestamp).toFormat("d LLL"),
            value: activityService.getAllElapsedTime(s.activities),
            valueLabelFormatter: v => convertElapsedTimeToText(v),
        } as BarChartDataItem));

    const lastChartPage = Math.max(Math.ceil(chartData.length / maxChartSegments) - 1, 0);
    const [chartPage, setChartPage] = useState(lastChartPage);

    useEffect(() => {
        setChartPage(lastChartPage);
    }, [range, lastChartPage]);

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
                        <DateRangePicker
                            value={range}
                            onChange={setRange}
                        />
                    }
                />

                <div className="flex items-center justify-between px-1 py-2">
                    <div>
                        <p className="text-sm font-semibold text-gray-500">Tiempo total</p>
                        <p className="text-2xl font-semibold text-gray-300">
                            {convertElapsedTimeToText(totalHours * 3_600_000)}
                        </p>
                    </div>
                    <span className="text-sm text-gray-500">
                        {sessionsInRange.length} {sessionsInRange.length === 1 ? "sesión" : "sesiones"}
                    </span>
                </div>

                <BarChartThreshold
                    data={chartData}
                    thresholds={chartThreshold}
                    maxSegments={maxChartSegments}
                    page={chartPage}
                    onPageChange={setChartPage}
                />
            </Container>
        </PageLayout>
    );
}
