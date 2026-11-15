import { useState } from "react";
import Note from "src/features/notes/components/Note";
import { useNotesSettings } from "src/features/notes/hooks/useNotesSettings";
import { NoteTemplate } from "src/features/notes/types/NotesSettings";
import FormField from "src/shared/components/forms/FormField";
import InputField from "src/shared/components/forms/InputField";
import Button from "src/shared/components/interactable/Button";
import ConfirmationService from "src/shared/services/confirmationService";
import { ButtonVariant } from "src/shared/types/ButtonVariant";
import { generateId } from "src/shared/utils/generateId";

export default function NoteTemplatesSettings() {
    const { settings, setSettings } = useNotesSettings();
    const [draft, setDraft] = useState<NoteTemplate | null>(null);

    const save = () => {
        if (!draft?.name.trim()) return;
        const template = { ...draft, name: draft.name.trim() };
        const exists = settings.templates.some(item => item.id === template.id);
        setSettings({
            ...settings,
            templates: exists
                ? settings.templates.map(item => item.id === template.id ? template : item)
                : [...settings.templates, template],
        });
        setDraft(null);
    };

    const deleteTemplate = (template: NoteTemplate) => {
        ConfirmationService.confirm({
            title: "Eliminar plantilla",
            description: `¿Eliminar la plantilla "${template.name}"?`,
            confirmText: "Eliminar",
            cancelText: "Cancelar",
            onConfirm: () => {
                setSettings({ ...settings, templates: settings.templates.filter(item => item.id !== template.id) });
            },
        });
    };

    return <FormField title="Plantillas">
        <div className="flex flex-col gap-2">
            {draft ? <>
                    <label>
                        <span className="sr-only">Nombre de la plantilla</span>
                        <InputField className="w-full" placeholder="Nombre" value={draft.name}
                            onChange={name => setDraft({ ...draft, name })} />
                    </label>
                    <label className="flex flex-col">
                        <span className="sr-only">Contenido de la plantilla</span>
                        <Note placeholder="Contenido" note={{ id: draft.id, title: draft.name, content: draft.content, createdAt: "" }}
                            onChange={note => setDraft({ ...draft, content: note.content })} />
                    </label>
                <div className="flex justify-end gap-2">
                    <Button onClick={() => setDraft(null)}>Cancelar</Button>
                    <Button onClick={save} disabled={!draft.name.trim()}>Guardar</Button>
                </div>
            </> : <>
                <Button onClick={() => setDraft({ id: generateId(), name: "", content: "" })}>Nueva plantilla</Button>
                {settings.templates.length === 0 && <p className="text-sm text-gray-500">Sin plantillas.</p>}
                {settings.templates.map(template => <div key={template.id} className="flex min-w-0 items-center gap-2">
                    <span className="min-w-0 flex-1 truncate text-sm text-gray-400" title={template.name}>{template.name}</span>
                    <Button onClick={() => setDraft({ ...template })}>Editar</Button>
                    <Button variant={ButtonVariant.Danger} onClick={() => deleteTemplate(template)}>Eliminar</Button>
                </div>)}
            </>}
        </div>
    </FormField>;
}
