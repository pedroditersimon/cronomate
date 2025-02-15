import Container from 'src/layouts/Container';
import { WorkSessionType } from 'src/types/Activity';
import { useEffect, useState } from 'react';
import ContainerTopbar from 'src/layouts/ContainerTopbar';
import WorkSessionItem from 'src/components/WorkSession/WorkSessionItem';
import { WorkSession } from 'src/components/WorkSession/WorkSession';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from 'src/layouts/PageLayout';
import HSeparator from 'src/layouts/HSeparator';
import sessionStorageService from 'src/services/sessionStorageService';


export function History() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [history, setHistory] = useState<Array<WorkSessionType>>([]);

    useEffect(() => {
        sessionStorageService.getItems<WorkSessionType>("History")
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