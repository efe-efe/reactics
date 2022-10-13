import React from "react";
import { useEffect } from "react";

export default ({ initialize, Panel, Label }: {
    initialize: () => void;
    Panel: React.FunctionComponent<{}>
    Label: React.FunctionComponent<{text: string}>
}) => {
    useEffect(() => {
        initialize();
    }, []);

    return <Panel>
        <Label text="Hello"/>
    </Panel>;
}