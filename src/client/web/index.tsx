import React from "react";
import ReactDOM from "react-dom";
import App from "../App";

const Panel: React.FunctionComponent<{ className?: string; id?: string; hittest?: boolean }> = props => {
    return (
        <div id={props.id} className={props.className}>
            {props.children}
        </div>
    );
};

const Label: React.FunctionComponent<{ text: string }> = props => {
    return <>{props.text}</>;
};

const Button: React.FunctionComponent<{ onactivate: () => any }> = props => {
    return <button onClick={props.onactivate}>{props.children}</button>;
};

const log = (message: any) => console.log(message);

function initialize() {
    fetch("http://localhost:3000/subscribe", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: new URLSearchParams({
            source: "web",
            playerId: "1"
        })
    }).catch(err => console.log("Couldn't connect to the server: ", err));
}

ReactDOM.render(<App initialize={initialize} Panel={Panel} Label={Label} Button={Button} log={log} />, document.getElementById("app"));
