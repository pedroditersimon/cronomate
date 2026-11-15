import { Note as NoteType } from "src/features/notes/types/Note";
import { CheckItem as CheckItemType } from "src/features/notes/types/CheckItem";
import { CrossIcon, FloatingWindowIcon, SettingsIcon } from "src/assets/Icons";
import { NotesSettings } from "src/features/notes/components/NotesSettings";
import Container from "src/shared/layouts/Container";
import ContainerOverlay from "src/shared/layouts/ContainerOverlay";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";
import Clickable from "src/shared/components/interactable/Clickable";
import Button from "src/shared/components/interactable/Button";
import { ClassValue } from "clsx";
import { cn } from "src/shared/utils/cn";
import NoteAndChecklist from "src/features/notes/components/NoteAndChecklist";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DateTime } from "luxon";
import { generateId } from "src/shared/utils/generateId";
import ConfirmationService from "src/shared/services/confirmationService";
import { createPortal } from "react-dom";
import { useFloatingNotesWindow } from "src/features/notes/hooks/useFloatingNotesWindow";
import { useNotesSettings } from "src/features/notes/hooks/useNotesSettings";
import { NoteTemplate } from "src/features/notes/types/NotesSettings";
import AddNoteMenu from "src/features/notes/components/AddNoteMenu";

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
    onCheckItemCreateActivity?: (item: CheckItemType) => void;

    className?: ClassValue;
    floating?: boolean;
}

