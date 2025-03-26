import { useMemo } from 'react';
import WorkSessionComponent from 'src/features/work-session/components/WorkSession';
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
                allowedActions="none"
            />
        </PageLayout>
    );
};

