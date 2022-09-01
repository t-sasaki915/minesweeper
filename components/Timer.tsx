import React from 'react';

const TIMES = new Map<string, number>();
const TIMER_IDS = new Map<string, number>();

function getElement(id: string): HTMLElement {
    return document.getElementById(`timer-${id}`)!;
}

export function startTimer(id: string): void {
    if (TIMER_IDS.has(id)) {
        const timerId = window.setInterval(() => {
            const time = TIMES.get(id)!;

            getElement(id).innerHTML = `${time + 1}`;
    
            TIMES.set(id, time + 1);
        }, 1000);
    
        TIMER_IDS.set(id, timerId);
    }
}

export function stopTimer(id: string): void {
    if (TIMER_IDS.has(id)) {
        const timerId = TIMER_IDS.get(id);
        if (timerId != -1) {
            window.clearInterval(timerId);
        }
    }
}

export function resetTimer(id: string): void {
    if (TIMER_IDS.has(id)) {
        stopTimer(id);

        getElement(id).innerHTML = "0";

        TIMES.set(id, 0);
        TIMER_IDS.set(id, -1);
    }
}

type Props = {
    id: string;
}

const Timer = (props: Props) => {
    TIMES.set(props.id, 0);
    TIMER_IDS.set(props.id, -1);

    return (
        <span id={`timer-${props.id}`}>0</span>
    );
};

export default Timer;
