import Container from '../layouts/Container';
import indexedDBSave from '../services/indexedDBSave';
import { WorkSessionType } from '../types/Activity';
import { useEffect, useState } from 'react';
import ContainerTopbar from '../layouts/ContainerTopbar';
import WorkSessionItem from '../components/WorkSessionItem';
import { WorkSessionPanel } from '../components/WorkSessionPanel';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../layouts/PageLayout';


export function History() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [history, setHistory] = useState<Array<WorkSessionType>>([]);

    useEffect(() => {
        indexedDBSave.getItems<WorkSessionType>("History")
            .then((results) => setHistory(results));
    }, []);

    const selectedSession = history.find(item => item.id === id);

    if (selectedSession) {
        return (
            <WorkSessionPanel
                session={selectedSession}
                onSessionChange={() => { }}
                readOnly
            />
        );
    }

    return (
        <Container className='text-center min-w-80'>
            <ContainerTopbar
                title='Historial'
            />

            <div className='flex flex-col gap-2'>
                {history.map(session =>
                    <WorkSessionItem
                        key={session.id}
                        session={session}
                        onSelected={_selectedSession => navigate(`/history/${_selectedSession.id}`)}
                    />
                )}
            </div>

        </Container>
    );
};

export function HistoryPage() {
    return (
        <PageLayout>
            <History />
        </PageLayout>
    );
}