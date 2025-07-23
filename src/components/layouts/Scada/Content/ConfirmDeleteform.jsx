import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { selectedNodeAtom, nodesAtom } from "recoilStore/atoms";
import Modal from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import Button from 'components/Core/ButtonNDL';

import TypographyNDL from 'components/Core/Typography/TypographyNDL';
import Input from 'components/Core/InputFieldNDL';


const ComfirmDeleteModal = ({ open, onClose, oncancelClick }) => {
 
    return (
        <Modal open={open} onCancel={onClose}  >
             <ModalHeaderNDL>
                <div className="flex">
                    <TypographyNDL variant="heading-01-xs" value="Delete Dashboard" />
                </div>
            </ModalHeaderNDL>
            <ModalContentNDL>
            <TypographyNDL 
                                            variant="lable-01-s" 
                                            color="secondary" 
                                            value={
                                                t("realDelScadView") + 
                                                (selectedScadaView && selectedScadaView.name ? selectedScadaView.name : '') + 
                                                t("NotReversible")
                                            } 
                                        />
           
            
         
            </ModalContentNDL>
            
            <ModalFooterNDL>

          
                <Button type="secondary" onClick={onClose}  value="Cancel" />
                <Button   type="primary" value="Proceed" onClick={oncancelClick} />

                {/* <Button 
                        type="secondary" 
                        value={'Cancel'} 
                        onClick={handleDialogClose} 
                      />
                      <Button 
                        type="primary" 
                        value={t('YesDelete')} 
                        danger 
                        loading={DeleteScadaViewLoading} 
                        disabled={DeleteScadaViewLoading} 
                        onClick={deletescadaview} 
                      /> */}
            
            </ModalFooterNDL>
        </Modal>
    );
};

export default ComfirmDeleteModal;
