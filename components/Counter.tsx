import React from 'react';

import { IllegalStateError } from '../src/ts/errors';

const COUNTS = new Map<string, number>();

function getElement(id: string): HTMLElement {
    return document.getElementById(`counter-${id}`)!;
}

export function addCount(id: string, n: number): void {
    if (!COUNTS.has(id)) {
        throw new IllegalStateError(`unknown counter: ${id}`);
    }

    const count = COUNTS.get(id)!;
    getElement(id).innerHTML = `${count + n}`;
    COUNTS.set(id, count + n);
}

export function setCount(id: string, n: number): void {
    if (!COUNTS.has(id)) {
        throw new IllegalStateError(`unknown counter: ${id}`);
    }

    getElement(id).innerHTML = `${n}`;
    COUNTS.set(id, n);
}

export function resetCount(id: string): void {
    if (!COUNTS.has(id)) {
        throw new IllegalStateError(`unknown counter: ${id}`);
    }

    getElement(id).innerHTML = "0";
    COUNTS.set(id, 0);
}

type Props = {
    id: string;
}

const Counter = (props: Props) => {
    COUNTS.set(props.id, 0);

    return (
        <span className="counter" id={`counter-${props.id}`}>0</span>
    );
};

export default Counter;
