import { jsx as _jsx } from "react/jsx-runtime";
import { CheckIcon, MinusIcon } from "src/assets/Icons";
import Button from "./Button";
export default function Checkbox({ value, onChange, checkedIcon, uncheckedIcon, className, children }) {
    return (_jsx(Button, { className: className, onClick: () => onChange(!value), icon: value
            ? checkedIcon !== null && checkedIcon !== void 0 ? checkedIcon : _jsx(CheckIcon, { className: "size-5" })
            : uncheckedIcon !== null && uncheckedIcon !== void 0 ? uncheckedIcon : _jsx(MinusIcon, { className: "size-5" }), children: children }));
}
