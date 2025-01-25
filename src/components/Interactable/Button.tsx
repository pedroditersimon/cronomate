import clsx from "clsx";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
    onClick: () => void;
}

export default function Button({ children, onClick }: Props) {
    return (
        <button
            className={clsx("flex-1 rounded-lg py-1 px-2 text-center border-2 border-gray-700",
                "bg-transparent font-semibold text-gray-500  ",  // not hover
                "hover:bg-gray-700 hover:text-blue-300"                         // hover
            )}
            onClick={onClick}
            children={children}
        />
    );
}