export default function NoteAndChecklistPlinth(props: Props) {
    const {
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
        onCheckItemCreateActivity,

        className,
        floating = false,
    } = props;
    const { floatingWindow, error: floatingError, open: openFloatingWindow } = useFloatingNotesWindow();
    const [showSettings, setShowSettings] = useState(false);
    const { settings } = useNotesSettings();
    const readOnly = !onNoteChange && !onNoteAdd && !onNoteDelete && !onChecklistChange
        && !onCheckItemAdd && !onCheckItemDelete && !onCheckItemUpdate;
    const [activeNoteId, setActiveNoteId] = useState(notes[0]?.id);
    const [expandedNotes, setExpandedNotes] = useState(false);
    const [hasMoreNotes, setHasMoreNotes] = useState(false);
    const [visibleNoteCount, setVisibleNoteCount] = useState(notes.length);
    const noteTabsRef = useRef<HTMLDivElement>(null);
    const expandButtonRef = useRef<HTMLDivElement>(null);
    const [draggedNoteId, setDraggedNoteId] = useState<string>();
    const activeNote = notes.find(note => note.id === activeNoteId);

    useLayoutEffect(() => {
        const tabs = noteTabsRef.current;
        if (!tabs) return;
        const measure = () => {
            const items = Array.from(tabs.querySelectorAll<HTMLElement>("[data-note-tab]"));
            const expandButton = expandButtonRef.current;
            if (!expandButton) return;

            // Measure all tabs before hiding the ones outside the first row.
            items.forEach(item => { item.style.display = "flex"; });
            expandButton.style.display = "flex";
            const widths = items.map(item => item.getBoundingClientRect().width);
            const available = tabs.clientWidth;
            const gap = Number.parseFloat(
                tabs.ownerDocument.defaultView?.getComputedStyle(tabs).columnGap ?? "0",
            ) || 0;
            const total = widths.reduce((sum, width) => sum + width, 0) + Math.max(0, widths.length - 1) * gap;
            const hasMore = total > available;
            let count = widths.length;
            if (hasMore) {
                const budget = available - expandButton.getBoundingClientRect().width - gap;
                let used = 0;
                count = 0;
                for (const width of widths) {
                    if (used + width > budget) break;
                    used += width + gap;
                    count++;
                }
            }
            items.forEach((item, index) => {
                item.style.display = !expandedNotes && index >= count ? "none" : "flex";
            });
            expandButton.style.display = hasMore ? "flex" : "none";
            setVisibleNoteCount(count);
            setHasMoreNotes(hasMore);
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(tabs);
        return () => observer.disconnect();
    }, [notes, expandedNotes, activeNoteId]);

    useEffect(() => {
        setActiveNoteId(id => notes.some(note => note.id === id) ? id : notes[0]?.id);
    }, [notes]);

    const addNote = (template?: NoteTemplate) => {
        const note = {
            id: generateId(),
            title: template?.name ?? "Nota",
            content: template?.content ?? "",
            createdAt: DateTime.now().toFormat("dd/MM/yyyy HH:mm"),
        };

        onNoteAdd?.(note);
        setActiveNoteId(note.id);
        setExpandedNotes(true);
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
            <ContainerOverlay show={!readOnly && showSettings}>
                {showSettings && <NotesSettings onClose={() => setShowSettings(false)} />}
            </ContainerOverlay>

            <ContainerTopbar
                className="group"
                title="Notas"
                right={!floating && (
                    <Clickable
                        type="button"
                        aria-label="Abrir notas en ventana flotante"
                        className="mr-2 flex shrink-0 items-center justify-center p-0 text-neutral-200 hover:bg-gray-700"
                        onClick={openFloatingWindow}
                    >
                        <FloatingWindowIcon className="size-5 p-0.5" />
                    </Clickable>
                )}
                icon={readOnly ? undefined : <SettingsIcon />}
                onIconClick={readOnly ? undefined : () => setShowSettings(true)}
            />

            {floatingError && <p role="alert" className="text-xs text-amber-300">{floatingError}</p>}
            {floatingWindow && createPortal(
                <NoteAndChecklistPlinth {...props} floating className="w-full" />,
                floatingWindow.document.body,
            )}

            <div className="flex flex-col gap-1">
                <div className="flex min-w-0 flex-wrap items-start gap-1">
                    <div ref={noteTabsRef} className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
                        {notes.map((note, index) => (
                            <div
                                key={note.id}
                                data-note-tab
                                style={{ display: !expandedNotes && index >= visibleNoteCount ? "none" : "flex" }}
                                draggable={!!onNoteReorder}
                                className={cn(
                                    "group flex shrink-0 items-center border-b-2 text-sm transition-colors",
                                    note.id !== activeNoteId && "cursor-pointer",
                                    note.id === activeNoteId
                                        ? "border-blue-400 text-blue-300"
                                        : "border-gray-700 text-gray-500 hover:text-gray-300",
                                )}
                                onClick={event => {
                                    if (!(event.target as HTMLElement).closest("button")) setActiveNoteId(note.id);
                                }}
                                onDragStart={() => setDraggedNoteId(note.id)}
                                onDragOver={event => event.preventDefault()}
                                onDrop={() => draggedNoteId && onNoteReorder?.(draggedNoteId, note.id)}
                                onDragEnd={() => setDraggedNoteId(undefined)}
                            >
                                {note.id === activeNoteId ? (
                                    <input
                                        aria-label={`Título de la nota ${index + 1}`}
                                        className="min-w-0 max-w-48 bg-transparent px-2 py-1 outline-none"
                                        style={{ width: `${Math.max(4, note.title.length + 2)}ch` }}
                                        value={note.title}
                                        readOnly={!onNoteChange}
                                        onClick={event => event.stopPropagation()}
                                        onChange={event => onNoteChange?.({ ...note, title: event.target.value })}
                                    />
                                ) : (
                                    <span className="max-w-48 truncate px-2 py-1">{note.title}</span>
                                )}
                                {onNoteDelete && (
                                    <Clickable
                                        type="button"
                                        aria-label={`Borrar nota ${note.title}`}
                                        className="invisible mr-1 text-gray-400 hover:bg-gray-700 hover:text-red-300 group-hover:visible focus-visible:visible"
                                        onClick={() => deleteNote(note.id)}
                                        onPointerDown={event => event.stopPropagation()}
                                    >
                                        <CrossIcon className="size-5" />
                                    </Clickable>
                                )}
                            </div>
                        ))}
                        <div ref={expandButtonRef} style={{ display: hasMoreNotes ? "flex" : "none" }}>
                            <Button
                                textOnly
                                className="shrink-0 text-sm"
                                onClick={() => setExpandedNotes(expanded => !expanded)}
                            >
                                {expandedNotes ? "Ver menos" : "Ver más"}
                            </Button>
                        </div>
                    </div>
                    {onNoteAdd && (
                        <AddNoteMenu
                            templates={settings.templates}
                            onAdd={addNote}
                            onViewTemplates={() => setShowSettings(true)}
                        />
                    )}
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
                    onCheckItemCreateActivity={onCheckItemCreateActivity}
                />}
            </div>
        </Container>
    );
}
