import clsx, { ClassValue } from "clsx";

interface Props {
    className?: ClassValue;
}

export default function HSeparator({ className }: Props) {
    return (<hr
        className={clsx("border border-solid rounded border-gray-700", className)}
    />);
}