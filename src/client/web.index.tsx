import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const Panel: React.FunctionComponent<{className?: string; id?: string; hittest?: boolean}> = props => {
    return <div id={props.id} className={props.className}>{props.children}</div>
}

const Label: React.FunctionComponent<{text: string}> = props => {
    return <>{props.text}</>;
}

const Button: React.FunctionComponent<{onactivate: () => void}> = props => {
    return <button onClick={props.onactivate}>{props.children}</button>;
}

const log = (message: any) => console.log(message);

ReactDOM.render(
<App
    initialize={() => {}}
    Panel={Panel}
    Label={Label}
    Button={Button}
    log={log}
/>, document.getElementById("app"))