import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import Tooltip, { TooltipPosition } from "src/shared/components/Tooltip";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
    onClick?: () => void;
    tooltip?: {
        text: string;
        position?: TooltipPosition;
    }
}

export default function Clickable({ onClick, tooltip, children, ...props }: Props) {

    return (

        <button
            {...props}
            className={`self-center rounded-full size-5 hover:cursor-pointer ${props.className}`}
            onClick={onClick}
        >
            <Tooltip text={tooltip?.text ?? ""} position={tooltip?.position} disabled={!tooltip}>
                {children}
            </Tooltip>
        </button >

    );
}