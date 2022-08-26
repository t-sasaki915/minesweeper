import React from "react";
import Head from "next/head";

import { Minesweeper } from "../src/ts/minesweeper";

const WIDTH = 9;
const HEIGHT = 9;
const NUM_OF_MINES = 10;

const game = Minesweeper.generate(WIDTH, HEIGHT, NUM_OF_MINES);

function Main() {
    return (
        <>
            <Head>
                <title>Minesweeper</title>
            </Head>
            <div>
                {
                    Array.from(Array(HEIGHT).keys()).map(y =>
                        <div className="line">
                            {
                                Array.from(Array(WIDTH).keys()).map(x =>
                                    <a href="#" className="cell" id={x.toString() + "-" + y.toString()}></a>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </>
    );
}

export default Main;
