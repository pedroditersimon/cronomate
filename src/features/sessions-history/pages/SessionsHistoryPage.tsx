import { useNavigate } from 'react-router-dom';
import PageLayout from 'src/shared/layouts/PageLayout';
import { SessionsHistoryPlinth } from 'src/features/sessions-history/components/SessionsHistoryPlinth';
import useSessionsHistory from 'src/features/sessions-history/hooks/useSessionsHistory';


export function SessionsHistoryPage() {
    const history = useSessionsHistory();
    const navigate = useNavigate();

    return (
        <PageLayout>
            <SessionsHistoryPlinth
                sessions={history}
                onSessionSelected={session => navigate(`/history/${session.id}`)}
            />
        </PageLayout>
    );
};

