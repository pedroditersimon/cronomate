import { WorkSession } from 'src/features/work-session/types/WorkSession';
import Container from 'src/shared/layouts/Container';
import ContainerTopbar from 'src/shared/layouts/ContainerTopbar';
import { SessionsHistory } from 'src/features/sessions-history/components/SessionsHistory';
import Dropdown from 'src/shared/components/interactable/Dropdown';
import { SortBy, SortByLabels } from 'src/features/sessions-history/types/SortBy';
import { useState } from 'react';
import { SettingsIcon } from 'src/shared/assets/Icons';
import ContainerOverlay from 'src/shared/layouts/ContainerOverlay';
import SessionsHistorySettings from 'src/features/sessions-history/components/SessionsHistorySettings';

interface Props {
    sessions: WorkSession[];
    onSessionSelected: (session: WorkSession) => void;
}


export function SessionsHistoryPlinth({ sessions, onSessionSelected }: Props) {
    const [showSettings, setShowSettings] = useState(false);
    const [sortBy, setSortBy] = useState(SortBy.CREATED_AT);

    return (
        <Container className='min-w-80'>

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
                right={
                    <Dropdown
                        value={sortBy}
                        options={Object.values(SortBy)}
                        labels={SortByLabels}
                        onOption={opt => setSortBy(opt as SortBy)}
                    />
                }

                icon={<SettingsIcon />}
                onIconClick={() => setShowSettings(true)}
            />

            <SessionsHistory
                sessions={sessions}
                onSessionSelected={onSessionSelected}
                sortBy={sortBy}
            />
        </Container>
    );
};
