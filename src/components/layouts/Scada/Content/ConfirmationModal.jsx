import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { selectedNodeAtom, nodesAtom } from "recoilStore/atoms";
import Modal from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import Button from 'components/Core/ButtonNDL';
import AccordianNDL2 from 'components/Core/Accordian/AccordianNDL2';
import TypographyNDL from 'components/Core/Typography/TypographyNDL';
import Input from 'components/Core/InputFieldNDL';


const ConfirmationModal = ({ open, onClose, oncancelClick }) => {
 
    return (
        <Modal open={open} onCancel={onClose}  >
             <ModalHeaderNDL>
                <div className="flex">
                    <TypographyNDL variant="heading-01-xs" value="Confirmation Required" />
                </div>
            </ModalHeaderNDL>
            <ModalContentNDL>

            <TypographyNDL variant="paragraph-s"  value="Are you sure you want to exit without saving your changes? Any unsaved changes will be lost" />
            
         
            </ModalContentNDL>
            
            <ModalFooterNDL>

          
                <Button type="secondary" onClick={onClose}  value="Cancel" />
                <Button   type="primary" value="Proceed" onClick={oncancelClick} />
            
            </ModalFooterNDL>
        </Modal>
    );
};

export default ConfirmationModal;
