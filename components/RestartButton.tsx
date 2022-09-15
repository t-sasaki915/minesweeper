import React from "react";

import GameContext from "../src/ts/context";

import * as Logic from "../src/ts/game-logic";

type Props = {
    context: GameContext;
}

const RestartButton = (props: Props) => {
    return (
        <button
            className="restartButton"
            id={`${props.context.name()}-restart`}
            onClick={() => Logic.restartButtonClicked(props.context)}
        >restart</button>
    );
};

export default RestartButton;
