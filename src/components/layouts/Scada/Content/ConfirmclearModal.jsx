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


const ConfirmclearModal = ({ open, onClose, oncancelClick,oncanvasclear }) => {
 
    return (
        <Modal open={open} onCancel={onClose}  >
             <ModalHeaderNDL>
                <div className="flex">
                    <TypographyNDL variant="heading-01-xs" value="Clear Workspace" />
                </div>
            </ModalHeaderNDL>
            <ModalContentNDL>

            <TypographyNDL variant="paragraph-s" value="Do you really want to clear the workspace?" />
            
         
            </ModalContentNDL>
            
            <ModalFooterNDL>

            <Button type="secondary" onClick={onClose}  value="Close" />
          
               
                <Button   danger value="Clear" onClick={() => { oncanvasclear(); onClose(); }} />
            
            </ModalFooterNDL>
        </Modal>
    );
};

export default ConfirmclearModal;
