import { WorkSession } from 'src/features/work-session/types/WorkSession';
import Container from 'src/shared/layouts/Container';
import ContainerTopbar from 'src/shared/layouts/ContainerTopbar';
import { SessionsHistory } from 'src/features/sessions-history/components/SessionsHistory';
import Dropdown from 'src/shared/components/interactable/Dropdown';
import { SortBy, SortByLabels } from 'src/features/sessions-history/types/SortBy';
import { useState } from 'react';

interface Props {
    sessions: WorkSession[];
    onSessionSelected: (session: WorkSession) => void;
}


export function SessionsHistoryPlinth({ sessions, onSessionSelected }: Props) {

    const [sortBy, setSortBy] = useState(SortBy.CREATED_AT);

    return (
        <Container className='text-center min-w-80'>
            <ContainerTopbar
                title='Historial'
                right={
                    <Dropdown
                        value={sortBy}
                        options={Object.values(SortBy)}
                        labels={SortByLabels}
                        onOption={opt => setSortBy(opt as SortBy)}
                    />
                }
            />

            <SessionsHistory
                sessions={sessions}
                onSessionSelected={onSessionSelected}
                sortBy={sortBy}
            />
        </Container>
    );
};
