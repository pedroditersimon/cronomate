import { CheckItem } from "src/features/notes/types/CheckItem";

export const CHECK_ITEM_ALERT_WINDOW_MS = 10 * 60 * 1000;

export type CheckItemDueStatus = "upcoming" | "overdue" | undefined;

export function getCheckItemDueStatus(item: CheckItem, now: number): CheckItemDueStatus {
    if (!item.due || item.isDone) return undefined;

    const [hours, minutes] = item.due.split(":").map(Number);
    if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return undefined;

    const dueDate = new Date(now);
    dueDate.setHours(hours, minutes, 0, 0);
    const remainingMs = dueDate.getTime() - now;

    if (remainingMs <= 0) return "overdue";
    if (remainingMs <= CHECK_ITEM_ALERT_WINDOW_MS) return "upcoming";
    return undefined;
}
