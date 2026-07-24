import { useState } from "react";
import { TimeUnit } from "src/shared/types/TimeUnit";
import { Session } from "src/features/session/types/Session";
import useUntrackedActivity from "src/features/activity/hooks/useUnrecoredActivity";
import SessionTableModalPresenter from "src/features/session-table-modal/components/SessionTableModalPresenter";
import { SessionTableColumn } from "src/features/session-table-modal/types/SessionTableModal";
import { copyTable } from "src/features/session-table-modal/utils/copyTable";
import activityService from "src/features/activity/services/activityService";
import { useSessionTableRows } from "src/features/session-table-modal/hooks/useSessionTableRows";

interface Props {
    id?: string;
    session: Session;
}

export default function SessionTableModal({ id, session }: Props) {
    const [elapsedTimeUnit, setElapsedTimeUnit] = useState<TimeUnit>(TimeUnit.HOUR);
    const [tableCopiedEffect, setTableCopiedEffect] = useState(false);

    const [activeColumnIds, setActiveColumnIds] = useState<string[]>([
        "date", "project", "title", "description", "elapsedTime"
    ]);
    const [columns, setColumns] = useState<SessionTableColumn[]>([
        { id: "date", label: "Fecha" },
        { id: "project", label: "Proyecto" },
        { id: "title", label: "Titulo" },
        { id: "description", label: "Descripción" },
        { id: "elapsedTime", label: "Tiempo" }
    ]);
    const [customValues, setCustomValues] = useState<Record<string, Record<string, string>>>({});

    // Untracked Activity
    const [includeUnrecordedActivity, setIncludeUnrecordedActivity] = useState(true);
    const untrackedActivity = useUntrackedActivity(session.activities);
    const hasUntrackedActivity = untrackedActivity.tracks.length > 0;

    // Pauses Activity
    const [includePausesActivity, setIncludePausesActivity] = useState(false);
    const hasPausesActivity = session.activities.some(activityService.isPauseActivity);

    const rows = useSessionTableRows({
        session,
        includeUnrecordedActivity,
        untrackedActivity,
        includePausesActivity,
        elapsedTimeUnit,
    });

    const handleCopyTable = () => {
        setTableCopiedEffect(true);
        setTimeout(() => setTableCopiedEffect(false), 3000);
        copyTable({
            rows,
            columns: columns.filter(column => column.isCustom || activeColumnIds.includes(column.id)),
            customValues
        });
    };

    const disableCopyBtn = rows.length === 0;

    return (
        <SessionTableModalPresenter
            id={id}
            rows={rows}
            elapsedTimeUnit={elapsedTimeUnit}
            setElapsedTimeUnit={setElapsedTimeUnit}
            disableCopyBtn={disableCopyBtn}
            tableCopiedEffect={tableCopiedEffect}
            handleCopyTable={handleCopyTable}
            activeColumnIds={activeColumnIds}
            setActiveColumnIds={setActiveColumnIds}
            columns={columns}
            setColumns={setColumns}
            customValues={customValues}
            setCustomValues={setCustomValues}
            includeUnrecordedActivity={includeUnrecordedActivity}
            setIncludeUnrecordedActivity={setIncludeUnrecordedActivity}
            hasUntrackedActivity={hasUntrackedActivity}
            includePausesActivity={includePausesActivity}
            setIncludePausesActivity={setIncludePausesActivity}
            hasPausesActivity={hasPausesActivity}
        />
    );
}
