import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

function initialize(){
    console.log("Initializing app...")
}

const Panel: React.FunctionComponent<{}> = props => {
    return <div>{props.children}</div>
}

const Label: React.FunctionComponent<{text: string}> = props => {
    return <>{props.text}</>;
}

ReactDOM.render(
<App
    initialize={initialize}
    Panel={Panel}
    Label={Label}
/>, document.getElementById("app"))