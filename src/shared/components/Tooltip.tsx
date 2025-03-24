
const positions = {
    "top-start": "bottom-full left-0 mb-2",
    "top-center": "bottom-full left-1/2 -translate-x-1/2 mb-2",
    "top-end": "bottom-full right-0 mb-2",
    "right": "left-full top-1/2 -translate-y-1/2 ml-2",
    "left": "right-full top-1/2 -translate-y-1/2 mr-2",
    "bottom-start": "top-full left-0 mt-2",
    "bottom-center": "top-full left-1/2 -translate-x-1/2 mt-2",
    "bottom-end": "top-full right-0 mt-2"
};

export type TooltipPosition = keyof typeof positions;

interface Props {
    text: string;
    position?: TooltipPosition;
    children: React.ReactNode;
}

export default function Tooltip({ text, position = "top-center", children }: Props) {

    const positionClass = positions[position] || positions["top-center"];

    return (
        <div className="relative group inline-block">
            {children}

            {/* Tooltip */}
            <span
                className={`absolute z-50 invisible group-hover:visible ${positionClass} px-2 py-1 text-sm w-max max-w-60 h-fit break-words bg-gray-700 text-white rounded-lg`}
                children={text}
            />
        </div>
    );
};