import clsx, { ClassValue } from "clsx";

interface Props {
    progress: number;
    background?: ClassValue;
    backgroundOnExcess?: ClassValue;
    foreground?: ClassValue;
}

export function ProgressBar({ progress, background, backgroundOnExcess = "bg-red-400", foreground }: Props) {
    const percentage = progress > 100 ? (100 / progress) * 100 : Math.max(0, progress);

    return (
        <div
            className={clsx("w-full h-1 rounded-full bg-gray-200",
                background,
                progress > 100 && backgroundOnExcess
            )}
        >
            <div
                className={clsx("h-full rounded-full bg-blue-400", foreground)}
                style={{ width: `${percentage}% ` }}
            />
        </div >
    );
}
