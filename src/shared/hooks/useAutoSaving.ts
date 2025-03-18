import { useEffect, useRef } from "react";
import usePageVisibility from "./usePageVisibility";

// El tipo retornado por setInterval es NodeJS.Timeout (en entornos Node.js) o number (en navegadores).
// Usar window.setInterval para asegurar el tipo number

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
        intervalRef.current = window.setInterval(save, timerMs);

        // Guarda y borra el intervalo cuando el componente se desmonta
        return () => {
            save();
            clearInterval(intervalRef.current);
        }
    }, [save, timerMs, isPageVisible]);

}