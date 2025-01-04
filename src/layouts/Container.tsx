import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export default function Container({ children }: Props) {
    return (
        <div className="flex flex-col gap-5 w-fit h-fit p-4 border rounded-xl border-solid border-gray-900">
            {children}
        </div>
    );
}