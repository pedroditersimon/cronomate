import { useMemo } from 'react';
import WorkSessionComponent from 'src/features/session/components/Session';
import { useParams } from 'react-router-dom';
import PageLayout from 'src/shared/layouts/PageLayout';
import { NotFoundPage } from 'src/shared/pages/NotFoundPage';
import useSessionsHistory from 'src/features/sessions-history/hooks/useSessionsHistory';


export function SessionHistoryDetailPage() {
    const history = useSessionsHistory();
    const { id } = useParams();

    const selectedSession = useMemo(
        () => history.find(item => item.id === id),
        [id, history]
    );

    if (!selectedSession)
        return <NotFoundPage />;

    return (
        <PageLayout>
            <WorkSessionComponent
                session={selectedSession}
                onSessionChange={() => { }}

                // Disable all actions
                canEdit={false}
                canCreate={false}
                canArchive={false}
                canRestore={false}
            />
        </PageLayout>
    );
};

