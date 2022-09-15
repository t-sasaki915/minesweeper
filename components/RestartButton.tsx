import React from 'react';

import GameContext from "../src/ts/context";

type Props = {
    name: string;
    logic: () => void;
}

const RestartButton = (props: Props) => {
    return (
        <button
            className="restartButton"
            id={`${props.name}-restart`}
            onClick={() => props.logic()}
        >restart</button>
    );
};

export default RestartButton;
