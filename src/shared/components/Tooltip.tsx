
const positions = {
    "top-start": "bottom-full left-0 mb-1",
    "top-center": "bottom-full left-1/2 -translate-x-1/2 mb-1",
    "top-end": "bottom-full right-0 mb-1",
    "right": "left-full top-1/2 -translate-y-1/2 ml-1",
    "left": "right-full top-1/2 -translate-y-1/2 mr-1",
    "bottom-start": "top-full left-0 mt-1",
    "bottom-center": "top-full left-1/2 -translate-x-1/2 mt-1",
    "bottom-end": "top-full right-0 mt-1"
};

export type TooltipPosition = keyof typeof positions;

interface Props {
    text: string;
    position?: TooltipPosition;
    disabled?: boolean;
    children: React.ReactNode;
}

export default function Tooltip({ text, position = "top-center", disabled, children }: Props) {
    if (disabled || !text.trim())
        return children;

    const positionClass = positions[position] || positions["top-center"];

    return (
        <div className="relative inline-block">
            <div className="peer">
                {children}
            </div>

            {/* Tooltip */}
            <span
                className={`absolute z-50 invisible peer-hover:visible hover:visible ${positionClass} px-2 py-1 shadow text-sm font-semibold w-max max-w-60 h-fit break-words bg-gray-400 text-gray-800 rounded-lg transition-all duration-200`}
                children={text}
            />
        </div>
    );
};