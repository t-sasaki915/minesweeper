import React, { useEffect } from "react";
import Head from "next/head";

import AboutPage from "../components/AboutPage";
import Counter, { addCount, setCount, resetCount } from "../components/Counter";
import DifficultySelect from "../components/DifficultySelect";
import Game from "../components/Game";
import Timer, { startTimer, stopTimer, resetTimer } from "../components/Timer";

import Coordinate from "../src/ts/coordinate";
import Minesweeper from "../src/ts/minesweeper";
import { cellElemAt, cellElemAt_ } from "../src/ts/util";

let difficulty = "easy";

const WIDTH = () => {
    if (difficulty == "easy") {
        return 9;
    } else if (difficulty == "normal") {
        return 16;
    } else if (difficulty == "hard") {
        return 30;
    } else {
        return 9;
    }
}
const HEIGHT = () => {
    if (difficulty == "easy") {
        return 9;
    } else if (difficulty == "normal") {
        return 16;
    } else if (difficulty == "hard") {
        return 16;
    } else {
        return 9;
    }
}
const NUM_OF_MINES = () => {
    if (difficulty == "easy") {
        return 10;
    } else if (difficulty == "normal") {
        return 40;
    } else if (difficulty == "hard") {
        return 99;
    } else {
        return 10;
    }
}

const TIMER_ID = "main";
const MINE_COUNTER_ID = "mineRemain";

let game: typeof Minesweeper | null;

let mines: Array<Coordinate> = [];
let neutrals: Array<Coordinate> = [];

let opened: Array<Coordinate> = [];
let flagged: Array<Coordinate> = [];

let flagMode = false;
let end = false;

function isMine(x: number, y: number): boolean {
    return mines.some(c => c.equals(x, y));
}

function isMine_(coord: Coordinate): boolean {
    return isMine(coord.x(), coord.y());
}

function isNeutral(x: number, y: number): boolean {
    return neutrals.some(c => c.equals(x, y));
}

function isNeutral_(coord: Coordinate): boolean {
    return isNeutral(coord.x(), coord.y());
}

function isOpened(x: number, y: number): boolean {
    return opened.some(c => c.equals(x, y));
}

function isOpened_(coord: Coordinate): boolean {
    return isOpened(coord.x(), coord.y());
}

function isFlagged(x: number, y: number): boolean {
    return flagged.some(c => c.equals(x, y));
}

function isFlagged_(coord: Coordinate): boolean {
    return isFlagged(coord.x(), coord.y());
}

function cellClicked(x: number, y: number): void {
    if (game != null) {
        if (!end) {
            if (flagMode) {
                setFlag(x, y);
            } else {
                if (!isOpened(x, y) && !isFlagged(x, y)) {
                    if (isMine(x, y)) {
                        endGame(x, y);
                    } else {
                        openCellTailrec(x, y);
                    }
                }
            }
        }
    } else {
        startGame(x, y);
    }
}

function cellRightClicked(x: number, y: number): void {
    if (game != null && !end) {
        if (!flagMode) {
            setFlag(x, y);
        }
    }
}

function openCell(x: number, y: number): void {
    if (isMine(x, y) || isOpened(x, y) || isFlagged(x, y)) {
        return;
    }

    const elem = cellElemAt(x, y);
    const num = game!.calcNumber(x, y);

    elem.className = `cell cell-num-${num}`;
    elem.innerHTML = `${num}`;

    opened.push(new Coordinate(x, y));

    if (opened.length == neutrals.length) {
        clearGame();
    }
}

function openCellTailrec(x: number, y: number): void {
    if (isMine(x, y)) {
        return;
    }

    openCell(x, y);

    if (game!.calcNumber(x, y) == 0) {
        const nearCells = [];
        for (let i = -1; i < 2; i ++) {
            for (let j = -1; j < 2; j ++) {
                const nx = x + i;
                const ny = y + j;

                if (nx == x && ny == y) {
                    continue;
                }
                if (nx < 0 || nx >= WIDTH() || ny < 0 || ny >= HEIGHT()) {
                    continue;
                }

                if (!isOpened(nx, ny) && !isMine(nx, ny) && !isFlagged(nx, ny)) {
                    nearCells.push(new Coordinate(nx, ny));
                }
            }
        }

        nearCells.forEach(c => openCellTailrec(c.x(), c.y()));
    }
}

