import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { produce } from 'immer';

async function load(path, dependencies, globals = {}) {
    const source = await readFile(new URL(`../src/${path}`, import.meta.url), 'utf8');
    const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } });
    const exports = {};
    runInNewContext(outputText, {
        exports, Date, console, ...globals,
        require: name => {
            if (!(name in dependencies)) throw new Error(`Missing test dependency: ${name}`);
            return dependencies[name];
        },
    });
    return exports;
}

async function harness(state) {
    const listeners = new Set();
    const timers = [];
    const messages = [];
    let clock = Date.now();
    let cleanup;
    const store = {
        getState: () => state,
        subscribe: callback => { listeners.add(callback); return () => listeners.delete(callback); },
    };
    const dependencies = {
        react: { useEffect: callback => { cleanup = callback(); } },
        sonner: { toast: Object.fromEntries(['info', 'warning', 'success'].map(kind => [kind, message => messages.push([kind, message])])) },
        'src/app/states/redux/store': { default: store },
        'src/shared/services/notificationAudio': { playNotificationAudio: () => {} },
        'src/assets/audio/399191__spiceprogram__drip-echo.wav': { default: 'sound' },
        'src/assets/audio/pomodoro-end.wav': { default: 'sound' },
        'src/shared/utils/TimeUtils': {
            toDate: timestamp => new Date(timestamp),
            isToday: date => date.toDateString() === new Date().toDateString(),
        },
    };
    dependencies['src/shared/services/timerRegistry'] = await load('shared/services/timerRegistry.ts', {
        'src/app/states/redux/store': dependencies['src/app/states/redux/store'],
    }, {
        Date: class extends Date { static now() { return clock; } },
        setTimeout: (callback, delay) => {
            const timer = { callback, at: clock + delay, canceled: false };
            timers.push(timer);
            return timer;
        },
        clearTimeout: timer => { if (timer) timer.canceled = true; },
    });
    dependencies['src/app/services/observeState'] = await load('app/services/observeState.ts', {
        'src/app/states/redux/store': dependencies['src/app/states/redux/store'],
    });
    dependencies['../utils/checkItemDueStatus'] = await load('features/notes/utils/checkItemDueStatus.ts', {});
    return {
        get state() { return state; }, store, dependencies, timers, messages,
        change: callback => { state = produce(state, callback); for (const listener of [...listeners]) listener(); },
        cleanup: () => cleanup(),
        fire: now => {
            clock = now;
            for (const entry of [...timers]) {
                if (entry.canceled || entry.at > now) continue;
                entry.canceled = true;
                entry.callback();
            }
        },
    };
}

test('checklist cancels obsolete alerts, reads latest content, and ignores yesterday', async t => {
    const now = new Date(2026, 9, 30, 12).getTime();
    t.mock.timers.enable({ apis: ['Date'], now });
    const h = await harness({
        todaySession: { session: { id: 'day', createdTimestamp: now, checklist: [
            { id: 'task', due: '12:10', content: 'original', isDone: false },
        ] } },
        notesSettings: { alertBeforeDueMs: 5 * 60000 }, appSettings: { soundsEnabled: false },
    });
    const { default: Consumer } = await load('features/notes/components/ChecklistTimerConsumer.tsx', h.dependencies);
    Consumer();
    h.change(state => { state.todaySession.session.checklist[0].content = 'updated'; });
    t.mock.timers.setTime(now + 6 * 60000);
    h.fire(Date.now());
    assert.equal(h.messages.length, 1);
    assert.match(h.messages[0][1], /updated/);
    h.change(state => { state.todaySession.session.checklist[0].isDone = true; });
    t.mock.timers.setTime(now + 11 * 60000);
    h.fire(Date.now());
    assert.equal(h.messages.length, 1);
    h.change(state => { state.todaySession.session.checklist[0].isDone = false; });
    t.mock.timers.setTime(now + 24 * 60 * 60000);
    h.fire(Date.now());
    assert.equal(h.messages.length, 1);
    h.cleanup();
    assert.ok(h.timers.every(timer => timer.canceled));
});

