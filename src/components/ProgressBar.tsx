
interface Props {
    progress: number;
    background?: string;
    foreground?: string;
}

export function ProgressBar({ progress, background, foreground }: Props) {
    const completedPercentage = Math.min(progress, 100); // Ensure the progress does not exceed 100
    // lo que se exede de 100, ponerlo en color rojo (usnaod bacgkround rojo)
    return (
        <div className={"w-full h-full min-h-1  rounded-full " + (background || "bg-gray-200")}>
            <div
                className={"h-full rounded-full " + (foreground || "bg-blue-400")}
                style={{
                    width: `${completedPercentage}%`, // Set width dynamically with inline style
                }}
            />
        </div >
    );
};
