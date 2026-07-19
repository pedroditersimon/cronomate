import "cally";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "src/assets/Icons";
import Button from "src/shared/components/interactable/Button";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

const navigationStyles = `
    :host { --color-accent: #60a5fa; --color-text-on-accent: #161616; }
    button[part~="previous"], button[part~="next"] {
        appearance: none; background: transparent; border: 2px solid #374151;
        border-radius: 0.5rem; color: #9ca3af; cursor: pointer;
        min-height: 2rem; min-width: 2rem; padding: 0.25rem;
        transition: color 150ms, background-color 150ms, box-shadow 150ms;
    }
    button[part~="previous"]:hover, button[part~="next"]:hover {
        background-color: #374151; box-shadow: 0 1px 2px rgb(0 0 0 / 0.2); color: #93c5fd;
    }
`;

const selectionStyles = `
    button[part~="range-inner"], button[part~="range-start"], button[part~="range-end"] {
        background-color: #374151 !important; color: #d1d5db !important; font-weight: normal !important;
    }
    button[part~="range-start"] { border-radius: 0.375rem 0 0 0.375rem; }
    button[part~="range-end"] { border-radius: 0 0.375rem 0.375rem 0; }
`;

const addShadowStyle = (root: ShadowRoot | null, css: string) => {
    const style = document.createElement("style");
    style.textContent = css;
    root?.append(style);
    return style;
};

const formatRange = (value: string) => {
    const [start, end] = value.split("/").map(date => DateTime.fromISO(date).setLocale("es-AR"));
    return start.isValid && end.isValid
        ? `${start.toFormat("d LLL yyyy")} - ${end.toFormat("d LLL yyyy")}`
        : "Seleccionar fechas";
};

const formatPageTitle = (date: DateTime) => {
    const month = date.setLocale("es-AR").toFormat("LLLL");
    return `${date.toFormat("yyyy")} ${month.charAt(0).toUpperCase()}${month.slice(1)}`;
};

export default function DateRangePicker({ value, onChange }: Props) {
    const calendarRef = useRef<HTMLElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [pageDate, setPageDate] = useState(() => DateTime.now().startOf("month"));

    useEffect(() => {
        const calendar = calendarRef.current;
        if (!calendar) return;

        const handleChange = () => {
            onChange((calendar as HTMLElement & { value: string }).value);
            setIsOpen(false);
        };
        calendar.addEventListener("change", handleChange);
        return () => calendar.removeEventListener("change", handleChange);
    }, [onChange]);

    useEffect(() => {
        const calendar = calendarRef.current;
        if (!calendar) return;

        let removeStyles: (() => void) | undefined;
        const frame = requestAnimationFrame(() => {
            const navigation = addShadowStyle(calendar.shadowRoot, navigationStyles);
            const month = calendar.querySelector("calendar-month");
            const monthStyles = addShadowStyle(
                month?.shadowRoot ?? null,
                `[part='heading'] { display: none; } ${selectionStyles}`
            );
            removeStyles = () => {
                navigation.remove();
                monthStyles.remove();
            };
        });
        return () => {
            cancelAnimationFrame(frame);
            removeStyles?.();
        };
    }, []);

    useEffect(() => {
        const close = (event: PointerEvent | KeyboardEvent) => {
            if (event instanceof KeyboardEvent ? event.key === "Escape" : !pickerRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("pointerdown", close);
        document.addEventListener("keydown", close);
        return () => {
            document.removeEventListener("pointerdown", close);
            document.removeEventListener("keydown", close);
        };
    }, []);

    return (
        <div ref={pickerRef} className="relative">
            <Button
                icon={<CalendarIcon className="size-5" />}
                onClick={() => setIsOpen(open => !open)}
                className={isOpen ? "bg-neutral-800 text-blue-300 shadow border-gray-700" : undefined}
            >
                {formatRange(value)}
            </Button>

            <div className={`absolute right-0 top-full z-50 mt-2 rounded-lg border-2 border-gray-700 bg-bg-primary p-3 shadow-lg ${isOpen ? "" : "hidden"}`}>
                <calendar-range ref={calendarRef} value={value} months={1} locale="es-AR">
                    <span slot="previous" aria-label="Mes anterior" onClick={() => setPageDate(date => date.minus({ months: 1 }))}>
                        <ChevronLeftIcon className="size-5" />
                    </span>
                    <span slot="heading">{formatPageTitle(pageDate)}</span>
                    <span slot="next" aria-label="Mes siguiente" onClick={() => setPageDate(date => date.plus({ months: 1 }))}>
                        <ChevronRightIcon className="size-5" />
                    </span>
                    <calendar-month />
                </calendar-range>
            </div>
        </div>
    );
}

declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            "calendar-range": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                months?: number;
                value?: string;
                locale?: string;
            };
            "calendar-month": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}
