import React from 'react';

import { DIFFICULTIES } from "../src/ts/difficulty";

function setDifficulty(difficulty: string): void {
    const url = new URL(window.location.href);

    let newUrl = `${url.origin}${url.pathname}`;
    if (difficulty != "easy") {
        newUrl += `?d=${difficulty}`;
    }

    window.location.href = newUrl;
}

const DifficultySelect = () => {
    return (
        <div className="difficultySelect">
            {
                DIFFICULTIES.map(d =>
                    <a href="#" onClick={() => setDifficulty(d.id())}>{d.id()}<br /></a>
                )
            }
        </div>
    );
};

export default DifficultySelect;
