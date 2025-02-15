import { useState, useEffect } from "react";
export default function usePageVisibility(onVisibilityChange) {
    const [isVisible, setIsVisible] = useState(document.visibilityState === "visible");
    useEffect(() => {
        const handleVisibilityChange = () => {
            const newState = document.visibilityState === "visible";
            setIsVisible(newState);
            if (onVisibilityChange)
                onVisibilityChange(newState);
        };
        // Se suscribe al evento visibilitychange
        document.addEventListener("visibilitychange", handleVisibilityChange);
        // Limpieza del evento cuando el componente se desmonta
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [onVisibilityChange]);
    return isVisible; // Retorna si la pestaña está visible o no
}
