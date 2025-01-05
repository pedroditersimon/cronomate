import { useState, useEffect } from "react";

export default function usePageVisibility() {
    const [isVisible, setIsVisible] = useState(document.visibilityState === "visible");

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsVisible(document.visibilityState === "visible");
        };

        // Se suscribe al evento visibilitychange
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // Limpieza del evento cuando el componente se desmonta
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    return isVisible; // Retorna si la pestaña está visible o no
}

