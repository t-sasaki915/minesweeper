import React from "react";
import Head from "next/head";

import { Minesweeper } from "../src/ts/minesweeper";
import { Coordinate, Util } from "../src/ts/util";

const WIDTH = 9;
const HEIGHT = 9;
const NUM_OF_MINES = 10;

let game: Minesweeper;

let flagMode = false;

let end = false;

function clicked(x: number, y: number) {
    if (!end) {
        if (game != null) {
            const cell = game.cellAt(x, y);
            const elem = document.getElementById(`${x}-${y}`)!;

            if (cell.isMine()) {
                elem.className = "cell cell-mine-cause";
                end = true;
            }
        } else {
            startGame(x, y);    
        }
    }
}

function toggleFlagMode() {
    const elem = document.getElementById("toggleFlag")!;

    if (flagMode) {
        elem.innerHTML = "switch to flag mode";
        flagMode = false;
    } else {
        elem.innerHTML = "switch to normal mode";
        flagMode = true;
    }
}

function startGame(x: number, y: number) {
    const blacklist = [
        new Coordinate(x, y)
    ];

    game = Minesweeper.generate(WIDTH, HEIGHT, NUM_OF_MINES, blacklist);

    for (let x = 0; x < WIDTH; x ++) {
        for (let y = 0; y < HEIGHT; y ++) {
            const cell = game.cellAt(x, y);
            const elem = document.getElementById(`${x}-${y}`)!;

            const num = game.calcNumber(x, y);

            if (cell.isMine()) {
                elem.className = "cell cell-mine";
            } else {
                elem.className = `cell cell-num-${num}`;
            }

            elem.innerHTML = `${num}`;
        }
    }
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
                                         onClick={() => clicked(x, y)}
                                    ></div>
                                )
                            }
                        </div>
                    )
                }
            </div>
            <div>
                <button id="toggleFlag" onClick={() => toggleFlagMode()}>switch to flag mode</button>
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