test('checklist recovery emits only the expired alert, never the obsolete upcoming alert', async t => {
    const now = new Date(2026, 9, 30, 12).getTime();
    t.mock.timers.enable({ apis: ['Date'], now });
    const h = await harness({
        todaySession: { session: { id: 'day', createdTimestamp: now, checklist: [
            { id: 'task', due: '12:10', content: 'task', isDone: false },
        ] } },
        notesSettings: { alertBeforeDueMs: 5 * 60000 }, appSettings: { soundsEnabled: false },
    });
    const { default: Consumer } = await load('features/notes/components/ChecklistTimerConsumer.tsx', h.dependencies);
    Consumer();
    t.mock.timers.setTime(now + 60 * 60000);
    h.fire(Date.now());
    assert.equal(h.messages.length, 1);
    assert.equal(h.messages[0][0], 'warning');
    h.change(() => {}); // A rerender / unrelated action cannot duplicate delivery.
    h.fire(Date.now());
    assert.equal(h.messages.length, 1);
    h.cleanup();
});

test('Pomodoro recovery alerts once and advances at most one phase', async t => {
    const now = new Date(2026, 9, 30, 12).getTime();
    t.mock.timers.enable({ apis: ['Date'], now });
    const h = await harness({
        pomodoro: { state: 1, startTime: now - 60 * 60000, remainingMs: 1000, endAlertStatus: 'waiting' },
        pomodoroSettings: { focusDurationMs: 25 * 60000, restDurationMs: 5 * 60000, continueOnEnd: true, alertOnRemainingMs: 60000 },
        appSettings: { soundsEnabled: false },
    });
    const actions = Object.fromEntries(['save', 'update', 'setEndAlertStatus'].map(type => [type, payload => ({ type, payload })]));
    h.dependencies['../states/pomodoroSlice'] = actions;
    h.dependencies['../types/Pomodoro'] = { PomodoroState: { FOCUS: 1 } };
    h.dependencies['../utils/getStateLabel'] = { getStateLabel: () => 'Pomodoro' };
    h.dependencies.luxon = { DateTime: { fromMillis: () => ({ toFormat: () => '05:00' }) } };
    let transitions = 0;
    h.store.dispatch = action => h.change(state => {
        if (action.type === 'setEndAlertStatus') state.pomodoro = { ...state.pomodoro, endAlertStatus: action.payload };
        if (action.type === 'update') {
            const remainingMs = (state.pomodoro.state === 1 ? state.pomodoroSettings.focusDurationMs : state.pomodoroSettings.restDurationMs) - (Date.now() - state.pomodoro.startTime);
            if (remainingMs <= 0) {
                transitions++;
                state.pomodoro = { state: 2, startTime: Date.now(), remainingMs: state.pomodoroSettings.restDurationMs, endAlertStatus: 'waiting' };
            } else state.pomodoro = { ...state.pomodoro, remainingMs };
        }
    });
    const { default: Consumer } = await load('features/pomodoro/components/PomodoroTimerConsumer.tsx', h.dependencies, { document: { title: 'Cronomate' } });
    Consumer();
    h.fire(Date.now() + 500);
    assert.equal(transitions, 1);
    assert.equal(h.messages.length, 1);
    assert.equal(h.messages[0][0], 'success');
    assert.equal(h.state.pomodoro.startTime, now);
    h.cleanup();
});

