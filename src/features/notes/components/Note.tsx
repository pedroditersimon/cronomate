import { ClassValue } from "clsx";
import { useLayoutEffect, useRef } from "react";
import { Note as NoteType } from "src/features/notes/types/Note";
import { cn } from "src/shared/utils/cn";

interface Props {
    note: NoteType;
    onChange?: (newNote: NoteType) => void;

    disabled?: boolean;
    placeholder?: string;
    className?: ClassValue;
}

function resizeToContent(textarea: HTMLTextAreaElement) {
    textarea.style.height = "0px";

    const maxHeight = 20 * Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
    const height = Math.min(textarea.scrollHeight, maxHeight);

    textarea.style.height = `${height}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
}

export default function Note({ note, onChange, disabled, placeholder, className }: Props) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useLayoutEffect(() => {
        if (textareaRef.current) resizeToContent(textareaRef.current);
    }, [note.content]);

    return (
        <textarea
            ref={textareaRef}
            className={cn("py-1 px-2 rounded-lg border-2 border-gray-700 outline-none",
                "min-h-20 max-h-80 shrink-0 resize-none overflow-y-auto",
                "transition-colors bg-transparent font-semibold text-gray-500 placeholder:text-gray-500/50",
                "focus:border-gray-500 focus:text-blue-300 focus:shadow", // <- focus
                { "hover:border-gray-500 hover:text-blue-300 hover:shadow": !disabled }, // <- hover
                { "opacity-50 hover:text-blue-300": disabled },
                className,
            )}
            placeholder={placeholder}
            value={note.content}
            onInput={e => resizeToContent(e.currentTarget)}
            onChange={e => {
                if (onChange)
                    onChange({ ...note, content: e.target.value })
            }}
        />
    );
}
