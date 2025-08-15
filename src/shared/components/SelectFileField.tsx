import React, { useState } from "react";
import clsx from "clsx";
import Button from "src/shared/components/interactable/Button";
import { CrossIcon, DocIcon } from "src/assets/Icons";

interface Props {
    maxFiles?: number | null;

    files: File[];
    onSelect: (files: File[]) => void;
}

export default function SelectFileField({ maxFiles, files, onSelect }: Props) {
    // Hidden input to open the explorer
    const inputRef = React.useRef<HTMLInputElement>(null);

    const [isFileHovering, setIsFileHovering] = useState(false);

    const multipleSelection = !maxFiles || maxFiles > 1;
    const hasFiles = files.length > 0;

    const handleSetFiles = (fileList: FileList | null) => {
        let _files = fileList ? Array.from(fileList) : [];

        // cap to the maxFiles
        if (maxFiles && _files.length > maxFiles)
            _files = _files.slice(0, maxFiles);

        onSelect(_files);
    };

    const handleChooseFiles = () => {
        inputRef.current?.click();
    };

    const handleClearFiles = () => {
        handleSetFiles(null);
    }

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsFileHovering(true);
    };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsFileHovering(false);
    };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsFileHovering(true);
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsFileHovering(false);
        handleSetFiles(e.dataTransfer.files);
    };

    const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        handleSetFiles(e.target.files);
    };

    return (
        <div
            className={clsx(
                "w-full flex flex-col gap-2 items-start justify-between p-2 rounded-lg",
                "transition-colors border-2 border-dotted border-gray-700 ",
                { "bg-gray-700 border-transparent": isFileHovering }
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {/* File list */}
            {hasFiles && (
                <ul className="text-sm font-semibold text-gray-500">
                    {Array.from(files).map((file, idx) => (
                        <li key={idx} className="truncate flex items-center">
                            <DocIcon className="size-5" />
                            <span>{file.name}</span>
                        </li>
                    ))}
                </ul>
            )}

            {/* Choose */}
            <div
                className={clsx(
                    "flex flex-row gap-2 items-center w-full",
                    hasFiles ? "justify-end" : "justify-center"
                )}
            >
                <Button
                    className={clsx({ "hidden": !hasFiles })}
                    onClick={handleClearFiles}
                    icon={<CrossIcon className="size-5" />}
                    textOnly
                >
                    Limpiar
                </Button>

                <Button
                    onClick={handleChooseFiles}
                    icon={<DocIcon className="size-5" />}
                    textOnly
                >
                    Elegir archivos
                </Button>

                {/* Hidden input to open the explorer */}
                <input
                    ref={inputRef}
                    className="hidden"
                    type="file"
                    multiple={multipleSelection}
                    max={maxFiles ?? undefined}
                    onChange={onChange}
                    tabIndex={-1}
                />
            </div>

        </div>
    );
}