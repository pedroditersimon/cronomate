import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { DateTime } from "luxon";
import { capitalize } from "lodash";
import clsx from "clsx";
import useClickOut from "src/shared/hooks/useClickOut";

// Type definitions
interface MonthRange {
    start: string | null; // Format: 'YYYY-MM'
    end: string | null;
}

interface MonthRangeSelectorProps {
    value: MonthRange;
    onOption: (range: MonthRange) => void;
    className?: string;
}

// Shortcuts configuration - without "Todos", with "Mes actual"
const SHORTCUTS = [
    { label: "Mes actual", getValue: () => getCurrentMonthRange() },
    { label: "Últimos 3 meses", getValue: () => getLastNMonthsRange(3) },
    { label: "Últimos 6 meses", getValue: () => getLastNMonthsRange(6) },
    { label: "Año actual", getValue: () => getCurrentYearRange() },
    { label: "Último año", getValue: () => getLastYearRange() },
];

// Helper functions for shortcuts
function getLastNMonthsRange(n: number): MonthRange {
    const now = DateTime.now();
    const end = now.toFormat("yyyy-MM");
    const start = now.minus({ months: n - 1 }).toFormat("yyyy-MM");
    return { start, end };
}

function getCurrentYearRange(): MonthRange {
    const now = DateTime.now();
    const year = now.year;
    return {
        start: `${year}-01`,
        end: `${year}-12`,
    };
}

function getLastYearRange(): MonthRange {
    const now = DateTime.now();
    const year = now.year - 1;
    return {
        start: `${year}-01`,
        end: `${year}-12`,
    };
}

function getCurrentMonthRange(): MonthRange {
    const now = DateTime.now();
    const currentMonth = now.toFormat("yyyy-MM");
    return { start: currentMonth, end: currentMonth };
}

// Format month for display
function formatMonth(monthStr: string): string {
    const [year, month] = monthStr.split("-");
    const date = DateTime.fromObject({ year: parseInt(year), month: parseInt(month) });
    return capitalize(date.toFormat("LLLL yyyy"));
}

// Check if month is in range
function isInRange(monthStr: string, range: MonthRange | null): boolean {
    if (!range || !range.start || !range.end) return false;
    return monthStr >= range.start && monthStr <= range.end;
}

// Check if month is start or end of range
function isRangeEdge(monthStr: string, range: MonthRange | null): "start" | "end" | null {
    if (!range) return null;
    if (monthStr === range.start) return "start";
    if (monthStr === range.end) return "end";
    return null;
}

// Month names for display
const MONTH_NAMES = [
    "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
    "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"
];

