import { useEffect, useState } from "react";
import clsx from "clsx";
import { CrossIcon, FolderIcon } from "src/assets/Icons";
import Clickable from "src/shared/components/interactable/Clickable";
import { useTypedSelector } from "src/shared/hooks/useTypedSelector";
import InputField from "src/shared/components/forms/InputField";

interface Props {
    value?: string;
    onChange: (project?: string) => void;
    readOnly?: boolean;
}

export default function ProjectInput({ value = "", onChange, readOnly = false }: Props) {
    const projects = useTypedSelector(state => state.projects);
    const [project, setProject] = useState(value);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (!isFocused) setProject(value);
    }, [value, isFocused]);

    const visibleProjects = projects.filter(item => item.toLocaleLowerCase().includes(project.toLocaleLowerCase()));

    const saveProject = (newProject: string) => onChange(newProject.trim() || undefined);

    return (
        <div className="group flex items-center gap-1">
            <div className="relative size-3">
                <FolderIcon className="absolute -left-1 -top-1 size-5 text-gray-500" />
            </div>
            <div className="relative w-fit max-w-64">
                <InputField
                    plain
                    className={clsx(
                        "max-w-full bg-transparent outline-none rounded px-1 text-sm text-blue-300 placeholder:text-gray-500/70 focus:bg-gray-700",
                        { "hover:cursor-pointer hover:bg-gray-700": !isFocused }
                    )}
                    style={{ width: `${Math.max(project.length, "Proyecto".length) + 1}ch` }}
                    placeholder="Proyecto"
                    value={project}
                    readOnly={readOnly}
                    onChange={setProject}
                    onFocus={() => !readOnly && setIsFocused(true)}
                    onBlur={() => {
                        if (readOnly) return;
                        setIsFocused(false);
                        saveProject(project);
                    }}
                />
                {!readOnly && isFocused && visibleProjects.length > 0 &&
                    <div className="absolute z-10 top-full left-0 mt-1 min-w-full w-max rounded border-2 border-gray-700 bg-bg-primary shadow-lg">
                        {visibleProjects.map(item =>
                            <button
                                key={item}
                                className="block w-full px-2 py-1 text-left text-sm hover:bg-gray-700"
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => {
                                    setProject(item);
                                    saveProject(item);
                                    setIsFocused(false);
                                }}
                            >
                                {item}
                            </button>
                        )}
                    </div>
                }
            </div>
            {project && !readOnly &&
                <Clickable
                    className="hidden translate-y-px items-center justify-center hover:bg-gray-700 group-hover:flex"
                    onClick={() => {
                        setProject("");
                        saveProject("");
                    }}
                    tooltip={{ text: "Quitar proyecto", position: "top-center" }}
                >
                    <CrossIcon className="block size-4" />
                </Clickable>
            }
        </div>
    );
}
