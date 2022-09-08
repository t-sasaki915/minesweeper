import React from 'react';

import { range } from "../src/ts/util";

type Props = {
    width: number;
    height: number;
    cellClicked: (x: number, y: number) => void;
    cellRightClicked: (x: number, y: number) => void;
}

const Game = (props: Props) => {
    return (
        <div className="game">
            {
                range(0, props.height).map(y =>
                    <div className="line">
                        { 
                            range(0, props.width).map(x =>
                                <div
                                    className="cell cell-not-opened"
                                    id={`${x}-${y}`}
                                    draggable="false"
                                    onClick={() => props.cellClicked(x, y)}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        props.cellRightClicked(x, y);
                                    }}
                                >0</div>
                            )
                        }
                    </div>
                )
            }
        </div>
    );
};

export default Game;
