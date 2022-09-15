import React from "react";

import GameContexts from "../src/ts/contexts";

import * as Logic from "../src/ts/game-logic";

type Props = {
    name: string;
}

const RestartButton = (props: Props) => {
    const context = GameContexts.getContext(props.name);

    return (
        <button
            className="restartButton"
            id={`${context.name()}-restart`}
            onClick={() => Logic.restartButtonClicked(context)}
        >restart</button>
    );
};

export default RestartButton;
