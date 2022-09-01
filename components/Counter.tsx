import React from 'react';

type Props = {
    id: string;
}

const Counter = (props: Props) => {
    return (
        <span id={`counter-${props.id}`}>0</span>
    );
};

export default Counter;
