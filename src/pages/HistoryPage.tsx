import Container from 'src/shared/layouts/Container';
import { WorkSession } from 'src/types/Activity';
import { useEffect, useState } from 'react';
import ContainerTopbar from 'src/shared/layouts/ContainerTopbar';
import WorkSessionItem from 'src/features/work-session/components/WorkSessionItem';
import { WorkSession } from 'src/features/work-session/components/WorkSession';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from 'src/shared/layouts/PageLayout';
import HSeparator from 'src/shared/layouts/HSeparator';
import sessionStorageService from 'src/services/sessionStorageService';


export function History() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [history, setHistory] = useState<Array<WorkSession>>([]);

    useEffect(() => {
        sessionStorageService.getItems<WorkSession>("History")
            .then((results) => setHistory(results));
    }, []);

    const selectedSession = history.find(item => item.id === id);

    if (selectedSession) {
        return (
            <WorkSession
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
                    <>
                        <WorkSessionItem
                            key={session.id}
                            session={session}
                            onSelected={_selectedSession => navigate(`/history/${_selectedSession.id}`)}
                        />
                        <HSeparator />
                    </>
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