function toggleFlagButtonClicked(): void {
    if (game != null && !end) {
        const elem = document.getElementById("toggleFlag")!;

        if (flagMode) {
            for (let x = 0; x < WIDTH(); x ++) {
                for (let y = 0; y < HEIGHT(); y ++) {
                    if (cellElemAt(x, y).className.indexOf("cell-flag-placeholder") != -1) {
                        cellElemAt(x, y).className = "cell cell-not-opened";
                    }
                }
            }

            elem.innerHTML = "switch to flag mode";
            flagMode = false;
        } else {
            for (let x = 0; x < WIDTH(); x ++) {
                for (let y = 0; y < HEIGHT(); y ++) {
                    if (!isOpened(x, y) && !isFlagged(x, y)) {
                        cellElemAt(x, y).className = "cell cell-flag-placeholder";
                    }
                }
            }

            elem.innerHTML = "switch to normal mode";
            flagMode = true;
        }
    }
}

function setFlag(x: number, y: number): void {
    const elem = cellElemAt(x, y);

    if (!isOpened(x, y)) {
        if (isFlagged(x, y)) {
            addCount(MINE_COUNTER_ID, 1);

            if (flagMode) {
                elem.className = "cell cell-flag-placeholder";
            } else {
                elem.className = "cell cell-not-opened";
            }

            flagged = flagged.filter(e => !e.equals(x, y));
        } else {
            addCount(MINE_COUNTER_ID, -1);

            elem.className = "cell cell-flag";
            
            flagged.push(new Coordinate(x, y));
        }
    }
}

function init(): void {
    mines = [];
    neutrals = [];
    opened = [];
    flagged = [];
    flagMode = false;
    end = false;

    game = null;

    resetTimer(TIMER_ID);

    resetCount(MINE_COUNTER_ID);

    for (let x = 0; x < WIDTH(); x ++) {
        for (let y = 0; y < HEIGHT(); y ++) {
            const elem = cellElemAt(x, y);

            elem.className = "cell cell-not-opened";
            elem.innerHTML = "0";
        }
    }
}

function startGame(startX: number, startY: number): void {
    init();

    const blacklist = [];
    for (let i = -1; i < 2; i ++) {
        for (let j = -1; j < 2; j ++) {
            const nx = startX + i;
            const ny = startY + j;

            if (nx < 0 || nx >= WIDTH() || ny < 0 || ny >= HEIGHT()) {
                continue;
            }

            blacklist.push(new Coordinate(nx, ny));
        }
    }

    game = Minesweeper.generate(WIDTH(), HEIGHT(), NUM_OF_MINES(), blacklist);
    mines = game.mines().map(c => c.coord());
    neutrals = game.neutrals().map(c => c.coord());

    startTimer(TIMER_ID);

    setCount(MINE_COUNTER_ID, NUM_OF_MINES());

    openCellTailrec(startX, startY);
}

function restartButtonClicked(): void {
    init();
}

function clearGame(): void {
    stopTimer(TIMER_ID);

    mines.forEach(coord => {
        if (!isFlagged_(coord)) {
            cellElemAt_(coord).className = "cell cell-mine";
        } 
    });

    end = true;

    setTimeout(() => {
        alert("cleared");
    }, 1);
}

function endGame(causeX: number, causeY: number): void {
    stopTimer(TIMER_ID);
    
    mines.forEach(coord => {
        if (!isFlagged_(coord)) {
            cellElemAt_(coord).className = "cell cell-mine";
        } 
    });
    cellElemAt(causeX, causeY).className = "cell cell-mine-cause";

    flagged.forEach(coord => {
        if (!isMine_(coord)) {
            cellElemAt_(coord).className = "cell cell-flag-miss";
        }
    });

    end = true;
}

function Main() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const difficultyParam = params.get("d");
        if (difficultyParam != null) {
            difficulty = difficultyParam;
        }
    });

    if (difficulty != "easy" && difficulty != "normal" && difficulty != "hard") {
        return (
            <>
                <p>unknown difficulty: {difficulty}</p>
                <DifficultySelect />
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Minesweeper</title>
            </Head>
            <Game width={WIDTH()}
                  height={HEIGHT()}
                  cellClicked={(x, y) => cellClicked(x, y)}
                  cellRightClicked={(x, y) => cellRightClicked(x, y)}
            />
            <br />
            <div>
                <button id="toggleFlag" onClick={() => toggleFlagButtonClicked()}>switch to flag mode</button>
                <button id="restart" onClick={() => restartButtonClicked()}>restart</button>
                <br />
                <div>
                    <p>time: <Timer id={TIMER_ID} />s</p>
                    <p>mine remains: <Counter id={MINE_COUNTER_ID} /></p>
                </div>
            </div>
            <div>
                <p>difficulty:</p>
                <DifficultySelect />
            </div>
            <AboutPage />
        </>
    );
}

export default Main;
