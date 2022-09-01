import React from 'react';

const COUNTS = new Map<string, number>();

function getElement(id: string): HTMLElement {
    return document.getElementById(`counter-${id}`)!;
}

export function addCount(id: string, n: number = 1): void {
    if (COUNTS.has(id)) {
        const count = COUNTS.get(id)!;

        getElement(id).innerHTML = `${count + n}`;

        COUNTS.set(id, count + n);
    }
}

export function setCount(id: string, n: number): void {
    if (COUNTS.has(id)) {
        getElement(id).innerHTML = `${n}`;

        COUNTS.set(id, n);
    }
}

export function resetCount(id: string): void {
    if (COUNTS.has(id)) {
        getElement(id).innerHTML = "0";

        COUNTS.set(id, 0);
    }
}

type Props = {
    id: string;
}

const Counter = (props: Props) => {
    return (
        <span id={`counter-${props.id}`}>0</span>
    );
};

export default Counter;
