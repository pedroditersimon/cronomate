import { useEffect, useRef, useState } from "react";

interface PictureInPictureController {
    requestWindow(options: { width: number; height: number }): Promise<Window>;
}

export function useFloatingNotesWindow() {
    const [floatingWindow, setFloatingWindow] = useState<Window | null>(null);
    const [error, setError] = useState("");
    const opening = useRef(false);
    const mounted = useRef(false);
    const windowRef = useRef<Window | null>(null);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
            windowRef.current?.close();
        };
    }, []);

    const open = async () => {
        if (windowRef.current && !windowRef.current.closed) {
            windowRef.current.focus();
            return;
        }
        if (opening.current) return;

        const controller = (window as Window & {
            documentPictureInPicture?: PictureInPictureController;
        }).documentPictureInPicture;
        if (!controller) {
            setError("La ventana flotante no está disponible en este navegador.");
            return;
        }

        opening.current = true;
        let popup: Window | undefined;
        try {
            popup = await controller.requestWindow({ width: 400, height: 500 });
            if (!mounted.current) {
                popup.close();
                return;
            }
            popup.document.title = "Notas";
            const base = popup.document.createElement("base");
            base.href = document.baseURI;
            popup.document.head.appendChild(base);
            document.querySelectorAll('style, link[rel="stylesheet"]').forEach(element => {
                popup!.document.head.appendChild(element.cloneNode(true));
            });
            popup.document.documentElement.className = document.documentElement.className;
            popup.document.body.className = "m-0 p-3 text-gray-200";
            popup.addEventListener("pagehide", () => {
                windowRef.current = null;
                if (mounted.current) setFloatingWindow(null);
            }, { once: true });
            windowRef.current = popup;
            setError("");
            setFloatingWindow(popup);
        } catch {
            popup?.close();
            if (mounted.current) setError("No se pudo abrir la ventana flotante.");
        } finally {
            opening.current = false;
        }
    };

    return { floatingWindow, error, open };
}
