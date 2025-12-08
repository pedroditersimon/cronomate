import { ClassValue } from "clsx";
import { useEffect, useRef } from "react";
import { Note as NoteType } from "src/features/notes/types/Note";
import { cn } from "src/shared/utils/cn";

interface Props {
    note: NoteType;
    onChange?: (newNote: NoteType) => void;

    disabled?: boolean;
    placeholder?: string;
    className?: ClassValue;
    autoResize?: boolean;
}

export default function Note({ note, onChange, disabled, placeholder, autoResize = true, className }: Props) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize on content change
    useEffect(() => {
        if (!autoResize) return;
        const el = textareaRef.current;
        if (!el) return;

        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, [note.content, autoResize]);

    return (
        <textarea
            ref={textareaRef}
            className={cn("py-1 px-2 rounded-lg border-2 border-gray-700 outline-none",
                "min-h-20 h-fit resize-none",
                "transition-colors bg-transparent font-semibold text-gray-500 placeholder:text-gray-500/50",
                "focus:border-gray-500 focus:text-blue-300 focus:shadow", // <- focus
                { "hover:border-gray-500 hover:text-blue-300 hover:shadow": !disabled }, // <- hover
                { "opacity-50 hover:text-blue-300": disabled },
                { "overflow-hidden": autoResize },
                className,
            )}
            placeholder={placeholder}
            value={note.content}
            onChange={e => {
                if (onChange)
                    onChange({ ...note, content: e.target.value })
            }}
        />
    );
}