export default function MonthRangeSelector({ value, onOption, className }: MonthRangeSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [tempRange, setTempRange] = useState<MonthRange>(value);
    const [selectingEnd, setSelectingEnd] = useState(false);
    const [selectedYear, setSelectedYear] = useState(DateTime.now().year);
    const [isPositioned, setIsPositioned] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const positionRef = useRef({ top: 0, left: 0 });

    // Update position when opening
    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            positionRef.current = {
                top: rect.bottom + 8,
                left: rect.left + (rect.width / 2),
            };
            setIsPositioned(true);
        } else {
            setIsPositioned(false);
        }
    }, [isOpen]);

    const { handleMouseEnter, handleMouseLeave } = useClickOut(() => {
        if (isOpen) {
            setIsOpen(false);
            setTempRange(value);
            setSelectingEnd(false);
        }
    });

    const displayValue = useMemo(() => {
        if (!value.start || !value.end) return "Seleccionar rango";
        if (value.start === value.end) return formatMonth(value.start);
        return `${formatMonth(value.start)} - ${formatMonth(value.end)}`;
    }, [value]);

    const handleMonthClick = useCallback((month: number) => {
        const monthStr = `${selectedYear}-${month.toString().padStart(2, "0")}`;

        if (!selectingEnd) {
            // Start selection - reset and set start
            setTempRange({ start: monthStr, end: null });
            setSelectingEnd(true);
        } else {
            // End selection - complete the range
            const start = tempRange.start!;
            const end = monthStr;

            // Ensure start is before end
            const finalRange = start <= end
                ? { start, end }
                : { start: end, end: start };

            setTempRange(finalRange);
            setSelectingEnd(false);
            onOption(finalRange);
        }
    }, [selectingEnd, tempRange, onOption, selectedYear]);

    const handleShortcut = useCallback((getRange: () => MonthRange) => {
        const range = getRange();
        // Update selected year based on shortcut
        if (range.start) {
            setSelectedYear(parseInt(range.start.split("-")[0]));
        }
        setTempRange(range);
        onOption(range);
    }, [onOption]);

    const handleClear = useCallback(() => {
        setTempRange({ start: null, end: null });
        setSelectingEnd(false);
    }, []);

    const toggleDropdown = useCallback(() => {
        setIsOpen(prev => !prev);
        if (!isOpen) {
            // Set selected year based on current value
            if (value.start) {
                setSelectedYear(parseInt(value.start.split("-")[0]));
            }
            setTempRange(value);
            setSelectingEnd(false);
        }
        window.getSelection()?.removeAllRanges();
    }, [isOpen, value]);

    // Keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            setIsOpen(false);
            setTempRange(value);
            setSelectingEnd(false);
        }
    }, [value]);

    // Filter range for selected year
    const filteredRange = useMemo(() => {
        if (!tempRange.start || !tempRange.end) return tempRange;

        const startYear = parseInt(tempRange.start.split("-")[0]);
        const endYear = parseInt(tempRange.end.split("-")[0]);

        if (selectedYear < startYear || selectedYear > endYear) {
            return { start: null, end: null };
        }

        return tempRange;
    }, [tempRange, selectedYear]);

    return (
        <div
            className={clsx("relative group", className)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Trigger Button */}
            <button
                ref={triggerRef}
                onClick={toggleDropdown}
                className={clsx(
                    "min-w-48 text-left flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg border-2 border-gray-700 text-gray-400 hover:bg-neutral-800",
                    { "bg-neutral-800 text-blue-300 shadow border-gray-700": isOpen }
                )}
            >
                <span className="truncate">{displayValue}</span>
            </button>

            {/* Dropdown Panel - Portal to body - only show after positioning */}
            {isOpen && isPositioned && createPortal(
                <div
                    className={clsx(
                        "fixed transform -translate-x-1/2",
                        "bg-bg-primary border-2 border-gray-700 rounded-lg shadow-lg",
                        "p-4 min-w-72 z-[9999]"
                    )}
                    style={{ top: positionRef.current.top, left: positionRef.current.left }}
                    role="dialog"
                    aria-label="Seleccionar rango de meses"
                    onKeyDown={(e) => handleKeyDown(e)}
                >
                    {/* Year Selector with prev/next buttons */}
                    <div className="flex items-center justify-center gap-2 mb-2 pb-1 border-b border-gray-700">
                        <button
                            onClick={() => setSelectedYear(prev => prev - 1)}
                            className="text-gray-300 hover:text-white hover:bg-neutral-700 p-0.5 rounded transition-colors text-xs"
                            aria-label="Año anterior"
                        >
                            ◀
                        </button>
                        <span className="text-sm font-medium text-gray-200 min-w-10 text-center">
                            {selectedYear}
                        </span>
                        <button
                            onClick={() => setSelectedYear(prev => prev + 1)}
                            className="text-gray-300 hover:text-white hover:bg-neutral-700 p-0.5 rounded transition-colors text-xs"
                            aria-label="Año siguiente"
                        >
                            ▶
                        </button>
                    </div>

                    {/* Shortcuts */}
                    <div className="flex flex-wrap gap-1 mb-2 pb-1 border-b border-gray-700">
                        {SHORTCUTS.map((shortcut, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleShortcut(shortcut.getValue)}
                                className="text-xs px-1.5 py-0.5 rounded bg-neutral-700 hover:bg-neutral-600 
                                           text-gray-200 transition-colors duration-150"
                            >
                                {shortcut.label}
                            </button>
                        ))}
                    </div>

                    {/* Month Grid - 4x3 (12 months) */}
                    <div
                        className="grid grid-cols-4 gap-0.5"
                        role="grid"
                        aria-label="Meses"
                    >
                        {MONTH_NAMES.map((monthName, idx) => {
                            const month = idx + 1;
                            const monthStr = `${selectedYear}-${month.toString().padStart(2, "0")}`;
                            const inRange = isInRange(monthStr, filteredRange.start ? filteredRange : null);
                            const edge = isRangeEdge(monthStr, filteredRange.start ? filteredRange : null);
                            const isSelecting = selectingEnd && monthStr === tempRange.start;

                            return (
                                <button
                                    key={monthStr}
                                    onClick={() => handleMonthClick(month)}
                                    className={clsx(
                                        "text-xs py-1 px-0.5 rounded transition-all duration-150",
                                        "focus:outline-none focus:ring-1 focus:ring-blue-400",
                                        "text-gray-300 hover:bg-neutral-700",
                                        { "bg-blue-900/50 text-blue-200": inRange && !edge },
                                        { "bg-blue-600 text-white font-medium": edge === "start" },
                                        { "bg-blue-600 text-white font-medium": edge === "end" },
                                        { "ring-2 ring-blue-400": isSelecting },
                                        { "bg-neutral-600 cursor-wait": selectingEnd && !tempRange.start }
                                    )}
                                    role="gridcell"
                                    aria-label={`${monthName} ${selectedYear}`}
                                    aria-selected={inRange}
                                >
                                    {monthName}
                                </button>
                            );
                        })}
                    </div>

                    {/* Selection hint */}
                    <div className="mt-1 pt-1 border-t border-gray-700 text-xs text-gray-400">
                        {!tempRange.start && !selectingEnd && "Haz clic en un mes para iniciar"}
                        {tempRange.start && !tempRange.end && selectingEnd && "Selecciona el mes final"}
                        {tempRange.start && tempRange.end && "Rango seleccionado"}
                    </div>

                    {/* Clear button */}
                    {(tempRange.start || selectingEnd) && (
                        <div className="mt-1 flex justify-end">
                            <button
                                onClick={handleClear}
                                className="text-xs text-gray-400 hover:text-gray-200 underline"
                            >
                                Limpiar
                            </button>
                        </div>
                    )}
                </div>,
                document.body
            )}
        </div>
    );
}