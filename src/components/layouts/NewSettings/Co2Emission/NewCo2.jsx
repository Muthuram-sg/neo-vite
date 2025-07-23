import React, { useEffect, useState, useRef, useImperativeHandle } from "react";
import Grid from 'components/Core/GridNDL'
import InputFieldNDL from "components/Core/InputFieldNDL";
import Button from "components/Core/ButtonNDL";
import { useTranslation } from 'react-i18next';
import DatePickerNDL from 'components/Core/DatepickerNDL';
import { selectedPlant, user,snackToggle, snackMessage, snackType, snackDesc} from "recoilStore/atoms"; 
import { useRecoilState } from "recoil";
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import useAddCo2 from "./hooks/useAddCo2"
import useUpdateCo2Factor from "./hooks/useUpdateCo2Factor"
import useDeleteCo2Factor from "./hooks/useDeleteCo2Factor"  
import moment from 'moment';
import configParam from "config";


const NewCo2 = React.forwardRef((props, ref) => {  // NOSONAR start -  skip this line
    const { t } = useTranslation(); 
    const [currUser] = useRecoilState(user);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, setSnackMessage] = useRecoilState(snackMessage);
    const [, setSnackType] = useRecoilState(snackType);
    const [, setSnackDesc] = useRecoilState(snackDesc);
    const [Load, setLoading] = useState(false);// NOSONAR start -  skip this line
    const [Co2ID, setCo2ID] = useState(''); 
    const [headPlant] = useRecoilState(selectedPlant); 
    const [Co2Factor, setCo2Factor] = useState({ value: "", isValid: true });
    const [date, setdate] = useState({ value: null, isValid: null })
    const [enddate, setenddate] = useState({ value: null, isValid: null })
    const [DeleteID, setDeleteID] = useState('');
    const [defValue,setdefValue]= useState(''); 
    const Co2FactorRef = useRef() 
    const {AddCo2Loading, AddCo2Data, AddCo2Error, getAddCo2}=useAddCo2()
    const {UpdateCo2FactorLoading, UpdateCo2FactorData, UpdateCo2FactorError, getUpdateCo2Factor}=useUpdateCo2Factor()
    const {DeleteCo2FactorLoading, DeleteCo2FactorData, DeleteCo2FactorError, getDeleteCo2Factor}=useDeleteCo2Factor()

    useImperativeHandle(ref, () =>
    (
      {  
        handleToolDialogOpen: (data) => { 
          // console.log(data,"EditData") 
          Co2FactorRef.current.value = data.co2_value 
          setdefValue(data.co2_value)
          setCo2ID(data.id)
          setdate({value: data.starts_at, isValid: null}) 
          setenddate({value: data.ends_at, isValid: null})
        },
        handleToolDelete: (data)=>{
          // console.log(data,"DeleteID")
          setDeleteID(data.id)

        },
        handleDefault: (data)=>{
          setdate({value: new Date(), isValid: null}) 
          setenddate({value: new Date(), isValid: null}) 
          setdefValue(data ? data.co2_value : '')
          if(data){
            setCo2ID(data.id)
            Co2FactorRef.current.value =data.co2_value
          }
          // console.log(data,"DeleteID") 

        }
      }
    ))


useEffect(() => {
  if (!AddCo2Loading && !AddCo2Error && AddCo2Data) {
    if (AddCo2Data.affected_rows > 0) {
      setSnackMessage('Success')
      setSnackDesc(props.dialogMode === 'Default' ? "The default co2 value has been succesfully Updated" : 'New co2 value has been succesfully added')
      setSnackType(props.dialogMode === 'Default' ? "info":"success")
      setOpenSnack(true)
      setLoading(false)
      props.refreshTable()
      handleToolDialogClose(); 
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [AddCo2Loading, AddCo2Data, AddCo2Error])

useEffect(() => {
  if (!UpdateCo2FactorLoading && !UpdateCo2FactorError && UpdateCo2FactorData) {
    if (UpdateCo2FactorData.affected_rows > 0) {
      setSnackMessage('Updated')
      setSnackDesc(props.dialogMode === 'Default' ? "The default co2 value has been succesfully Updated" :'The co2 value has been succesfully Updated')
      setSnackType("info")
      setOpenSnack(true)
      setLoading(false)
      props.refreshTable()
      handleToolDialogClose(); 
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [UpdateCo2FactorLoading, UpdateCo2FactorData, UpdateCo2FactorError])

useEffect(() => {
  if (!DeleteCo2FactorLoading && !DeleteCo2FactorError && DeleteCo2FactorData) {
    if (DeleteCo2FactorData.affected_rows > 0) {
      // console.log(DeleteCo2FactorData,"DeleteCo2FactorData")
      setSnackMessage(DeleteCo2FactorData.returning[0].co2_value +' Deleted')
      setSnackDesc('The co2 '+DeleteCo2FactorData.returning[0].co2_value+' has been succesfully deleted')
      setSnackType("error")
      setOpenSnack(true)
      props.refreshTable()
      handleToolDialogClose(); 
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [DeleteCo2FactorLoading, DeleteCo2FactorData, DeleteCo2FactorError])


  
  const handleToolDialogClose = () => {
   
      setCo2Factor({ value: "", isValid: true });
      setdefValue('')
      setCo2ID('')
      props.handleToolDialogClose() // NOSONAR -  skip this line
  };
// NOSONAR 
    function saveToolLife(){// NOSONAR -  skip this line
      
        if(!Co2FactorRef.current.value || Co2FactorRef.current.value <= 0){
            setCo2Factor({value: "", isValid: false})
            return false
        }else{
            setCo2Factor({value: Co2FactorRef.current.value, isValid: true}) 
        }
        let FactorList = Co2ID ? props.Co2List.filter(e=> e.id !== Co2ID) : props.Co2List
        // console.log(Co2FactorRef.current.value,"LimitTimeRef",date.value,enddate.value,FactorList)
        if(!date.value){
          setdate({value:null,isValid: 'Select Start Date'});
          return false
        }else{
          let startAT = FactorList.find(s=> moment(date.value).isBetween(moment(s.starts_at), moment(s.ends_at)) || moment(date.value).isSame(s.starts_at) || moment(s.starts_at).isBetween(moment(date.value), moment(enddate.value)) ) 
          if(startAT && props.dialogMode !== 'Default'){
            setdate({value:date.value,isValid: `Date falls within another range ${moment(startAT.starts_at).format('DD/MM/YYYY')} and ${moment(startAT.ends_at).format('DD/MM/YYYY')}`});
            return false
          }else{
            setdate({value: date.value, isValid: null}) 
          } 
        }
        
        // console.log(moment(date.value).format('DD/MM/YYYY'),"date",moment(enddate.value).format('DD/MM/YYYY'),"enddate")
       
        
        const start = moment(date.value, 'YYYY-MM-DD', true);  // strict parsing
        const end = moment(enddate.value, 'YYYY-MM-DD', true); // strict parsing
        const maxYear = 2040;
        
        
        // Check if start year is more than 2040
        if (start.year() > maxYear) {
          setdate({ value: null, isValid: 'Invalid Date' });
          return false;
        }
       
        // Check if end year is more than 2040
        if (end.year() > maxYear) {
          setenddate({ value: null, isValid: 'Invalid Date' });
          return false;
        }
        
        
        if(!enddate.value){
          setenddate({value:null,isValid: 'Select End Date'});
          return false
        }else{
          let endAT = FactorList.find(s=> moment(enddate.value).isBetween(moment(s.starts_at), moment(s.ends_at)) || moment(enddate.value).isSame(s.ends_at) || moment(enddate.value).isSame(s.starts_at) || moment(s.ends_at).isBetween(moment(date.value), moment(enddate.value)) )
          if(endAT && props.dialogMode !== 'Default'){
            setenddate({value:null,isValid: 'Selected end Date already Exist'});
            return false
          }else{
            setenddate({value: enddate.value, isValid: null}) 
          }
        } 
        
        if(props.dialogMode === 'create' || (props.dialogMode === 'Default' && !defValue)){
          setLoading(true)
          getAddCo2(Co2FactorRef.current.value,moment(date.value).format('YYYY-MM-DDTHH:mm:ssZ'),moment(enddate.value).endOf('day').format('YYYY-MM-DDTHH:mm:ssZ'),headPlant.id,props.dialogMode === 'Default' ? true:false,currUser.id)
        }else{
          setLoading(true)
          getUpdateCo2Factor(Co2ID,Co2FactorRef.current.value,moment(date.value).format('YYYY-MM-DDTHH:mm:ssZ'),moment(enddate.value).endOf('day').format('YYYY-MM-DDTHH:mm:ssZ'),currUser.id)
        }  
    }

    function DeleteCo2Factor(){
      getDeleteCo2Factor(DeleteID)
    }

    function BtnTextFnc(){
      if(props.dialogMode === 'create') {
        return t('Save')
      }else if(props.dialogMode === 'delete'){
        return t('Delete')
      }else{
        return t('Update')
      }
    }
 

    let Title = (props.dialogMode === 'delete') ? 'Delete' : props.dialogMode
    return (
        <React.Fragment>
            <ModalHeaderNDL>
                <TypographyNDL value={(props.dialogMode === 'create' ? 'Add' : Title) + ' Co2 '+(props.dialogMode === 'Default' ? 'Value':'Factor')} variant='heading-02-xs'  />
            </ModalHeaderNDL>

            <ModalContentNDL>
              {props.dialogMode === 'delete' ?
                <TypographyNDL variant="paragraph-s" color="secondary" value={<React.Fragment>{t('Do you really want to delete the Co2 value') + t('TheLine') + headPlant.name + t('NotReversible')} <br></br> <TypographyNDL style={{paddingTop:'12px'}} value={"Note: Co2 configured data will be deleted permanently."}  variant={'paragraph-xs'} color="danger" /></React.Fragment>}  />
                :
                <Grid container spacing={3}>
                <Grid item xs={12}>
                  <InputFieldNDL
                    label={props.dialogMode === 'Default' ? "Default Co2 Value": "Co2 Factor"}
                    inputRef={Co2FactorRef}
                    mandatory
                    type={"number"}
                    placeholder={t("Enter Co2 Factor")}
                    error={!Co2Factor.isValid ? true : false}
                    helperText={!Co2Factor.isValid ? t('Enter Co2 Factor ,should be greater than zero') : ""}
                    defaultValue={defValue ? defValue : configParam.CO2_tag}
                    //   onChange={handleCo2FactorChange}
                  />
                </Grid>
                {props.dialogMode !== 'Default' &&
                <Grid item xs={6}>
                            <TypographyNDL  variant="paragraph-xs" color="primary"  value={t("Starts at")} />
                            <DatePickerNDL
                                      id="Date-picker"
                                      onChange={(e) => {
                                          setdate({value:e,isValid: null});
                                        }}  
                                      startDate={date.value ? new Date(date.value) : date.value}
                                      dateFormat="dd/MM/yyyy"
                                      placeholder={t("Start at")}
                                      customRange={false}
                                      label={t("Starts at")}
                                      error={date.isValid ? true : false}
                                      // helperText={date.isValid }
                                      maxDate={enddate.value ? new Date(enddate.value):null}
                                      minDate={null}
                                      
                            />


                </Grid>}
                {props.dialogMode !== 'Default' &&
                <Grid item xs={6}>
                <TypographyNDL  variant="paragraph-xs" color="primary"  value={t("Ends   at")} />
                            <DatePickerNDL
                                      id="Date-picker"
                                      onChange={(e) => {
                                          setenddate({value:e,isValid: null});
                                        }}  
                                      startDate={enddate.value ? new Date(enddate.value) : enddate.value}
                                      dateFormat="dd/MM/yyyy"
                                      placeholder={t("End at")}
                                      customRange={false}
                                      label={t("Ends at")}
                                      error={enddate.isValid ? true : false}
                                      helperText={enddate.isValid }
                                      maxDate={null}
                                      minDate={date.value ? new Date(date.value):null}
                                      
                            />
                </Grid>}
                <Grid item xs={12}>
                <TypographyNDL  variant="paragraph-xs" color="danger"  value={date.isValid} />
                </Grid>
                 
                </Grid>
              }
              
            </ModalContentNDL>

            <ModalFooterNDL>
              <Button type={"secondary"} style={{width:"80px"}}  value={ t('Cancel')} onClick={() => handleToolDialogClose()}/>
              <Button type={"primary"} disabled={date.isValid} danger={props.dialogMode === 'delete' ? true: false} style={{width:"80px"}} loading={Load} value={BtnTextFnc()} onClick={() => props.dialogMode === 'delete' ? DeleteCo2Factor():saveToolLife()}/>
 
            </ModalFooterNDL>
        </React.Fragment >
    )

})
export default NewCo2;