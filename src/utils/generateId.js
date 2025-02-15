export function generateId() {
    return crypto.randomUUID();
    // example: id_1736091141945_5278.300
    return `id_${new Date().getTime()}_${performance.now().toFixed(3)}`;
}
