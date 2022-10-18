Client should have 2 tsconfig and 2 webpack
 * 1 for web
 * 1 for panorama

The index file should also be different for both, and in there we will share the main functions that will affect each plaform differently. i.e:

```js
//web.index.ts
import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.scss';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App 
        init={() => {}}
    />
  </React.StrictMode>
);

```

```js
//panorama.index.ts
import React from "react";
import { render } from "react-panorama";
import App from "./App";
import { Provider } from "react-redux";
import { store } from './store';

function initializeApp(){
    
}

render(
    <Provider store={store}>
        <App 
            init={initializeApp}
        />
    </Provider>, 
$.GetContextPanel());

```

And then in App

```js
import React, { useEffect } from "react";

export default ({ init }) => {

    useEffect(() => {
        init();
    }, []);

    return (
        <Panel id="root" className="root" hittest={false}>
        </Panel>
    )
}
```