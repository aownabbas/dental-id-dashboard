import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import see_cross_icon from '../../../assets/icons/see-cross-icon.svg';
import './see-all-methods.css';

export default function SeeAllMethods({ open, closeDentalIdModal }) {
  return (
    <div>
      <Modal
        open={open}
        onClose={closeDentalIdModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal_container">
          <div className="children_methods">
            <div>
              <p>CHILDREN B-4</p>
              <img src={see_cross_icon} height={25} width={25} alt="Video Thumbnail" onClick={closeDentalIdModal} />
            </div>
            <p>SCHOUR METHOD</p>
            <p>UBELAKER METHOD</p>
          </div>
          <div className="juvenile_methods">
            <p>JUVENILE 5-14</p>
            <p>WILLEMS METHOD</p>
            <p>MOORREES METHOD</p>
            <p>COLLATION</p>
          </div>
          <div className="adolescent_methods">
            <p>ADOLESCENT 15-21</p>
            <p>MESOTTEN METHOD</p>
            <p>MINCER METHOD</p>
          </div>
          <div className="adult_methods">
            <p>ADULT 22+</p>
            <p>CAMERIERE METHOD</p>
            <p>IKEDA METHOD</p>
            <p>KVALL METHOD</p>
            <p>MAPLES METHOD</p>
            <p>JOHANSON METHOD</p>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
