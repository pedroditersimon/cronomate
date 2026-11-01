export interface ConfirmationOptions {
    title: string;
    description: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

export default class ConfirmationService {
    private static current: ConfirmationOptions | null = null;
    private static listeners = new Set<() => void>();

    static confirm(options: ConfirmationOptions) {
        if (this.current) return;
        this.current = options;
        this.notify();
    }

    static getCurrent = () => ConfirmationService.current;

    static subscribe = (listener: () => void) => {
        ConfirmationService.listeners.add(listener);
        return () => { ConfirmationService.listeners.delete(listener); };
    };

    static resolve(confirmed: boolean) {
        const request = this.current;
        if (!request) return;

        this.current = null;
        this.notify();
        if (confirmed) request.onConfirm();
        else request.onCancel?.();
    }

    private static notify() {
        this.listeners.forEach(listener => listener());
    }
}
