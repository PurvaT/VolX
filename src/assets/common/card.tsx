
import { ReactElement } from 'react';
import styles from '../styles/Home.module.css';

interface CardProps {
    cardTitle:string;
    description?: ReactElement
    onClick?: () => void;
    cardClassNames?: string;
}

const Card = (props: CardProps) => {
    const {cardTitle,description,onClick, cardClassNames} = props;

    return <div className={`bg-gray-900/50 backdrop-blur rounded-xl p-6 border border-gray-700 ${cardClassNames}`}>
              <div className="d-grid justify-between">
                <h3 className="text-xl font-semibold mb-3">{cardTitle}</h3>
                <div className="gap-8 text-sm text-gray-400 mb-1">
                  {description}
                </div>
              </div>
            </div>
}
export default Card;