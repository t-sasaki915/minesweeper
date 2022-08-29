import React from "react";
import Head from "next/head";

import { Minesweeper } from "../src/ts/minesweeper";
import { Coordinate, Util } from "../src/ts/util";

const WIDTH = 9;
const HEIGHT = 9;
const NUM_OF_MINES = 10;

let game: Minesweeper;

function cellElemAt(x: number, y: number): HTMLElement {
    return document.getElementById(`${x}-${y}`)!;
}

function cellElemAt_(coord: Coordinate): HTMLElement {
    return cellElemAt(coord.x(), coord.y());
}

let opened: Array<Coordinate> = [];

function cellClicked(x: number, y: number) {
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

function openCell(x: number, y: number) {
    const cell = game.cellAt(x, y);

    if (!flagged.some(c => c.equals(x, y))) {
        if (cell.isMine()) {
            endGame(x, y);
        } else {
            const elem = cellElemAt(x, y);
            const num = game.calcNumber(x, y);

            elem.className = `cell cell-num-${num}`;
            elem.innerHTML = `${num}`;
        }
    }
}

let flagMode = false;
let flagged: Array<Coordinate> = [];

function toggleFlagButtonClicked() {
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

function setFlag(x: number, y: number) {
    if (game != null && !end) {
        const elem = cellElemAt(x, y);

        if (!opened.some(c => c.equals(x, y))) {
            if (flagged.some(c => c.equals(x, y))) {
                elem.className = "cell";
                flagged = flagged.filter(e => !e.equals(x, y));
            } else {
                elem.className = "cell cell-flag";
                flagged.push(new Coordinate(x, y));
            }
        }
    }
}

let end = false;

function startGame(startX: number, startY: number) {
    opened = [];
    flagged = [];
    flagMode = false;
    end = false;

    for (let x = 0; x < WIDTH; x ++) {
        for (let y = 0; y < HEIGHT; y ++) {
            const elem = cellElemAt(x, y);

            elem.className = "cell";
            elem.innerHTML = "0";
        }
    }

    const blacklist = [
        new Coordinate(startX, startY)
    ];

    game = Minesweeper.generate(WIDTH, HEIGHT, NUM_OF_MINES, blacklist);
}

function endGame(causeX: number, causeY: number) {
    game.cells().filter(e => e.isMine()).forEach(cell => {
        const elem = cellElemAt_(cell.coord());
        elem.className = "cell cell-mine"; 
    });

    const causeElem = cellElemAt(causeX, causeY);
    causeElem.className = "cell cell-mine-cause";

    flagged.forEach(coord => {
        const elem = cellElemAt_(coord);
        if (!game.cellAt_(coord).isMine()) {
            elem.className = "cell cell-flag-miss";
        }
    });

    end = true;
}

function Main() {
    return (
        <>
            <Head>
                <title>Minesweeper</title>
            </Head>
            <div>
                {
                    Util.range(0, HEIGHT).map(y =>
                        <div className="line">
                            {
                                Util.range(0, WIDTH).map(x =>
                                    <div className="cell"
                                         id={x.toString() + "-" + y.toString()}
                                         draggable="false"
                                         onClick={() => cellClicked(x, y)}
                                    ></div>
                                )
                            }
                        </div>
                    )
                }
            </div>
            <br />
            <div>
                <button id="toggleFlag" onClick={() => toggleFlagButtonClicked()}>switch to flag mode</button>
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
