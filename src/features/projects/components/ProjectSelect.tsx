import Dropdown from "src/shared/components/interactable/Dropdown";
import useProjects from "src/features/projects/hooks/useProjects";

export const ALL_PROJECTS = "";

interface Props {
    value: string;
    onChange: (project: string) => void;
}

export default function ProjectSelect({ value, onChange }: Props) {
    const projects = useProjects();

    return (
        <Dropdown
            value={value}
            options={[ALL_PROJECTS, ...projects]}
            labels={{ [ALL_PROJECTS]: "Todos" }}
            onOption={onChange}
        />
    );
}
