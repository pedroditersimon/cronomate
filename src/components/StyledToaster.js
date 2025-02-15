import { jsx as _jsx } from "react/jsx-runtime";
import { Toaster } from "sonner";
export default function StyledToaster() {
    return (_jsx(Toaster, { toastOptions: {
            unstyled: true,
            classNames: {
                toast: "flex flex-row items-center w-full p-4 px-5 gap-1 rounded-lg bg-[#161616] border-2 border-gray-700 text-sm shadow-lg",
                error: 'text-red-500',
                success: 'text-green-500 ',
                warning: 'text-yellow-500',
                info: 'text-blue-500',
            },
        } }));
}
