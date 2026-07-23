import clsx, { ClassValue } from "clsx";
import { CSSProperties } from "react";

interface Props {
    value: string;
    onChange: (newValue: string) => void;
    onEnterPressed?: () => void;
    disabled?: boolean;
    placeholder?: string;
    className?: ClassValue;
    style?: CSSProperties;
    readOnly?: boolean;
    plain?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
}

export default function InputField({ value, onChange, onEnterPressed, disabled, placeholder, className, style, readOnly, plain, onFocus, onBlur }: Props) {
    return (
        <input
            className={clsx(
                !plain && "py-1 px-2 rounded-lg border-2 border-gray-700 outline-none",
                !plain && "transition-colors bg-transparent font-semibold text-gray-500 placeholder:text-gray-500/50",
                !plain && "focus:border-gray-500 focus:text-blue-300 focus:shadow", // <- focus
                !plain && { "hover:border-gray-500 hover:text-blue-300 hover:shadow": !disabled }, // <- hover
                !plain && { "opacity-50 hover:text-blue-300": disabled },
                className,
            )}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyUp={e => {
                if (onEnterPressed && e.code.toLowerCase() === "enter")
                    onEnterPressed();
            }}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            style={style}
            onFocus={onFocus}
            onBlur={onBlur}
        />
    );
}
