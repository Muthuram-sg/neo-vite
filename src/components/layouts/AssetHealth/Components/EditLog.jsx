import React, { useEffect, useState } from 'react'
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL'
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL'
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL'
import TypographyNDL from 'components/Core/Typography/TypographyNDL'
import InputFieldNDL from "components/Core/InputFieldNDL";
import Toast from "components/Core/Toast/ToastNDL";
import DatePickerNDL from "components/Core/DatepickerNDL";
import Button from 'components/Core/ButtonNDL'
import { useTranslation } from "react-i18next";
const EditLog = (props) => {
  const { t } = useTranslation();
  const [PlantID, setPlantID] = useState([])//NOSONAR
  const [date, setDate] = useState({ value: null, isValid: false });
  const [remarks, setRemarks] = useState('');
  const [snackMessage, SetMessage] = useState('');
  const [snackType, SetType] = useState('');
  const [snackOpen, setOpenSnack] = useState(false);
  useEffect(() => {

    setPlantID(props)
  }, [props])

  useEffect(()=>{
    if(props.EditLog){
    setDate({ value: new Date(props.EditLog.log_date), isValid: true });
    setRemarks(props.EditLog.log)
    }
  },[props.EditLog])

  const handleDialogClosefn = () => {
    props.handleDialogClose();
  }

  const handlesaveClick = () => {
    if (date && remarks) {
        props.handleSaveFunction(date, remarks);
    } else {
      setOpenSnack(true);
      SetMessage("Please, fill in the details to save.");
      SetType("warning");
    }
  };
  
  const handleeditClick = () => {
    props.handleUpdateFunction(date, remarks, props.EditedID);
  };
  
  return (
    <div>
      <React.Fragment>
      <Toast type={snackType} message={snackMessage} toastBar={snackOpen}  handleSnackClose={() => setOpenSnack(false)} ></Toast>
        <ModalHeaderNDL>
        {props.EditedID && props.EditedID !== undefined && props.EditedID.length > 0 ? (
          <TypographyNDL  variant="heading-02-s"  model value={"Edit Maintenance Log"} />
        ) : (
          <TypographyNDL  variant="heading-02-s"  model value={"Add Maintenance Log"} />
      )}
        </ModalHeaderNDL>
        <ModalContentNDL>
            <div className='pb-4'>
        <TypographyNDL value={"Date"} variant="paragraph-xs" />
        <DatePickerNDL
          id="Date-picker"
          onChange={(e) => {
            setDate({ value: e, isValid: true });
          }} 
          startDate={date.value ? new Date(date.value) : null}
          dateFormat="dd/MM/yyyy"
          placeholder={"Select Log date"}
          customRange={false}
          label={"Expiry date"}
        />
                                  </div>
                                  <div className='pb-4'>
          <InputFieldNDL
          multiline
          id="line-location"
          label={"Remarks"}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
          </div>
          <TypographyNDL value={"*Continuing will override the data in the selected range if it was previously added."} variant="lable-01-s" color={"#DA1E28"} />
        </ModalContentNDL>
        <ModalFooterNDL>
          <Button type="secondary" value={t('Cancel')}  onClick={() => handleDialogClosefn()} />

          {props.EditedID && props.EditedID !== undefined && props.EditedID.length > 0 ? (
              <Button type="primary" value={t('Update')}  onClick={() => handleeditClick()} />
          ) : (
              <Button type="primary" value={t('Add')}  onClick={() => handlesaveClick()} />
          )}
        </ModalFooterNDL>
      </React.Fragment >
    </div>
  )
}

export default EditLog
