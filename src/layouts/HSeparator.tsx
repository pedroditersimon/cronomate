import clsx, { ClassValue } from "clsx";

interface Props {
    className?: ClassValue;
}

export default function HSeparator({ className }: Props) {
    return (<hr
        className={clsx("w-fullself-center border-1 border-solid rounded border-gray-600", className)}
    />);
}