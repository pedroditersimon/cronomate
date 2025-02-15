import { ClassValue } from "clsx";
import { PropsWithChildren, ReactNode } from "react";
import { CheckIcon, MinusIcon } from "src/assets/Icons";
import Button from "./Button";

interface Props extends PropsWithChildren {
    value: boolean;
    onChange: (newValue: boolean) => void;

    checkedIcon?: ReactNode;
    uncheckedIcon?: ReactNode;
    className?: ClassValue;
}

export default function Checkbox({ value, onChange, checkedIcon, uncheckedIcon, className, children }: Props) {
    return (
        <Button
            className={className}
            onClick={() => onChange(!value)}

            icon={value
                ? checkedIcon ?? <CheckIcon className="size-5" />
                : uncheckedIcon ?? <MinusIcon className="size-5" />
            }
            children={children}
        />
    );
}