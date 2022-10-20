import React from "react";
import { useEffect } from "react";

export default ({
    initialize,
    Panel,
    Label,
    Button,
    log,
    request
}: {
    initialize: () => void;
    Panel: React.FunctionComponent<{ id?: string; className?: string; hittest?: boolean }>;
    Label: React.FunctionComponent<{ text: string }>;
    Button: React.FunctionComponent<{ onactivate: () => unknown }>;
    log: (message: unknown) => void;
    request: (
        url: string,
        init?: {
            method: string;
            params?: [string, string][];
        }
    ) => Promise<unknown>;
}) => {
    useEffect(() => {
        initialize();
    }, []);

    return (
        <Panel id="root" className="root" hittest={false}>
            <Label text={"phase"} />
            <Button
                onactivate={async () => {
                    const response = await request("http://localhost:3000/action", {
                        method: "POST"
                    });
                    log(response);
                }}
            >
                <Label text="Previous phase" />
            </Button>
            <Button onactivate={() => log("Heeey")}>
                <Label text="Next phase" />
            </Button>
        </Panel>
    );
};
