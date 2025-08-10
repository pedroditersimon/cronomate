import { useState } from "react";
import { TimeUnit } from "src/shared/types/TimeUnit";
import { Session } from "src/features/session/types/Session";
import useUntrackedActivity from "src/features/activity/hooks/useUnrecoredActivity";
import SessionTableModalPresenter from "src/features/session-table-modal/components/SessionTableModalPresenter";
import { SessionTableModalRow } from "src/features/session-table-modal/types/SessionTableModal";
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

    const [includeDateCol, setIncludeDateCol] = useState(true);

    // Untracked Activity
    const [includeUnrecordedActivity, setIncludeUnrecordedActivity] = useState(true);
    const untrackedActivity = useUntrackedActivity(session.activities);
    const hasUntrackedActivity = untrackedActivity.tracks.length > 0;

    // Pauses Activity
    const [includePausesActivity, setIncludePausesActivity] = useState(true);
    const hasPausesActivity = session.activities.some(activityService.isPauseActivity);

    const rows = useSessionTableRows({
        session,
        includeUnrecordedActivity,
        untrackedActivity,
        includePausesActivity,
        elapsedTimeUnit,
        includeDateCol
    });

    const handleCopyTable = () => {
        setTableCopiedEffect(true);
        setTimeout(() => setTableCopiedEffect(false), 3000);
        copyTable(rows, includeDateCol);
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
            includeDateCol={includeDateCol}
            setIncludeDateCol={setIncludeDateCol}
            includeUnrecordedActivity={includeUnrecordedActivity}
            setIncludeUnrecordedActivity={setIncludeUnrecordedActivity}
            hasUntrackedActivity={hasUntrackedActivity}
            includePausesActivity={includePausesActivity}
            setIncludePausesActivity={setIncludePausesActivity}
            hasPausesActivity={hasPausesActivity}
        />
    );
}
