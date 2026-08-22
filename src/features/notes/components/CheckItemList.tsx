import { CheckItem as CheckItemType } from "src/features/notes/types/CheckItem";
import CheckItem from "src/features/notes/components/CheckItem";
import { ClipboardEvent, PointerEvent, useRef, useState } from "react";
import { generateId } from "src/shared/utils/generateId";
import { DateTime } from "luxon";

interface Props {
    checklist: CheckItemType[];
    currentTime?: number;
    onChange?: (items: CheckItemType[]) => void;

    onAdd?: (items: CheckItemType[]) => void;
    onDelete?: (id: string) => void;
    onUpdate?: (item: CheckItemType) => void;
    onReorder?: (itemId: string, targetItemId?: string) => void;
}

const defaultGhostItem: CheckItemType = {
    id: 'ghost',
    content: '',
    isDone: false,
    due: undefined,
    createdAt: DateTime.now().toFormat("dd-MM-yyyy HH:mm:ss"),
};

export default function CheckItemList({
    checklist,
    currentTime,
    onChange,
    onAdd,
    onDelete,
    onUpdate,
    onReorder
}: Props) {

    const [ghost, setGhost] = useState<CheckItemType>(defaultGhostItem);
    const draggedItemIdRef = useRef<string | null>(null);
    const lastReorderTargetRef = useRef<string | null>(null);

    const updateItem = (newItem: CheckItemType) => {
        if (onUpdate) onUpdate(newItem);
        if (onChange) onChange(checklist.map(i => i.id === newItem.id ? newItem : i));
    }

    const deleteItem = (id: string) => {
        if (onDelete) onDelete(id);
        if (onChange) onChange(checklist.filter(i => i.id !== id));
    }

    const splitContents = (content: string) => content
        .split(/\r?\n/)
        .flatMap(line => line.split(/\s+[-*]\s+/))
        .map(item => item.replace(/^\s*[-*]\s+/, "").trim())
        .filter(Boolean);

    const addItems = (contents: string[]) => {
        if (contents.length === 0) return;

        const newItems = contents.map(content => ({ ...ghost, id: generateId(), content }));
        if (onAdd) onAdd(newItems);
        if (onChange) onChange([...checklist, ...newItems]);

        // reset
        setGhost(defaultGhostItem);
    }

    const addGhostToList = () => addItems(splitContents(ghost.content));

    const handleGhostPaste = (event: ClipboardEvent<HTMLInputElement>) => {
        const content = event.clipboardData.getData("text");
        if (!/\r?\n|(?:^|\s)[*-]\s+/.test(content)) return;

        event.preventDefault();
        addItems(splitContents(content));
    };

    const stopReordering = () => {
        draggedItemIdRef.current = null;
        lastReorderTargetRef.current = null;
        window.removeEventListener("pointerup", stopReordering);
        window.removeEventListener("pointercancel", stopReordering);
    };

    const moveDraggedItem = (event: PointerEvent<HTMLDivElement>) => {
        const itemId = draggedItemIdRef.current;
        if (!itemId) return;

        const items = Array.from(document.querySelectorAll<HTMLElement>("[data-check-item-id]"));
        const draggedItem = items.find(item => item.dataset.checkItemId === itemId);
        if (!draggedItem) return;

        const draggedRect = draggedItem.getBoundingClientRect();
        if (event.clientY >= draggedRect.top && event.clientY <= draggedRect.bottom) return;

        const targetItem = items.find(item =>
            item.dataset.checkItemId !== itemId &&
            event.clientY < item.getBoundingClientRect().top + item.getBoundingClientRect().height / 2
        );
        const targetItemId = targetItem?.dataset.checkItemId;
        const targetKey = targetItemId ?? "end";

        if (targetKey === lastReorderTargetRef.current) return;

        lastReorderTargetRef.current = targetKey;
        onReorder?.(itemId, targetItemId);
    };

    return (
        <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold text-neutral-200">Checklist</h1>

            <div className="flex flex-col gap-1 overflow-y-auto">
                {
                    checklist.map(item => (
                        <div
                            key={item.id}
                            data-check-item-id={item.id}
                            className={onReorder ? "cursor-grab active:cursor-grabbing" : undefined}
                            onPointerDown={onReorder ? event => {
                                event.currentTarget.setPointerCapture(event.pointerId);
                                draggedItemIdRef.current = item.id;
                                lastReorderTargetRef.current = null;
                                window.addEventListener("pointerup", stopReordering);
                                window.addEventListener("pointercancel", stopReordering);
                            } : undefined}
                            onPointerMove={onReorder ? moveDraggedItem : undefined}
                            onPointerUp={onReorder ? stopReordering : undefined}
                            onPointerCancel={onReorder ? stopReordering : undefined}
                        >
                            <CheckItem
                                item={item}
                                currentTime={currentTime}
                                onChange={updateItem}
                                onDelete={() => deleteItem(item.id)}
                            />
                        </div>
                    ))
                }
                <CheckItem
                    key={ghost.id}
                    item={ghost}
                    onChange={setGhost}
                    onEnterPressed={addGhostToList}
                    onPaste={handleGhostPaste}
                    canDelete={false}
                    canToggle={false}
                    placeholder="Agregar item..."
                />
            </div>
        </div>
    );
}
