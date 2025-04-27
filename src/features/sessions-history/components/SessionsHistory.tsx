import { DateTime } from 'luxon';
import { SortBy, SortOrder } from 'src/features/sessions-history/types/SortBy';
import WorkSessionItem from 'src/features/work-session/components/WorkSessionItem';
import workSessionService from 'src/features/work-session/services/workSessionService';
import { WorkSession } from 'src/features/work-session/types/WorkSession';
import HSeparator from 'src/shared/layouts/HSeparator';


type GroupedSessions = Array<{ groupName: string, sessions: WorkSession[] }>;

function groupByMonth(sessions: WorkSession[]): GroupedSessions {
    const groupedSessions: GroupedSessions = [];

    sessions.forEach(session => {

        const date = DateTime.fromMillis(session.createdTimestamp);
        if (!date.isValid) return;

        const inCurrentMonth = date.hasSame(DateTime.now(), "month")
            && date.hasSame(DateTime.now(), "year");

        // Get month group
        const month = inCurrentMonth ? "" : date.toRelative({ style: "long", unit: ["years", "months", "weeks"] });

        // Find existing group
        const group = groupedSessions.find(group => group.groupName === month);

        // Add to existing group
        if (group) group.sessions.push(session);
        // Create new group
        else groupedSessions.push({ groupName: month, sessions: [session] });
    });

    return groupedSessions;
}


interface Props {
    sessions: WorkSession[];
    onSessionSelected: (session: WorkSession) => void;
    sortBy?: SortBy;
    sortOrder?: SortOrder;
}

export function SessionsHistory({ sessions, onSessionSelected, sortBy, sortOrder }: Props) {

    // 1. Sorting
    let sortedSessions = [...sessions];

    if (sortBy === SortBy.CREATED_AT)
        sortedSessions = sessions.sort((a, b) => b.createdTimestamp - a.createdTimestamp);
    else if (sortBy === SortBy.DURATION)
        sortedSessions = sessions.sort((a, b) => workSessionService.getSessionDurationMs(b) - workSessionService.getSessionDurationMs(a));

    // Reverse order
    if (sortOrder === "asc")
        sortedSessions = sortedSessions.reverse();

    // 2. Grouping
    let groupedSessions: GroupedSessions = [{ groupName: "", sessions: sortedSessions }]; // Same group

    if (sortBy === SortBy.CREATED_AT)
        groupedSessions = groupByMonth(sortedSessions);

    return (
        <div className='flex flex-col gap-5'>

            {/* Groups */}
            {groupedSessions.map(group => (
                <div className='flex flex-col gap-4'>

                    {/* Group title */}
                    {group.groupName.trim().length > 0 && (
                        <div className='flex flex-col'>
                            <h2 className='text-xl text-left text-gray-400 font-semibold'>{group.groupName}</h2>
                            <HSeparator />
                        </div>
                    )}

                    {/* Sessions */}
                    {group.sessions.map(session =>
                        <WorkSessionItem
                            key={session.id}
                            session={session}
                            onSelected={onSessionSelected}
                        />
                    )}

                </div>
            ))}

        </div>
    );
};
