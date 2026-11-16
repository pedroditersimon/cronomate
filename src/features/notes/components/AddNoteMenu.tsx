import { PlusIcon } from "src/assets/Icons";
import Dropdown from "src/shared/components/interactable/Dropdown";
import { NoteTemplate } from "src/features/notes/types/NotesSettings";

interface Props {
    templates: NoteTemplate[];
    onAdd: (template?: NoteTemplate) => void;
    onViewTemplates: () => void;
}

export default function AddNoteMenu({ templates, onAdd, onViewTemplates }: Props) {
    return <Dropdown
        value=""
        icon={<PlusIcon className="size-5" />}
        className="size-7 shrink-0 justify-center border-none p-0"
        options={["empty", ...templates.map(template => `template:${template.id}`), "templates"]}
        labels={{
            empty: "Nueva nota",
            templates: "Ver plantillas",
            ...Object.fromEntries(templates.map(template => [`template:${template.id}`, template.name])),
        }}
        onOption={option => {
            if (option === "templates") onViewTemplates();
            else if (option === "empty") onAdd();
            else {
                const template = templates.find(item => `template:${item.id}` === option);
                if (template) onAdd(template);
            }
        }}
    />;
}
