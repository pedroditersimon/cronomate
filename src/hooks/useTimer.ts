import { useEffect } from "react";
import usePageVisibility from "./usePageVisibility";

export default function useTimer(callback: () => void, timerMs: number, isRunning?: boolean | undefined) {

    const isPageVisible = usePageVisibility((visibility) => {
        if (!isRunning) return;
        if (visibility) callback(); // force update on window recover visibility
    });

    useEffect(() => {
        if (!isRunning || !isPageVisible) return;

        // Establece un intervalo que actualiza el estado cada segundo
        const intervalId = setInterval(callback, timerMs);

        // Limpia el intervalo cuando el componente se desmonta
        return () => clearInterval(intervalId);
    }, [callback, timerMs, isRunning, isPageVisible]);
}