import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";
import { ClassValue } from "clsx";
import clsx from "clsx";

function getLabel(option: string, labels: undefined | Record<string, string>) {
    return labels?.[option] ?? option;
}

interface Props {
    value: string;
    options: Array<string>;
    labels?: Record<string, string>;
    onOption: (option: string) => void;
    icon?: ReactNode;
    className?: ClassValue;
}

export default function Dropdown({ value, options, labels, onOption, icon, className }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!isOpen) return;
        const trigger = triggerRef.current;
        const menu = menuRef.current;
        const doc = trigger?.ownerDocument;
        const view = doc?.defaultView;
        if (!trigger || !menu || !doc || !view) return;

        const position = () => {
            const rect = trigger.getBoundingClientRect();
            const below = view.innerHeight - rect.bottom - 12;
            const above = rect.top - 12;
            const openAbove = below < Math.min(menu.scrollHeight, 200) && above > below;
            menu.style.maxHeight = `${Math.max(0, openAbove ? above : below)}px`;
            menu.style.minWidth = `${Math.min(rect.width, view.innerWidth - 16)}px`;
            menu.style.left = `${Math.max(8, Math.min(rect.left + rect.width / 2 - menu.offsetWidth / 2, view.innerWidth - menu.offsetWidth - 8))}px`;
            menu.style.top = `${openAbove ? rect.top - menu.offsetHeight - 4 : rect.bottom + 4}px`;
        };
        const dismiss = (event: PointerEvent) => {
            const target = event.target as Node;
            if (!trigger.contains(target) && !menu.contains(target)) setIsOpen(false);
        };
        const escape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
                trigger.querySelector("button")?.focus();
            }
        };
        position();
        doc.addEventListener("pointerdown", dismiss);
        doc.addEventListener("keydown", escape);
        doc.addEventListener("scroll", position, true);
        view.addEventListener("resize", position);
        return () => {
            doc.removeEventListener("pointerdown", dismiss);
            doc.removeEventListener("keydown", escape);
            doc.removeEventListener("scroll", position, true);
            view.removeEventListener("resize", position);
        };
    }, [isOpen, options, labels]);

    return (
        <div ref={triggerRef} className="relative group shrink-0">
            <Button
                className={clsx(className, { "bg-neutral-800 text-blue-300 shadow border-gray-700": isOpen })}
                icon={icon}
                onClick={() => {
                    setIsOpen(previous => !previous);
                    triggerRef.current?.ownerDocument.defaultView?.getSelection()?.removeAllRanges();
                }}
            >{getLabel(value, labels)}</Button>
            {isOpen && triggerRef.current && createPortal(
                <div ref={menuRef}
                    className="fixed z-[99999] m-0 max-w-[calc(100vw-1rem)] overflow-y-auto rounded-lg border-2 border-gray-700 bg-bg-primary shadow-lg"
                >
                    {options.map(option => <Button
                        key={option}
                        className="w-full text-left text-sm border-none rounded-none select-none whitespace-nowrap"
                        onClick={() => {
                            setIsOpen(false);
                            onOption(option);
                        }}
                    >{getLabel(option, labels)}</Button>)}
                </div>,
                triggerRef.current.ownerDocument.body,
            )}
        </div>
    );
}
