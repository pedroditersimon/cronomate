import { useEffect, useState } from "react";
import { WorkSession } from "src/features/work-session/types/WorkSession";
import sessionStorageService from "src/shared/services/sessionStorageService";


export default function useSessionsHistory() {
    const [history, setHistory] = useState<Array<WorkSession>>([]);

    useEffect(() => {
        sessionStorageService.getItems<WorkSession>("History")
            .then((results) => setHistory(results));
    }, []);

    return history;
}