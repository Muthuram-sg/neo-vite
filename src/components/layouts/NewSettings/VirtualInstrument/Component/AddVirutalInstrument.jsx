import React,{ useState, useEffect, useRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from "recoil";
import { selectedPlant, snackToggle, snackMessage, snackType,user } from "recoilStore/atoms";
import InputFieldNDL from 'components/Core/InputFieldNDL';
import Button from "components/Core/ButtonNDL";
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 

import useAddInstrumentFormula  from '../hooks/useAddInstrument'
import useUpdateInstrumentFormula from "../hooks/useUpdateInstrument";
import useDelInstrumentFormula from "../hooks/useDeleteInstrument";


const AddVirutalInstrument = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [, SetMessage] = useRecoilState(snackMessage);
  const [, SetType] = useRecoilState(snackType);
  const [headPlant] = useRecoilState(selectedPlant);
  const [formulaDialog, setFormulaDialog] = useState(false);
  const [formulaDialogMode, setFormulaDialogMode] = useState('create');
  const [formula, setFormula] = useState('');
  const [formulaName, setFormulaName] = useState('');
  const [formulaID, setFormulaID] = useState('');
  const [formulaNameError,setFormulaNameError] = useState();
  const [formulaNameMsg,setFormulaNameMsg] = useState();
  const [formulaError,setFormulaError] = useState();
  const [formulaMsg,setFormulaMsg] = useState();
  const farmulaNameRef = useRef();
  const farmulaRef = useRef();
  const [currUser] = useRecoilState(user);



  const { outVInstrumentLoading, outVInstrumentData, outVInstrumentError, getAddInstrumentFormula } = useAddInstrumentFormula();
  const { outUpdateInstrumentLoading, outUpdateInstrumentData, outUpdateInstrumentError, getUpdateInstrumentFormula } = useUpdateInstrumentFormula();
  const { outDelInstrumentLoading, outDelInstrumentData, outDelInstrumentError, getDelInstrumentFormula } = useDelInstrumentFormula();

  useImperativeHandle(ref, () =>
    (
        {
            handleFormulatDialogAdd: () => {
              setFormulaDialogMode('create');
              setFormulaDialog(true);
              setFormulaNameError(false)
              setFormulaNameMsg('')
              setFormulaError(false)
              setFormulaMsg('')
            },
            handleFormulaCrudDialogDelete: (data) => {
              setFormulaID(data.id)
              setFormulaName(data.name)
              setFormula(data.formula)
              setFormulaDialogMode('delete');
              setFormulaDialog(true);
              setFormulaNameError(false)
              setFormulaNameMsg('')
              setFormulaError(false)
              setFormulaMsg('')
            },  
            handleFormulaCrudDialogEdit: (data) => {
              setFormulaID(data.id)
              setFormulaName(data.name)
              setFormula(data.formula)
              setFormulaDialogMode('edit');
              setFormulaNameError(false)
              setFormulaNameMsg('')
              setFormulaError(false)
              setFormulaMsg('')
              setFormulaDialog(true);
            }

        }
    ))

  useEffect(()=>{
    if(
      outVInstrumentData !== null &&
      !outVInstrumentLoading && 
      !outVInstrumentError
      ){
        SetMessage(t('AddNewFormula') + ' ' + formulaName+ " " +"Successfully")
            SetType("success")
            setOpenSnack(true)
            handleFormulaDialogClose();
            // NOSONAR  -  skip next line
            props.getVIList(headPlant.id);//NOSONAR
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[outVInstrumentData]);

  useEffect(()=>{
    if(
      outUpdateInstrumentData !== null &&
      !outUpdateInstrumentLoading &&
      !outUpdateInstrumentError
      ){
        SetMessage(t('UpdateFormula') + ' ' + formulaName +" "+ "Successfully")
            SetType("success")
            setOpenSnack(true)
            handleFormulaDialogClose();
            // NOSONAR  -  skip next line
            props.getVIList(headPlant.id);//NOSONAR
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[outUpdateInstrumentData]);

  useEffect(()=>{
    if(
      outDelInstrumentData !== null &&
      !outDelInstrumentLoading &&
      !outDelInstrumentError
      ){

        // console.log(outDelInstrumentData,'outDelInstrumentData')
        if(outDelInstrumentData === undefined){
          SetMessage('Unable tp delete' + formulaName)
          SetType("warning")
          setOpenSnack(true)
          handleFormulaDialogClose();
          // NOSONAR  -  skip next line
          props.getVIList(headPlant.id); //NOSONAR
        }else{
          SetMessage(t('DeletedFormula') + ' ' + formulaName + " " + "Successfully")
          SetType("success")
          setOpenSnack(true)
          handleFormulaDialogClose();
          // NOSONAR  -  skip next line
          props.getVIList(headPlant.id);//NOSONAR
        }
     
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[outDelInstrumentData]);
// NOSONAR  -  skip next line
    const onHandleSubmit = () => {//NOSONAR
      if (formulaDialogMode === 'delete') {
        getDelInstrumentFormula(
          formulaID
          );
      } else {
        const trimmedFormulaName = farmulaNameRef.current.value.trim();
        const trimmedFormula = farmulaRef.current.value.trim();
  
        if (trimmedFormulaName !== '' && trimmedFormula !== '') {
          setFormulaName(trimmedFormulaName);
          setFormula(trimmedFormula);
    
    
          if (formulaDialogMode === 'create') {
            getAddInstrumentFormula(
              headPlant.id,
                trimmedFormulaName,
            trimmedFormula,
            currUser.id
              );
          
          } else {
            getUpdateInstrumentFormula(
              formulaID,
              headPlant.id,
              trimmedFormulaName,
              trimmedFormula,
            currUser.id

              );
          }
        }else{
          // NOSONAR  -  skip next line
          if (!trimmedFormulaName && !trimmedFormula) {//NOSONAR
            setFormulaNameError(true)
            setFormulaNameMsg(t("Please Enter Valid Formula Name"))
            setFormulaError(true)
            setFormulaMsg(t("Please Enter Valid Formula"))
          }else if(!trimmedFormula){
            setFormulaError(true)
            setFormulaMsg(t("Please Enter Valid Formula"))
          }else{
            setFormulaNameError(true)
            setFormulaNameMsg(t("Please Enter Valid Formula Name"))
          }
        }
      }
    }

    const handleFormulaDialogClose = () => {
      // NOSONAR  -  skip next line
      props.handleAddVIMDialogClose();//NOSONAR
      setFormulaDialog(false);
      setFormulaName('');
      setFormula('');
      setFormulaNameError(false)
      setFormulaNameMsg('')
      setFormulaError(false)
      setFormulaMsg('')
    }

    const handleFormulaNameChange = (event) =>{
      if(event.target.value !== "") {
        setFormulaName(event.target.value)
        setFormulaNameError(false)
        setFormulaNameMsg('')
      }
      else{
        setFormulaName('');
        setFormulaNameError(true)
        setFormulaNameMsg(t("Please Enter Valid Formula Name"))
      }
    }

    const handleFormulaChange = (event) => {
      if(event.target.value !== "") {
        setFormula(event.target.value)
        setFormulaError(false)
        setFormulaMsg('')
      }
      else{
        setFormula('');
        setFormulaError(true)
        setFormulaMsg(t("Please Enter Valid Formula"))
      }
    }
    let label;

    if (formulaDialogMode === "create") {
        label = t('AddVirtualInstrument');
    } else if (formulaDialogMode === "edit") {
        label = t('EditModeVirtualInstrument');
    } else {
        label = t('DeleteModeVirtualInstrument');
    }

    let buttonText;

      if (formulaDialogMode === "create") {
          buttonText = t('Save');
      } else if (formulaDialogMode === "edit") {
          buttonText = t('Update');
      } else {
          buttonText = t('YesDelete');
      }
      
  return (
    <React.Fragment> 
      {formulaDialog &&
        <React.Fragment>
          <ModalHeaderNDL>
            <TypographyNDL  variant="heading-02-xs" model value={label}/>           
          </ModalHeaderNDL>
          <ModalContentNDL>
            {formulaDialogMode === "delete" &&
              <TypographyNDL variant="paragraph-s" color="secondary" value={t('DeleteLineFormula') + formulaName + t('TheLine') + headPlant.name + "? This action cannot be undone."}  />
            }
            {formulaDialogMode !== "delete" &&
              <div className='mb-3'>
              <InputFieldNDL
                id="formula-name"
                label={t('FormulaName')}
                placeholder={t("Enter Formula Name")}
                onChange={handleFormulaNameChange}
                defaultValue={formulaName}
                inputRef={farmulaNameRef}
                error={formulaNameError}
                helperText={formulaNameMsg}
              />
              </div>
            }
            {formulaDialogMode !== "delete" &&

              <InputFieldNDL
                id="formula"
                label={t('Formula')}
                placeholder={t("Enter Formula")}
                onChange={handleFormulaChange}
                defaultValue={formula}
                multiline={true}
                maxRows={2}
                inputRef={farmulaRef}
                error={formulaError}
                helperText={formulaMsg}
              />

            }
          </ModalContentNDL>
          <ModalFooterNDL>
            <Button  type={"secondary"} 
                onClick={() => handleFormulaDialogClose()}
                value={
                    t('Cancel')}
              />
            <Button type={"primary"} 
                danger={formulaDialogMode === "delete" ? true : false}//NOSONAR
                onClick={() => onHandleSubmit()}
                loading={outDelInstrumentLoading || outVInstrumentLoading || outUpdateInstrumentLoading}
                value={buttonText}
              />
              
          </ModalFooterNDL>
      </React.Fragment>}
  </React.Fragment> 
  )
});
export default AddVirutalInstrument;
