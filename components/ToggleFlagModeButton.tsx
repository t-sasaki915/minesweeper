import React from "react";

import GameContext from "../src/ts/context";

import * as Logic from "../src/ts/game-logic";

export function updateInnerHTML(context: GameContext): void {
    const elem = document.getElementById(`${context.name()}-toggleFlagMode`)!;
    elem.innerHTML = context.flagMode() ? "exit flag mode" : "switch to flag mode";
}

type Props = {
    context: GameContext;
}

const ToggleFlagModeButton = (props: Props) => {
    return (
        <button
            className="toggleFlagModeButton"
            id={`${props.context.name()}-toggleFlagMode`}
            onClick={() => Logic.toggleFlagButtonClicked(props.context)}
        >switch to flag mode</button>
    );
};

export default ToggleFlagModeButton;
