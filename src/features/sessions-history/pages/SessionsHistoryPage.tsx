import PageLayout from 'src/shared/layouts/PageLayout';
import { SessionsHistoryPlinth } from 'src/features/sessions-history/components/SessionsHistoryPlinth';
import useSessionsHistory from 'src/features/sessions-history/hooks/useSessionsHistory';
import useAppNavigation from 'src/app/routing/useAppNavigation';


export function SessionsHistoryPage() {
    const history = useSessionsHistory();
    const { goToHistorySession } = useAppNavigation();

    return (
        <PageLayout>
            <SessionsHistoryPlinth
                sessions={history}
                onSessionSelected={session => goToHistorySession(session.id)}
            />
        </PageLayout>
    );
};

