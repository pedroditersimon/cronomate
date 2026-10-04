import { Note as NoteType } from "src/features/notes/types/Note";
import { CheckItem as CheckItemType } from "src/features/notes/types/CheckItem";
import { CrossIcon, PlusIcon, SettingsIcon } from "src/assets/Icons";
import { NotesSettings } from "src/features/notes/components/NotesSettings";
import Container from "src/shared/layouts/Container";
import ContainerOverlay from "src/shared/layouts/ContainerOverlay";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";
import Clickable from "src/shared/components/interactable/Clickable";
import { ClassValue } from "clsx";
import { cn } from "src/shared/utils/cn";
import NoteAndChecklist from "src/features/notes/components/NoteAndChecklist";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { generateId } from "src/shared/utils/generateId";
import ConfirmationService from "src/shared/services/confirmationService";

interface Props {
    notes: NoteType[];
    onNoteChange?: (newNote: NoteType) => void;
    onNoteAdd?: (note: NoteType) => void;
    onNoteDelete?: (noteId: string) => void;
    onNoteReorder?: (noteId: string, targetNoteId: string) => void;

    checklist: CheckItemType[];
    currentTime?: number;
    alertWindowMs?: number;
    onChecklistChange?: (items: CheckItemType[]) => void;
    onCheckItemAdd?: (items: CheckItemType[]) => void;
    onCheckItemDelete?: (id: string) => void;
    onCheckItemUpdate?: (item: CheckItemType) => void;
    onCheckItemReorder?: (itemId: string, targetItemId?: string) => void;

    className?: ClassValue;
}

export default function NoteAndChecklistPlinth({
    notes,
    onNoteChange,
    onNoteAdd,
    onNoteDelete,
    onNoteReorder,

    checklist,
    currentTime,
    alertWindowMs,
    onChecklistChange,
    onCheckItemAdd,
    onCheckItemDelete,
    onCheckItemUpdate,
    onCheckItemReorder,

    className,
}: Props) {
    const [showSettings, setShowSettings] = useState(false);
    const [activeNoteId, setActiveNoteId] = useState(notes[0]?.id);
    const [draggedNoteId, setDraggedNoteId] = useState<string>();
    const activeNote = notes.find(note => note.id === activeNoteId);

    useEffect(() => {
        setActiveNoteId(id => notes.some(note => note.id === id) ? id : notes[0]?.id);
    }, [notes]);

    const addNote = () => {
        const note = {
            id: generateId(),
            title: "Nota",
            content: "",
            createdAt: DateTime.now().toFormat("dd/MM/yyyy HH:mm"),
        };

        onNoteAdd?.(note);
        setActiveNoteId(note.id);
    };

    const deleteNote = (noteId: string) => {
        const note = notes.find(note => note.id === noteId);
        if (!note) return;

        const deletedIndex = notes.findIndex(note => note.id === noteId);
        const nextNote = notes[deletedIndex + 1] ?? notes[deletedIndex - 1];

        ConfirmationService.confirm({
            title: "Eliminar nota",
            description: `¿Seguro que quieres eliminar la nota "${note.title}"?`,
            confirmText: "Eliminar",
            cancelText: "Cancelar",
            onConfirm: () => {
                setActiveNoteId(nextNote?.id);
                onNoteDelete?.(noteId);
            },
        });
    };

    return (
        <Container
            width="min-w-0"
            className={cn("h-fit", className)}
            style={{ width: "24rem", maxWidth: "100%" }}
        >

            {/* Settings panel */}
            <ContainerOverlay show={showSettings}>
                <NotesSettings onClose={() => setShowSettings(false)} />
            </ContainerOverlay>

            <ContainerTopbar
                className="group"
                title="Notas"
                icon={<SettingsIcon />}
                onIconClick={() => setShowSettings(true)}
            />

            <div className="flex flex-col gap-1">
                <div className="flex w-full min-w-0 items-center gap-1 overflow-x-auto">
                    {notes.map((note, index) => (
                        <div
                            key={note.id}
                            draggable={!!onNoteReorder}
                            className={cn(
                                "group flex shrink-0 items-center border-b-2 text-sm transition-colors",
                                note.id !== activeNoteId && "cursor-pointer",
                                note.id === activeNoteId
                                    ? "border-blue-400 text-blue-300"
                                    : "border-gray-700 text-gray-500 hover:text-gray-300",
                            )}
                            onClick={() => setActiveNoteId(note.id)}
                            onDragStart={() => setDraggedNoteId(note.id)}
                            onDragOver={event => event.preventDefault()}
                            onDrop={() => draggedNoteId && onNoteReorder?.(draggedNoteId, note.id)}
                            onDragEnd={() => setDraggedNoteId(undefined)}
                        >
                            {note.id === activeNoteId
                                ? <input
                                    aria-label={`Título de la nota ${index + 1}`}
                                    className="w-20 bg-transparent px-2 py-1 outline-none"
                                    value={note.title}
                                    readOnly={!onNoteChange}
                                    onClick={event => event.stopPropagation()}
                                    onChange={event => onNoteChange?.({ ...note, title: event.target.value })}
                                />
                                : <span className="w-20 truncate px-2 py-1">{note.title}</span>
                            }
                            {onNoteDelete &&
                                <button
                                    type="button"
                                    className="invisible mr-1 rounded p-0.5 text-gray-400 hover:bg-gray-700 hover:text-red-300 group-hover:visible"
                                    title="Borrar nota"
                                    onClick={event => {
                                        event.stopPropagation();
                                        deleteNote(note.id);
                                    }}
                                >
                                    <CrossIcon className="size-5" />
                                </button>
                            }
                        </div>
                    ))}
                    {onNoteAdd &&
                        <Clickable
                            className="size-7 shrink-0 p-0 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-blue-300"
                            onClick={addNote}
                        >
                            <PlusIcon className="size-5" />
                        </Clickable>
                    }
            </div>

                {activeNote && <NoteAndChecklist
                    note={activeNote}
                    onNoteChange={onNoteChange}

                    checklist={checklist}
                    currentTime={currentTime}
                    alertWindowMs={alertWindowMs}
                    onChecklistChange={onChecklistChange}
                    onCheckItemAdd={onCheckItemAdd}
                    onCheckItemDelete={onCheckItemDelete}
                    onCheckItemUpdate={onCheckItemUpdate}
                    onCheckItemReorder={onCheckItemReorder}
                />}
            </div>
        </Container>
    );
}
