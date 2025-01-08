import clsx, { ClassValue } from "clsx";

interface Props {
    progress: number;
    background?: ClassValue;
    foreground?: ClassValue;
}

export function ProgressBar({ progress, background, foreground }: Props) {
    const percentage = progress > 100 ? (100 / progress) * 100 : Math.max(0, progress);

    return (
        <div
            className={clsx("w-full h-1 rounded-full bg-gray-200", background,
                { "bg-red-400": progress > 100, })}
        >
            <div
                className={clsx("h-full rounded-full bg-blue-400", foreground)}
                style={{ width: `${percentage}% ` }}
            />
        </div>
    );
}
