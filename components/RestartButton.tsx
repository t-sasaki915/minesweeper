import React from 'react';

import GameContext from "../src/ts/context";

type Props = {
    context: GameContext;
    logic: () => void;
}

const RestartButton = (props: Props) => {
    return (
        <button
            className="restartButton"
            id={`${props.context.name()}-restart`}
            onClick={() => props.logic()}
        >restart</button>
    );
};

export default RestartButton;
