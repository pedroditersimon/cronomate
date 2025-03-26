

export function isActionAllowed(actions: string | string[], action: string): boolean {
    if (actions === "all") return true;
    if (actions === "none") return false;
    if (Array.isArray(actions)) return actions.includes(action);
    return false;
}