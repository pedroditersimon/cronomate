import { Toaster } from "sonner";

export default function StyledToaster() {
    return (
        <Toaster
            toastOptions={{
                unstyled: true,
                classNames: {
                    toast: "select-none flex flex-wrap items-center w-full p-4 px-5 gap-2 rounded-lg bg-[#161616] border-2 border-gray-700 text-sm shadow-lg",
                    content: "min-w-0 flex-1 basis-48",
                    actionButton: "ml-7 cursor-pointer rounded-lg border-2 border-gray-700 bg-transparent px-2 py-1 font-semibold text-gray-400 transition-colors hover:border-blue-300 hover:text-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300",
                    cancelButton: "ml-7 cursor-pointer rounded-lg border-2 border-gray-700 bg-transparent px-2 py-1 font-semibold text-gray-400 transition-colors hover:border-gray-400 hover:text-gray-200",
                    error: 'text-red-500',
                    success: 'text-green-500 ',
                    warning: 'text-yellow-500',
                    info: 'text-blue-500',
                },
                duration: 60 * 1000 // 60s (in millis)
            }}
        />
    );
}
