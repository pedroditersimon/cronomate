import { CheckItem as CheckItemType } from "src/features/notes/types/CheckItem";
import { CheckCircle, CircleIcon, CrossIcon } from "src/assets/Icons";
import { cn } from "src/shared/utils/cn";
import InputField from "src/shared/components/forms/InputField";
import { TimeInputHHmm } from "src/shared/components/interactable/TimeInputHHmm";

interface Props {
    item: CheckItemType;
    onChange?: (newItem: CheckItemType) => void;
    onEnterPressed?: () => void;
    onDelete?: () => void;

    placeholder?: string;
    hideToggle?: boolean;
    canToggle?: boolean;
    canDelete?: boolean;
}

export default function CheckItem({ item, onChange, onEnterPressed, onDelete, placeholder, hideToggle, canToggle = true, canDelete = true }: Props) {

    // TODO: Add due date color indicator (yellow for upcoming, red for overdue)
    // TODO: Add drag and drop 


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
                onClick={toggle}
            >
                <CircleIcon
                    className={cn("bg-transparent group-hover:border-green-300 border-2 border-gray-400 mx-1 p-2",
                        { "hidden": item.isDone, }
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
                onChange={handleInputChange}
                className={cn("border-transparent",
                    { "opacity-50 text-green-300": item.isDone, })}
                placeholder={placeholder}
            />

            <TimeInputHHmm
                timeHHmm={item.due || null}
                onChange={newTime => handleDueChange(newTime)}
            />

            <div
                className={cn("flex flex-row items-center cursor-pointer",
                    { "hidden": !canDelete }
                )}
                onClick={onDelete}
            >
                <CrossIcon
                    className="size-6 group-hover:text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100"
                />
            </div>

        </div >
    );
}