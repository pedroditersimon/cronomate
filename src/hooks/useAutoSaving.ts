import { useEffect, useRef } from "react";
import usePageVisibility from "./usePageVisibility";

export default function useAutoSaving(save: () => void, timerMs: number) {
    const intervalRef = useRef<number | undefined>();
    const isPageVisible = usePageVisibility();

    useEffect(() => {
        // page is not more visible
        if (!isPageVisible) {
            console.log("page is not more visible");
            save();
            clearInterval(intervalRef.current);
            return;
        }

        // Establece un intervalo que actualiza el estado cada segundo
        intervalRef.current = setInterval(save, timerMs);

        // Limpia el intervalo cuando el componente se desmonta
        return () => clearInterval(intervalRef.current);
    }, [save, timerMs, isPageVisible]);
}