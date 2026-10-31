import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { runInThisContext } from 'node:vm';

const source = await readFile(new URL('../src/shared/services/timerRegistry.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } });
const exports = {};
runInThisContext(`(function(exports, require) { ${outputText}\n})`)(exports, name => {
    assert.equal(name, 'src/app/states/redux/store');
    return { default: { getState: () => undefined } };
});
const { TimerRegistry } = exports;

test('timer registry contracts', async t => {
    t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: 1000 });

    await t.test('periodic callbacks use current state and can cancel themselves', () => {
        let state = 'old';
        const registry = new TimerRegistry(() => state);
        const calls = [];
        const subscription = registry.subscribe({ everyMs: 100, onTick: () => assert.fail('Old callback ran') });
        subscription.update({
            onTick: event => {
                calls.push(event);
                subscription.cancel();
            },
        });
        state = 'current';
        t.mock.timers.tick(100);
        t.mock.timers.tick(1000);
        assert.equal(calls.length, 1);
        assert.equal(calls[0].state, 'current');
        assert.equal(calls[0].delayed, false);
    });

    await t.test('suspension runs each overdue subscription once without replaying cycles', () => {
        const registry = new TimerRegistry(() => null);
        const periodic = [];
        const punctual = [];
        const start = Date.now();
        const timer = registry.subscribe({ everyMs: 100, onTick: event => periodic.push(event) });
        registry.subscribe({ scheduleAt: start + 50, onTick: event => punctual.push(event) });
        t.mock.timers.setTime(start + 10000);
        t.mock.timers.tick(0);
        assert.equal(periodic.length, 1);
        assert.equal(punctual.length, 1);
        assert.equal(periodic[0].delayed, true);
        assert.equal(periodic[0].delayMs, 9900);
        t.mock.timers.tick(100);
        assert.equal(periodic.length, 2);
        assert.equal(punctual.length, 1);
        timer.cancel();
    });

    await t.test('updates reschedule and cancellation invalidates pending work', () => {
        const registry = new TimerRegistry(() => null);
        const calls = [];
        const timer = registry.subscribe({ scheduleAt: Date.now() + 10, onTick: () => calls.push('old') });
        timer.update({ scheduleAt: Date.now() + 50, onTick: () => calls.push('new') });
        t.mock.timers.tick(10);
        assert.deepEqual(calls, []);
        t.mock.timers.tick(40);
        assert.deepEqual(calls, ['new']);
        const canceled = registry.subscribe({ everyMs: 10, onTick: () => assert.fail('Canceled timer ran') });
        canceled.cancel();
        t.mock.timers.tick(100);
    });

    await t.test('a callback can cancel or postpone another overdue subscription', () => {
        const registry = new TimerRegistry(() => null);
        const now = Date.now();
        registry.subscribe({ scheduleAt: now + 10, onTick: () => {
            canceled.cancel();
            postponed.update({ scheduleAt: Date.now() + 100 });
        } });
        const canceled = registry.subscribe({ scheduleAt: now + 10, onTick: () => assert.fail('Obsolete callback ran') });
        let calls = 0;
        const postponed = registry.subscribe({ scheduleAt: now + 10, onTick: () => calls++ });
        t.mock.timers.tick(10);
        assert.equal(calls, 0);
        t.mock.timers.tick(100);
        assert.equal(calls, 1);
    });

    await t.test('invalid schedules are rejected', () => {
        const registry = new TimerRegistry(() => null);
        assert.throws(() => registry.subscribe({ everyMs: 0, onTick: () => {} }));
        assert.throws(() => registry.subscribe({ scheduleAt: NaN, onTick: () => {} }));
    });

    await t.test('schedule modes can be switched, and completed one-shots cannot be rearmed', () => {
        const registry = new TimerRegistry(() => null);
        let calls = 0;
        const timer = registry.subscribe({ everyMs: 10, onTick: () => calls++ });
        timer.update({ scheduleAt: Date.now() + 50 });
        t.mock.timers.tick(10);
        assert.equal(calls, 0);
        timer.update({ everyMs: 20 });
        t.mock.timers.tick(20);
        assert.equal(calls, 1);
        timer.update({ scheduleAt: Date.now() + 10 });
        t.mock.timers.tick(10);
        assert.equal(calls, 2);
        timer.update({ everyMs: 10 });
        t.mock.timers.tick(100);
        assert.equal(calls, 2);
    });

    await t.test('invalid updates are atomic and callback-only updates keep the deadline', () => {
        const registry = new TimerRegistry(() => null);
        const calls = [];
        const timer = registry.subscribe({ everyMs: 100, onTick: () => calls.push('old') });
        t.mock.timers.tick(50);
        assert.throws(() => timer.update({ everyMs: 0, onTick: () => calls.push('invalid') }));
        timer.update({ onTick: () => calls.push('new') });
        t.mock.timers.tick(50);
        assert.deepEqual(calls, ['new']);
        timer.cancel();
    });
});
