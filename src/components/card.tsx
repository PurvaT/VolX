
import { ReactElement } from 'react';
import styles from '../styles/Home.module.css';

interface CardProps {
    cardTitle:string;
    description?: ReactElement
    onClick?: () => void;
}

const Card = (props: CardProps) => {
    const {cardTitle,description,onClick} = props;

    return <div key={cardTitle} className={styles.card} onClick={onClick}>
            <h3>{cardTitle}</h3>
            <div>{description}</div>
          </div>
}
export default Card;