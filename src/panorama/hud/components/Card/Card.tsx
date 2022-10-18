import React from "react";
import Styles from "./styles.module.css";

const Card = ({
    cardId,
    title,
    health,
    mana,
    onClick
}: {
    cardId: number;
    title: string;
    health: number;
    mana: number;
    onClick: (cardId: number) => void;
}) => {
    return (
        <Panel
            className={Styles.card}
            onactivate={() => {
                onClick(cardId);
            }}
        >
            <Label text={cardId} />
            <Label text={title} />
            <Label text={`Health = ${health}`} />
            <Label text={`Mana = ${mana}`} />
        </Panel>
    );
};

export default Card;
