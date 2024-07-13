import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import see_cross_icon from '../../../assets/icons/see-cross-icon.svg';
import './see-all-methods.css';
import utils from '../../../utils/utils';
import ButtonComponent from '../../resusable/button/authButton';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30%',
  backgroundColor: '#ffffff',
  boxShadow: 24,
  padding: '40px 30px',
  border: 'none',
  borderRadius: '8px',
  outline: 'none',
};

export default function FreeSubscriptionModal({
  open,
  closeDentalIdModal,
  icon,
  heading,
  description,
  successButtonText,
  failureButtonText,
  performConfirmation,
}) {
  return (
    <div>
      <Modal
        open={open}
        onClose={closeDentalIdModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="alert_modal_container">
            <img src={icon} height={50} width={50} alt="alert icon" />
            <h1>{heading}</h1>
            <p>{description}</p>
            <div className="buttons_container">
              <div>
                <ButtonComponent
                  text={successButtonText}
                  buttonStyle={{
                    padding: '10px 0px',
                    fontSize: '16px',
                    backgroundColor: 'white',
                    border: '1px solid #20C3FF',
                    color: '#20C3FF',
                    fontWeight: '450',
                  }}
                  performClick={performConfirmation}
                />
              </div>
              <div>
                <ButtonComponent
                  text={failureButtonText}
                  buttonStyle={{
                    padding: '10px 0px',
                    fontSize: '16px',
                    fontWeight: '450',
                    border: '1px solid #20C3FF',
                  }}
                  performClick={closeDentalIdModal}
                />
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
