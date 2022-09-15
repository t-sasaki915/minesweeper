import React from "react";

import GameContext from "../src/ts/context";
import GameContexts from "../src/ts/contexts";

import * as Logic from "../src/ts/game-logic";

type Props = {
    name: string;
}

export function updateFlagInnerHTML(context: GameContext): void {
    const elem = document.getElementById(`${context.name()}-toggleFlagMode`)!;
    elem.innerHTML = context.flagMode() ? "exit flag mode" : "switch to flag mode";
}

const ToggleFlagModeButton = (props: Props) => {
    const context = GameContexts.getContext(props.name);
    
    return (
        <button
            className="toggleFlagModeButton"
            id={`${context.name()}-toggleFlagMode`}
            onClick={() => Logic.toggleFlagButtonClicked(context)}
        >switch to flag mode</button>
    );
};

export default ToggleFlagModeButton;
