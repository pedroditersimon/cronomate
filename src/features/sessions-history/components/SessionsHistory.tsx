import { DateTime } from 'luxon';
import SessionItem from 'src/features/session/components/SessionItem';
import sessionService from 'src/features/session/services/sessionService';
import { Session } from 'src/features/session/types/Session';
import { SortBy } from 'src/features/sessions-history/types/SortBy';
import HSeparator from 'src/shared/layouts/HSeparator';


type GroupedSessions = Array<{ groupName: string, sessions: Session[] }>;

function groupByMonth(sessions: Session[]): GroupedSessions {
    const groupedSessions: GroupedSessions = [];

    sessions.forEach(session => {

        const date = DateTime.fromMillis(session.createdTimestamp);
        if (!date.isValid) return;

        const month = date.setLocale('es-AR').toFormat('LLLL yyyy');

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
    sessions: Session[];
    onSessionSelected: (session: Session) => void;
    sortBy: SortBy;
}

export function SessionsHistory({ sessions, onSessionSelected, sortBy }: Props) {
    const sortedSessions = [...sessions].sort((a, b) => sortBy === SortBy.DURATION
        ? sessionService.getSessionDurationMs(b) - sessionService.getSessionDurationMs(a)
        : b.createdTimestamp - a.createdTimestamp
    );
    const groupedSessions = groupByMonth(sortedSessions);

    return (
        <div className='flex min-h-0 flex-1 flex-col gap-5 overflow-x-hidden overflow-y-auto pr-1'>

            {/* Groups */}
            {groupedSessions.map(group => (
                <div key={group.groupName} className='flex flex-col gap-4'>

                    {/* Group title */}
                    <div className='flex flex-col'>
                        <h2 className='text-xl text-left text-gray-400 font-semibold'>{group.groupName}</h2>
                        <HSeparator />
                    </div>

                    {/* Sessions */}
                    {group.sessions.map(session =>
                        <SessionItem
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
