import React from "react";
import Styles from "./styles.module.css";

const Card = ({ title, health, mana, onClick }: {
    title: string;
    health: number;
    mana: number;
    onClick: () => void;
}) => {
    return(
        <Panel className={Styles.card} onactivate={onClick}>
            <Label text={title}/>
            <Label text={`Health = ${health}`}/>
            <Label text={`Mana = ${mana}`}/>
        </Panel>
    )
}

export default Card;