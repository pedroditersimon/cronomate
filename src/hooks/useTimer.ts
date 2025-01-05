import { useEffect } from "react";
import usePageVisibility from "./usePageVisibility";

export default function useTimer(callback: () => void, timer: number, isRunning?: boolean | undefined) {
    const isPageVisible = usePageVisibility();

    useEffect(() => {
        if (!isRunning || !isPageVisible) return;

        // Establece un intervalo que actualiza el estado cada segundo
        const intervalId = setInterval(callback, timer);

        // Limpia el intervalo cuando el componente se desmonta
        return () => clearInterval(intervalId);
    }, [callback, timer, isRunning, isPageVisible]); // La dependencia vacía asegura que el efecto se ejecute solo al montar y desmontar.

}