test('jornada persists without a view, stops once on expiry, and archives once on day change', async t => {
    const now = new Date(2026, 9, 30, 12).getTime();
    t.mock.timers.enable({ apis: ['Date'], now });
    const h = await harness({
        todaySession: { session: {
            id: 'day', createdTimestamp: now, activities: [{ running: true }], duration: 0,
            durationLimit: { millis: 600000 },
        }, endAlertStatus: 'waiting' },
        todaySessionSettings: { stopOnSessionEnd: true }, appSettings: { soundsEnabled: false },
    });
    const actions = Object.fromEntries(['save', 'setSession', 'resetToDefaultState', 'setEndAlertStatus'].map(type => [type, payload => ({ type, payload })]));
    h.dependencies['../states/todaySessionSlice'] = actions;
    h.dependencies['src/features/session/services/sessionService'] = { default: {
        updateTimerAndTracks: session => ({ ...session, duration: Date.now() - session.createdTimestamp }),
        getSessionDurationMs: session => session.duration,
        stopActivities: session => ({ ...session, activities: session.activities.map(() => ({ running: false })) }),
    } };
    h.dependencies['src/features/activity/services/activityService'] = { default: { hasRunningTracks: activity => activity.running } };
    let archives = 0;
    let saves = 0;
    h.dependencies['src/shared/services/sessionStorageService'] = { default: { saveItems: () => archives++ } };
    h.store.dispatch = action => h.change(state => {
        if (action.type === 'save') saves++;
        if (action.type === 'setSession') state.todaySession = { ...state.todaySession, session: action.payload };
        if (action.type === 'setEndAlertStatus') state.todaySession = { ...state.todaySession, endAlertStatus: action.payload };
        if (action.type === 'resetToDefaultState') state.todaySession = {
            session: { id: 'new', createdTimestamp: Date.now(), activities: [], duration: 0, durationLimit: {} }, endAlertStatus: 'waiting',
        };
    });
    const { default: Consumer } = await load('features/today-session/components/TodaySessionTimerConsumer.tsx', h.dependencies, {
        window: { addEventListener: () => {}, removeEventListener: () => {} },
    });
    Consumer();
    t.mock.timers.setTime(now + 60 * 60000);
    h.fire(Date.now());
    assert.equal(h.state.todaySession.endAlertStatus, 'ended');
    assert.equal(h.state.todaySession.session.activities[0].running, false);
    assert.equal(h.messages.length, 1);
    h.fire(Date.now());
    assert.equal(h.messages.length, 1);
    assert.ok(saves > 0);
    t.mock.timers.setTime(now + 24 * 60 * 60000);
    h.fire(Date.now());
    h.fire(Date.now());
    assert.equal(archives, 1);
    assert.equal(h.state.todaySession.session.id, 'new');
    assert.equal(h.messages.length, 1);
    h.cleanup();
});

test('public API supplies current state without observing state changes as ticks', async () => {
    const h = await harness({ counter: 0, unrelated: 0 });
    const { subscribeToTimers } = h.dependencies['src/shared/services/timerRegistry'];
    const calls = [];
    const timer = subscribeToTimers({
        everyMs: 1000,
        onTick: ({ state }) => calls.push(state.counter),
    });
    h.change(state => { state.unrelated++; });
    h.change(state => { state.counter = 1; });
    assert.deepEqual(calls, []);
    h.fire(Date.now() + 1000);
    assert.deepEqual(calls, [1]);
    timer.cancel();
    h.change(state => { state.counter = 3; });
    h.fire(Date.now());
    assert.deepEqual(calls, [1]);
});

test('one-shot API supports schedule updates, current callbacks and late delivery exactly once', async t => {
    t.mock.timers.enable({ apis: ['Date'], now: 1000 });
    const h = await harness({ label: 'old' });
    const { subscribeToTimers } = h.dependencies['src/shared/services/timerRegistry'];
    const calls = [];
    const timer = subscribeToTimers({
        scheduleAt: 2000,
        onTick: () => assert.fail('Replaced callback ran'),
    });
    timer.update({ scheduleAt: 3000, onTick: event => calls.push(event) });
    h.change(state => { state.label = 'new'; });
    t.mock.timers.setTime(2000);
    h.fire(Date.now());
    assert.deepEqual(calls, []);
    t.mock.timers.setTime(5000);
    h.fire(Date.now());
    h.fire(Date.now());
    assert.equal(calls.length, 1);
    assert.equal(calls[0].state.label, 'new');
    assert.equal(calls[0].delayed, true);
    assert.equal(calls[0].delayMs, 2000);
    timer.cancel();
});

test('public API rejects missing or simultaneous schedules', async () => {
    const h = await harness({});
    const { subscribeToTimers } = h.dependencies['src/shared/services/timerRegistry'];
    assert.throws(() => subscribeToTimers({ onTick: () => {} }));
    assert.throws(() => subscribeToTimers({ everyMs: 500, scheduleAt: 1000, onTick: () => {} }));
    const timer = subscribeToTimers({ everyMs: 500, onTick: () => {} });
    assert.throws(() => timer.update({ everyMs: 500, scheduleAt: 1000 }));
    timer.cancel();
});

test('persistence observes state changes independently of timers without recursive effects', async () => {
    const h = await harness({ counter: 0 });
    const { observeState } = h.dependencies['src/app/services/observeState'];
    let saves = 0;
    const stop = observeState(state => state.counter, () => {
        saves++;
        h.change(() => {});
    });
    h.change(state => { state.counter = 1; });
    assert.equal(saves, 1);
    stop();
    h.change(state => { state.counter = 2; });
    assert.equal(saves, 1);
});
