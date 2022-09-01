import React from 'react';

const TIMES = new Map<string, number>();
const TIMER_IDS = new Map<string, number>();

export function startTimer(id: string): void {
    if (TIMER_IDS.has(id)) {
        const timerId = window.setInterval(() => {
            const time = TIMES.get(id);
    
            const elem = document.getElementById(`timer-${id}`)!;
            elem.innerHTML = `${time + 1}`;
    
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

        TIMES.set(id, 0);
        TIMER_IDS.set(id, -1);
    }
}

const Timer = (id: string) => {
    TIMES.set(id, 0);
    TIMER_IDS.set(id, -1);

    return (
        <span id={`timer-${id}`}>0</span>
    );
};

export default Timer;
