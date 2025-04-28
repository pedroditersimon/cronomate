import { useEffect, useState } from "react";
import { Session } from "src/features/session/types/Session";
import sessionStorageService from "src/shared/services/sessionStorageService";


export default function useSessionsHistory() {
    const [history, setHistory] = useState<Array<Session>>([]);

    useEffect(() => {
        sessionStorageService.getItems<Session>("History")
            .then((results) => setHistory(results));
    }, []);

    return history;
}