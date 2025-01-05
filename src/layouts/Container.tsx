import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export default function Container({ children }: Props) {
    return (
        <div className="flex flex-col gap-5 w-fit h-fit p-4 border rounded-lg border-solid border-transparent bg-[#161616]">
            {children}
        </div>
    );
}