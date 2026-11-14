import { CheckItem as CheckItemType } from "src/features/notes/types/CheckItem";
import { CheckCircle, CircleIcon, CrossIcon, PlayIcon } from "src/assets/Icons";
import { cn } from "src/shared/utils/cn";
import InputField from "src/shared/components/forms/InputField";
import { TimeInputHHmm } from "src/shared/components/interactable/TimeInputHHmm";
import { getCheckItemDueStatus } from "src/features/notes/utils/checkItemDueStatus";
import { ClipboardEvent, Ref } from "react";

interface Props {
    item: CheckItemType;
    timerRef?: Ref<HTMLInputElement>;
    currentTime?: number;
    alertWindowMs?: number;
    onChange?: (newItem: CheckItemType) => void;
    onEnterPressed?: () => void;
    onCommit?: (item: CheckItemType, focusTimer?: boolean) => void;
    onDelete?: () => void;
    onCreateActivity?: () => void;
    onPaste?: (event: ClipboardEvent<HTMLInputElement>) => void;

    placeholder?: string;
    hideToggle?: boolean;
    canToggle?: boolean;
    canDelete?: boolean;
}

export default function CheckItem({ item, timerRef, currentTime = Date.now(), alertWindowMs, onChange, onEnterPressed, onCommit, onDelete, onCreateActivity, onPaste, placeholder, hideToggle, canToggle = true, canDelete = true }: Props) {
    const dueStatus = getCheckItemDueStatus(item, currentTime, alertWindowMs);
    const dueColorClass = dueStatus === "overdue" ? "text-red-400" : "text-yellow-400";


    const toggle = () => {
        if (onChange)
            onChange({
                ...item,
                isDone: !item.isDone,
            });
    }

    const handleInputChange = (value: string) => {
        if (onChange)
            onChange({
                ...item,
                content: value,
            });
    }

    const handleDueChange = (newTime: string | null) => {
        if (onChange)
            onChange({
                ...item,
                due: newTime || undefined,
            });
    };

    return (
        <div className="group flex flex-row gap-1 items-center">
            <div
                className={cn("group cursor-pointer",
                    {
                        "pointer-events-none": !canToggle,
                        "hidden": hideToggle,
                    }
                )}
                onPointerDown={event => event.stopPropagation()}
                onClick={toggle}
            >
                <CircleIcon
                    className={cn("bg-transparent border-2 mx-1 p-2",
                        {
                            "border-gray-400 group-hover:border-green-300": !dueStatus,
                            "border-red-400": dueStatus === "overdue",
                            "border-yellow-400": dueStatus === "upcoming",
                            "hidden": item.isDone,
                        }
                    )}
                />
                <CheckCircle
                    className={cn("text-green-300 size-7",
                        { "hidden": !item.isDone, }
                    )}
                />
            </div>

            <InputField
                value={item.content}
                onEnterPressed={onEnterPressed}
                onBlur={() => onCommit?.(item)}
                onPaste={onPaste}
                onChange={handleInputChange}
                className={cn("min-w-0 flex-1 border-transparent",
                    {
                        "opacity-50 text-green-300": item.isDone,
                        [dueColorClass]: !item.isDone && !!dueStatus,
                    })}
                placeholder={placeholder}
            />

            <div className="contents" onPointerDownCapture={event => {
                if (!onCommit || !item.content.trim()) return;
                // Commit before the browser can focus the ghost timer.
                event.preventDefault();
                event.stopPropagation();
                onCommit(item, true);
            }}>
            <TimeInputHHmm
                timeHHmm={item.due || null}
                ref={timerRef}
                onChange={newTime => handleDueChange(newTime)}
                onBlur={newTime => onCommit?.({ ...item, due: newTime || undefined })}
                className={cn("w-12 shrink-0", dueStatus && dueColorClass)}
            />
            </div>

            {onCreateActivity && <button
                type="button"
                title="Iniciar actividad"
                aria-label={`Iniciar actividad: ${item.content}`}
                disabled={!item.content.trim()}
                className="invisible shrink-0 rounded p-1 text-gray-400 group-hover:visible hover:text-green-300 disabled:opacity-30"
                onPointerDown={event => event.stopPropagation()}
                onClick={onCreateActivity}
            >
                <PlayIcon className="size-5" />
            </button>}

            <div
                className={cn("flex flex-row items-center cursor-pointer",
                    { "hidden": !canDelete }
                )}
                onPointerDown={event => event.stopPropagation()}
                onClick={onDelete}
            >
                <CrossIcon
                    className="size-6 group-hover:text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100"
                />
            </div>

        </div >
    );
}
