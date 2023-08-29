import React, { useEffect } from 'react';
import { get_datetime_limit } from './axios'

export function LimitText() {
    const [text, setText] = React.useState("");
    useEffect(() => {
        get_datetime_limit().then(res => {setText(res[1])})
        .catch(err => setText("Loading"));
    });

    return (
        <div>
            <h3>Max recorded date: {text}</h3>
        </div>
    );
}
