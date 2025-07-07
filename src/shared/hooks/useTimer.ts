import { useEffect } from "react";
import usePageVisibility from "./usePageVisibility";

interface Props {
    timerMs: number;
    isRunning?: boolean;
    pauseOnPageNotVisible: boolean;
}

export default function useTimer(
    { timerMs, isRunning, pauseOnPageNotVisible = true }: Props,
    callback: () => void,
) {

    const isPageVisible = usePageVisibility((visibility) => {
        if (!isRunning) return;
        if (visibility) callback(); // force update on window recover visibility
    });

    useEffect(() => {
        if (!isRunning || (pauseOnPageNotVisible && !isPageVisible)) return;

        // Establece un intervalo que actualiza el estado cada segundo
        const intervalId = setInterval(callback, timerMs);

        // Limpia el intervalo cuando el componente se desmonta
        return () => clearInterval(intervalId);
    }, [callback, timerMs, isRunning, isPageVisible, pauseOnPageNotVisible]);
}