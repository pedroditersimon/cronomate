import store, { RootState } from 'src/app/states/redux/store';

/** State effects (such as persistence) are independent from timer scheduling. */
export function observeState<Value>(select: (state: RootState) => Value, effect: (value: Value) => void) {
    let previous = select(store.getState());
    let notifying = false;
    return store.subscribe(() => {
        const current = select(store.getState());
        if (notifying || Object.is(current, previous)) return;
        previous = current;
        notifying = true;
        try { effect(current); }
        finally {
            previous = select(store.getState());
            notifying = false;
        }
    });
}
