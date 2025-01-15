
import Container from '../layouts/Container';
import LinkBtn from '../components/LinkBtn';
import indexedDBSave from '../services/indexedDBSave';
import { WorkSessionType } from '../types/Activity';
import { useEffect, useState } from 'react';


export function History() {
    const [history, setHistory] = useState<Array<WorkSessionType>>([]);

    useEffect(() => {
        indexedDBSave.getItems<WorkSessionType>("History")
            .then((results) => setHistory(results));
    }, []);


    return (
        <Container className='text-center'>
            <h1 className="text-xl font-bold">Hisorial</h1>
            {
                history.map(item =>
                (<p className="mb-6">
                    {item.id}
                </p>))
            }

            <LinkBtn to='/'>
                Go to Home
            </LinkBtn>
        </Container>
    );
};

