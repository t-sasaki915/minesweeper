import React from 'react';

import { DIFFICULTIES } from "../src/ts/difficulty";

function setDifficulty(difficulty: string): void {
    const url = new URL(window.location.href);

    if (difficulty == "easy") {
        window.location.href = `${url.origin}${url.pathname}`;
    } else {
        window.location.href = `${url.origin}${url.pathname}?d=${difficulty}`;
    }
}

const DifficultySelect = () => {
    return (
        <div>
            {
                DIFFICULTIES.map(d =>
                    <a href="#" onClick={() => setDifficulty(d.id())}>{d.id()}<br /></a>
                )
            }
        </div>
    );
};

export default DifficultySelect;
