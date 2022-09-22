import React from "react";

import Counter from "./Counter";
import RestartButton from "./RestartButton";
import Timer from "./Timer";
import ToggleChordModeButton from "./ToggleChordModeButton";
import ToggleFlagModeButton from "./ToggleFlagModeButton";

import GameContext from "../src/ts/context";
import Coordinate from "../src/ts/coordinate";
import { range } from "../src/ts/util";

import * as Consts from "../src/ts/constants";
import * as Logic from "../src/ts/game-logic";

type Props = {
    context: GameContext;
}

const Game = (props: Props) => {
    return (
        <div className="game">
            {
                range(0, props.context.difficulty().height()).map(y =>
                    <div className="line">
                        { 
                            range(0, props.context.difficulty().width()).map(x =>
                                <div
                                    className={Consts.DEFAULT_CELL_CLASSES}
                                    id={`${props.context.name()}-${x}-${y}`}
                                    draggable="false"
                                    onClick={() =>
                                        Logic.cellClicked(
                                            new Coordinate(x, y),
                                            props.context
                                        )
                                    }
                                    onAuxClick={(e) => {
                                        if (e.button == 1) {
                                            Logic.cellMiddleClicked(
                                                new Coordinate(x, y),
                                                props.context
                                            );
                                        }
                                    }}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        Logic.cellRightClicked(
                                            new Coordinate(x, y),
                                            props.context
                                        );
                                    }}
                                >0</div>
                            )
                        }
                    </div>
                )
            }
            <br />
            <div>
                <ToggleFlagModeButton context={props.context} />
                <ToggleChordModeButton context={props.context} />
                <RestartButton context={props.context} />
                <br />
                <div>
                    <p>time: <Timer id={`${props.context.name()}-timer`} />s</p>
                    <p>mine remains: <Counter id={`${props.context.name()}-mineRemain`} /></p>
                </div>
            </div>
        </div>
    );
};

export default Game;
