import React from 'react';

import Coordinate from "../src/ts/coordinate";
import { range } from "../src/ts/util";

type Props = {
    width: number;
    height: number;
    cellClicked: (coord: Coordinate) => void;
    cellRightClicked: (coord: Coordinate) => void;
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
                                    onClick={() => props.cellClicked(new Coordinate(x, y))}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        props.cellRightClicked(new Coordinate(x, y));
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
