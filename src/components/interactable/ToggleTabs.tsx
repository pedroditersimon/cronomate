import { useState } from 'react';
import clsx from 'clsx';

interface Props {
    value?: boolean;
    falseLabel: string;
    trueLabel: string;
    onSelected?: (value: boolean) => void;
}

export default function ToggleTabs({ value, falseLabel, trueLabel, onSelected }: Props) {
    const [selected, setSelected] = useState(value ? trueLabel : falseLabel);

    const handleSetSelected = (option: string) => {
        const value = option === trueLabel;
        setSelected(option);
        if (onSelected)
            onSelected(value);
    }

    return (
        <div className="flex border-2 border-gray-700 rounded-md shadow">
            {/* Option 1 */}
            <button
                className={clsx("flex-1 rounded-l py-1 px-2 text-center transition-colors",
                    {
                        "bg-gray-700 text-blue-300 font-semibold": selected === falseLabel,
                        "text-gray-500 hover:text-neutral-300 hover:bg-neutral-800": selected !== falseLabel
                    })}
                onClick={() => handleSetSelected(falseLabel)}
                children={falseLabel}
            />

            {/* Option 2 */}
            <button
                className={clsx("flex-1 rounded-r py-1 px-2 text-center",
                    {
                        "bg-gray-700 text-blue-300 font-semibold": selected === trueLabel,
                        "text-gray-500 hover:text-neutral-300 hover:bg-neutral-800": selected !== trueLabel
                    })}
                onClick={() => handleSetSelected(trueLabel)}
                children={trueLabel}
            />
        </div>
    );
}
