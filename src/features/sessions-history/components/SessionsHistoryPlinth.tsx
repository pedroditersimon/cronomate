import { Session } from 'src/features/session/types/Session';
import Container from 'src/shared/layouts/Container';
import ContainerTopbar from 'src/shared/layouts/ContainerTopbar';
import { SessionsHistory } from 'src/features/sessions-history/components/SessionsHistory';
import { useMemo, useState } from 'react';
import { SettingsIcon } from 'src/assets/Icons';
import ContainerOverlay from 'src/shared/layouts/ContainerOverlay';
import SessionsHistorySettings from 'src/features/sessions-history/components/SessionsHistorySettings';
import DateRangePicker from 'src/shared/components/interactable/DateRangePicker';
import { DateTime } from 'luxon';
import Dropdown from 'src/shared/components/interactable/Dropdown';
import { SortBy, SortByLabels } from 'src/features/sessions-history/types/SortBy';

interface Props {
    sessions: Session[];
    onSessionSelected: (session: Session) => void;
}

const toRangeValue = (start: DateTime, end: DateTime) =>
    `${start.toISODate()}/${end.toISODate()}`;

function parseRange(range: string) {
    const [start, end] = range.split('/').map(date => DateTime.fromISO(date));
    return start.isValid && end.isValid ? { start, end } : null;
}

export function SessionsHistoryPlinth({ sessions, onSessionSelected }: Props) {
    const [showSettings, setShowSettings] = useState(false);
    const [sortBy, setSortBy] = useState(SortBy.CREATED_AT);
    const [range, setRange] = useState(() => {
        const now = DateTime.now();
        return toRangeValue(now.startOf('month'), now);
    });
    const rangeDates = useMemo(() => parseRange(range), [range]);
    const sessionsInRange = useMemo(() => {
        if (!rangeDates) return [];

        return sessions.filter(session => {
            const date = DateTime.fromMillis(session.createdTimestamp);
            return date >= rangeDates.start.startOf('day')
                && date <= rangeDates.end.endOf('day');
        });
    }, [rangeDates, sessions]);

    return (
        <Container className='min-w-80' scrollable={false}>

            {/* Settings panel */}
            <ContainerOverlay show={showSettings} >
                <SessionsHistorySettings
                    sessions={sessions}
                    onClose={() => setShowSettings(false)}
                />
            </ContainerOverlay>

            {/* Topbar */}
            <ContainerTopbar
                title='Historial'
                icon={<SettingsIcon />}
                onIconClick={() => setShowSettings(true)}
            />

            <div className='flex flex-col items-end gap-2 py-2'>
                <DateRangePicker
                    value={range}
                    onChange={setRange}
                />
                <Dropdown
                    value={sortBy}
                    options={Object.values(SortBy)}
                    labels={SortByLabels}
                    onOption={opt => setSortBy(opt as SortBy)}
                />
            </div>

            <SessionsHistory
                sessions={sessionsInRange}
                onSessionSelected={onSessionSelected}
                sortBy={sortBy}
            />
        </Container>
    );
};
