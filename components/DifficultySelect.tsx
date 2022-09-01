import React from 'react';

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
            <a href="#" onClick={() => setDifficulty("easy")}>easy</a><br />
            <a href="#" onClick={() => setDifficulty("normal")}>normal</a><br />
            <a href="#" onClick={() => setDifficulty("hard")}>hard</a>
        </div>
    );
};

export default DifficultySelect;
