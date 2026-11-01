import store from 'src/app/states/redux/store';

export interface TimerEvent<State> {
    state: State;
    scheduledAt: number;
    now: number;
    delayed: boolean;
    delayMs: number;
}

export type TimerOptions<State> = (
    | { everyMs: number; scheduleAt?: never }
    | { scheduleAt: number; everyMs?: never }
) & {
    onTick: (event: TimerEvent<State>) => void;
};

/** A tab-local scheduler. Domain rules belong to subscribers, never here. */
export class TimerRegistry<State> {
    private entries = new Set<{ due: number; run: (now: number) => void }>();
    private timeout?: ReturnType<typeof setTimeout>;
    private listening = false;
    private flushing = false;

    constructor(private readonly getState: () => State) {}

    subscribe = (options: TimerOptions<State>) => {
        function validate(value: Partial<TimerOptions<State>>): asserts value is TimerOptions<State> {
            if (('everyMs' in value) === ('scheduleAt' in value)) {
                throw new Error('Specify either everyMs or scheduleAt');
            }
            if (!Number.isFinite(value.everyMs ?? value.scheduleAt) || (value.everyMs !== undefined && value.everyMs <= 0)) {
                throw new Error('Invalid timer schedule');
            }
            if (typeof value.onTick !== 'function') throw new Error('Specify onTick');
        }
        validate(options);
        let current = { ...options };
        const next = (now = Date.now()) => current.everyMs !== undefined ? now + current.everyMs : current.scheduleAt;
        const entry = {
            due: next(),
            run: (now: number) => {
                const scheduledAt = entry.due;
                if (current.everyMs !== undefined) entry.due = next(now);
                else this.entries.delete(entry);
                const delayMs = Math.max(0, now - scheduledAt);
                current.onTick({ state: this.getState(), scheduledAt, now, delayMs, delayed: delayMs > 0 });
            },
        };
        this.entries.add(entry);
        this.arm();
        return {
            // Completed or canceled subscriptions cannot be rearmed.
            update: (replacement: Partial<TimerOptions<State>>) => {
                if (!this.entries.has(entry)) return;
                const timing = 'everyMs' in replacement || 'scheduleAt' in replacement;
                const updated = {
                    ...(timing ? replacement : current),
                    onTick: replacement.onTick ?? current.onTick,
                };
                validate(updated);
                current = updated;
                if (timing) entry.due = next();
                this.arm();
            },
            cancel: () => { this.entries.delete(entry); this.arm(); },
        };
    };

    private wake = () => {
        if (this.flushing) return;
        this.flushing = true;
        try {
            // Snapshot only: subscriptions created by callbacks wait for the next turn.
            for (const entry of [...this.entries]) {
                if (!this.entries.has(entry) || entry.due > Date.now()) continue;
                try { entry.run(Date.now()); }
                catch (error) { console.error('Timer subscriber failed', error); }
            }
        } finally {
            this.flushing = false;
            this.arm();
        }
    };

    private arm() {
        if (this.flushing) return;
        clearTimeout(this.timeout);
        const active = this.entries.size > 0;
        if (typeof window !== 'undefined' && active !== this.listening) {
            const method = active ? 'addEventListener' : 'removeEventListener';
            window[method]('pageshow', this.wake);
            window[method]('focus', this.wake);
            document[method]('visibilitychange', this.wake);
            this.listening = active;
        }
        if (active) {
            const due = Math.min(...[...this.entries].map(entry => entry.due));
            this.timeout = setTimeout(this.wake, Math.min(2147483647, Math.max(0, due - Date.now())));
        }
    }
}

const registry = new TimerRegistry(store.getState);

/** Shared timer API with current application state supplied at execution time. */
export const subscribeToTimers = registry.subscribe;
