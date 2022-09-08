import React from 'react';

import { IllegalStateError } from '../src/ts/errors';

const TIMES = new Map<string, number>();
const TIMER_INTERVAL_IDS = new Map<string, number>();

function getElement(id: string): HTMLElement {
    return document.getElementById(`timer-${id}`)!;
}

export function startTimer(id: string): void {
    if (!TIMES.has(id) || !TIMER_INTERVAL_IDS.has(id)) {
        throw new IllegalStateError(`unknown timer: ${id}`);
    }
    if (TIMER_INTERVAL_IDS.get(id)! != -1) {
        throw new IllegalStateError(`timer ${id} has already started.`);
    }

    TIMER_INTERVAL_IDS.set(
        id,
        window.setInterval(() => {
            const time = TIMES.get(id)!;
            getElement(id).innerHTML = `${time + 1}`;
            TIMES.set(id, time + 1);
        })
    );
}

export function stopTimer(id: string): void {
    if (!TIMES.has(id) || !TIMER_INTERVAL_IDS.has(id)) {
        throw new IllegalStateError(`unknown timer: ${id}`);
    }
    if (TIMER_INTERVAL_IDS.get(id)! == -1) {
        throw new IllegalStateError(`timer ${id} has already stopped.`);
    }

    const timerId = TIMER_INTERVAL_IDS.get(id)!;
    window.clearInterval(timerId);
    TIMER_INTERVAL_IDS.set(id, -1);
}

export function resetTimer(id: string): void {
    if (!TIMES.has(id) || !TIMER_INTERVAL_IDS.has(id)) {
        throw new IllegalStateError(`unknown timer: ${id}`);
    }

    const timerId = TIMER_INTERVAL_IDS.get(id)!;
    if (timerId != -1) {
        window.clearInterval(timerId);
    }

    getElement(id).innerHTML = "0";

    TIMES.set(id, 0);
    TIMER_INTERVAL_IDS.set(id, -1);
}

type Props = {
    id: string;
}

const Timer = (props: Props) => {
    TIMES.set(props.id, 0);
    TIMER_INTERVAL_IDS.set(props.id, -1);

    return (
        <span className="timer" id={`timer-${props.id}`}>0</span>
    );
};

export default Timer;
