import React from "react";
import Head from "next/head";

import { Minesweeper } from "../src/ts/minesweeper";
import { Coordinate, Util } from "../src/ts/util";

const WIDTH = 9;
const HEIGHT = 9;
const NUM_OF_MINES = 10;

let game: Minesweeper | null;

let mines: Array<Coordinate> = [];
let neutrals: Array<Coordinate> = [];

let opened: Array<Coordinate> = [];
let flagged: Array<Coordinate> = [];

let flagMode = false;
let end = false;

let mineRemain = 0;

function cellElemAt(x: number, y: number): HTMLElement {
    return document.getElementById(`${x}-${y}`)!;
}

function cellElemAt_(coord: Coordinate): HTMLElement {
    return cellElemAt(coord.x(), coord.y());
}

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

function updateMineRemain(): void {
    document.getElementById("mineRemain")!.innerHTML = `${mineRemain}`;
}

function cellClicked(x: number, y: number): void {
    if (game != null) {
        if (!end) {
            if (flagMode) {
                setFlag(x, y);
            } else {
                openCell(x, y);
            }
        }
    } else {
        startGame(x, y);
    }
}

function cellRightClicked(x: number, y: number): void {
    if (game != null && !end) {
        setFlag(x, y);
    }
}

function openCell(x: number, y: number): void {
    if (!isOpened(x, y) && !isFlagged(x, y)) {
        if (isMine(x, y)) {
            endGame(x, y);
        } else {
            const elem = cellElemAt(x, y);
            const num = game!.calcNumber(x, y);

            elem.className = `cell cell-num-${num}`;
            elem.innerHTML = `${num}`;

            opened.push(new Coordinate(x, y));

            if (opened.length == neutrals.length) {
                clearGame();
            }
        }
    }
}

function toggleFlagButtonClicked(): void {
    if (game != null && !end) {
        const elem = document.getElementById("toggleFlag")!;

        if (flagMode) {
            elem.innerHTML = "switch to flag mode";
            flagMode = false;
        } else {
            elem.innerHTML = "switch to normal mode";
            flagMode = true;
        }
    }
}

function setFlag(x: number, y: number): void {
    const elem = cellElemAt(x, y);

    if (!isOpened(x, y)) {
        if (isFlagged(x, y)) {
            mineRemain += 1;
            updateMineRemain();
            elem.className = "cell cell-not-opened";
            flagged = flagged.filter(e => !e.equals(x, y));
        } else {
            mineRemain -= 1;
            updateMineRemain();
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

    mineRemain = 0;
    updateMineRemain();

    for (let x = 0; x < WIDTH; x ++) {
        for (let y = 0; y < HEIGHT; y ++) {
            const elem = cellElemAt(x, y);

            elem.className = "cell cell-not-opened";
            elem.innerHTML = "0";
        }
    }
}

function startGame(startX: number, startY: number): void {
    init();

    const blacklist = [
        new Coordinate(startX, startY)
    ];

    game = Minesweeper.generate(WIDTH, HEIGHT, NUM_OF_MINES, blacklist);
    mines = game.mines().map(c => c.coord());
    neutrals = game.neutrals().map(c => c.coord());

    mineRemain = NUM_OF_MINES;
    updateMineRemain();

    openCell(startX, startY);
}

function restartButtonClicked(): void {
    init();
}

function clearGame(): void {
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

    setTimeout(() => {
        alert("failed");
    }, 1);
}

function Main() {
    return (
        <>
            <Head>
                <title>Minesweeper</title>
            </Head>
            <div className="game">
                {
                    Util.range(0, HEIGHT).map(y =>
                        <div className="line">
                            {
                                Util.range(0, WIDTH).map(x =>
                                    <div className="cell cell-not-opened"
                                         id={x.toString() + "-" + y.toString()}
                                         draggable="false"
                                         onClick={() => cellClicked(x, y)}
                                         onContextMenu={(e) => {
                                            e.preventDefault();
                                            cellRightClicked(x, y);
                                         }}
                                    >0</div>
                                )
                            }
                        </div>
                    )
                }
            </div>
            <br />
            <div>
                <button id="toggleFlag" onClick={() => toggleFlagButtonClicked()}>switch to flag mode</button>
                <button id="restart" onClick={() => restartButtonClicked()}>restart</button>
                <br />
                <div>
                    <p>mine remains: <span id="mineRemain">0</span></p>
                </div>
            </div>
            <div>
                <p>
                    This site is licensed under the <a href="https://github.com/stouma915/minesweeper/blob/main/LICENSE">MIT License</a>.<br />
                    This site is open source. <a href="https://github.com/stouma915/minesweeper/">Improve this site</a>.<br />
                    Powered by <a href="https://pages.github.com">GitHub Pages</a>.
                </p>
            </div>
        </>
    );
}

export default Main;
