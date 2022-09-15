import React from "react";

import RestartButton from "./RestartButton";
import ToggleChordModeButton from "./ToggleChordModeButton";
import ToggleFlagModeButton from "./ToggleFlagModeButton";

import GameContexts from "../src/ts/contexts";
import Coordinate from "../src/ts/coordinate";
import { range } from "../src/ts/util";

import * as Consts from "../src/ts/constants";
import * as Logic from "../src/ts/game-logic";

type Props = {
    name: string;
}

const Game = (props: Props) => {
    const context = GameContexts.getContext(props.name);
    
    return (
        <div className="game">
            {
                range(0, context.difficulty().height()).map(y =>
                    <div className="line">
                        { 
                            range(0, context.difficulty().width()).map(x =>
                                <div
                                    className={Consts.DEFAULT_CELL_CLASSES}
                                    id={`${context.name()}-${x}-${y}`}
                                    draggable="false"
                                    onClick={() =>
                                        Logic.cellClicked(
                                            new Coordinate(x, y),
                                            context
                                        )
                                    }
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        Logic.cellRightClicked(
                                            new Coordinate(x, y),
                                            context
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
                <ToggleFlagModeButton name={context.name()} />
                <ToggleChordModeButton name={context.name()} />
                <RestartButton name={context.name()} />
                <br />
                <div>
                    <p>time: <Timer id={`${context.name()}-timer`} />s</p>
                    <p>mine remains: <Counter id={`${context.name()}-mineRemain`} /></p>
                </div>
            </div>
        </div>
    );
};

export default Game;
