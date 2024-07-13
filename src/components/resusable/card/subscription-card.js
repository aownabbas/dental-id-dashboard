import React from 'react';
import './card.css';
import ButtonComponent from '../button/authButton';

function SubscriptionCard({ icon, heading, description,buttonTitle,performClick }) {
  return (
    <div className="subscription-card-container">
      <img src={icon} width={70} height={60} alt="icon" />
      <h1>{heading}</h1>
      <p>{description}</p>
      <div>
        <ButtonComponent text={buttonTitle} performClick={performClick} buttonStyle={{ width: 'auto', padding: '8px 50px', fontSize: '16px' }} />
      </div>
    </div>
  );
}

export default SubscriptionCard;
