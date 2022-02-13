import React, { useEffect } from "react";
import Styles from './styles.module.css';

const Card = () => {
    return(
        <Panel className={Styles.card}>
            <Panel className={Styles.description}>
                <Label text="This is the card description"/>
            </Panel>
        </Panel>
    )
}

export default Card;