import React, { useState, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { scadaSelectedDetailsState } from "recoilStore/atoms"; 
import Modal from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from 'components/Core/Typography/TypographyNDL';
import DisplayContentForm from './DisplayContentForm'; // Import the new form component
import Button from 'components/Core/ButtonNDL';


const DisplayContent = ({ open, onClose, onAddDisplay }) => {
  const [selectedContent, setSelectedContent] = useState(null);

  const setScadaDetails = useSetRecoilState(scadaSelectedDetailsState);

  const handleSave = () => {
    if (selectedContent) {
      setScadaDetails(selectedContent); // Save to Recoil state
      onAddDisplay(selectedContent); // Pass data to parent
      onClose(); // Close the modal
    }
  };
  // const handleAddDisplay = (details) => {
  //   setSelectedContent(details);  // Save the selected content details
  //   scadaSelectedDetailsState(details);
  // };
  

  return ( 
  <React.Fragment>

    <Modal open={open} onCancel={onClose}>
      <ModalHeaderNDL>
        <div className="flex">
          <div>
            <TypographyNDL variant="heading-01-xs" value="Add Display" />
            <TypographyNDL variant="paragraph-xs" colors="secondary" value="Description" />
          </div>
        </div>
      </ModalHeaderNDL>

      <ModalContentNDL>
        <DisplayContentForm   selectedContent={selectedContent}  onAddDisplay={setSelectedContent} onClose={onClose} />
       
      </ModalContentNDL>

      <ModalFooterNDL>
        <Button type="tertiary" onClick={onClose} value="Cancel" />
        <Button type="primary" value="Save" onClick={handleSave} />
      </ModalFooterNDL>
    </Modal>
   
    </React.Fragment>
  );
};

export default DisplayContent;
