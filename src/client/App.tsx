import React from "react";
import { useEffect } from "react";

export default ({
    initialize,
    Panel,
    Label,
    Button,
    log
}: {
    initialize: () => void;
    Panel: React.FunctionComponent<{ id?: string; className?: string; hittest?: boolean }>;
    Label: React.FunctionComponent<{ text: string }>;
    Button: React.FunctionComponent<{ onactivate: () => any }>;
    log: (message: any) => void;
}) => {
    useEffect(() => {
        initialize();
    }, []);

    return (
        <Panel id="root" className="root" hittest={false}>
            <Panel>
                <Label text={"phase"} />
                <Button onactivate={() => log("Heeey")}>
                    <Label text="Previous phase" />
                </Button>
                <Button onactivate={() => log("Heeey")}>
                    <Label text="Next phase" />
                </Button>
            </Panel>
        </Panel>
    );
};
