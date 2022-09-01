import React from 'react';

function setDifficulty(w: Window, difficulty: string): void {
    const url = new URL(w.location.href);

    if (difficulty == "easy") {
        w.location.href = `${url.origin}${url.pathname}`;
    } else {
        w.location.href = `${url.origin}${url.pathname}?d=${difficulty}`;
    }
}

const DifficultySelect = (w: Window) => {
    return (
        <a href="#" onClick={() => setDifficulty(w, "easy")}>easy</a><br />
        <a href="#" onClick={() => setDifficulty(w, "normal")}>normal</a><br />
        <a href="#" onClick={() => setDifficulty(w, "hard")}>hard</a>
    );
};
