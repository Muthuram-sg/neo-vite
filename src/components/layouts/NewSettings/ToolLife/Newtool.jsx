import React, { useEffect, useState, useRef, useImperativeHandle } from "react";
import Grid from 'components/Core/GridNDL'
import InputFieldNDL from "components/Core/InputFieldNDL";
import Button from "components/Core/ButtonNDL";
import { useTranslation } from 'react-i18next';
import MaskedInput from "components/Core/MaskedInput/MaskedInputNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import { selectedPlant,instrumentsList, user,snackToggle, snackMessage, snackType, snackDesc} from "recoilStore/atoms"; 
import { useRecoilState } from "recoil";
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import useAddToolLife from "./hooks/useAddToolLife.jsx"
import useUpdateTool from "./hooks/useUpdateTool.jsx"
import useDeleteToolLife from "./hooks/useDeleteToolLife.jsx"  

// NOSONAR  -  working fine
const Newtool = React.forwardRef((props, ref) => {  // NOSONAR
    const { t } = useTranslation(); 
    const [currUser] = useRecoilState(user);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, setSnackMessage] = useRecoilState(snackMessage);
    const [, setSnackType] = useRecoilState(snackType);
    const [, setSnackDesc] = useRecoilState(snackDesc);
    // NOSONAR  -  working fine
    const [Load, setLoading] = useState(false);// NOSONAR
    const [ToolID, setToolID] = useState('');
    const [assetType, setAssetType] = useState({ value: 0, isValid: true });
    const [headPlant] = useRecoilState(selectedPlant);
    const [instrument, setInstrument] = useState({ value: [], isValid: true });
    const [ToolName, setToolName] = useState({ value: "", isValid: true });
    const [Limitval, setLimitval] = useState({ value: "", isValid: true });
    const [DeleteID, setDeleteID] = useState('');
    const [resetTime,setresetTime]= useState(null);
    const [instruments] = useRecoilState(instrumentsList);
    const [DurationMsg,setDurationMsg] = useState('');
    
    const ToolNameRef = useRef()
    const LimitRef = useRef()
    const LimitTimeRef = useRef()
    const {AddToolLifeLoading, AddToolLifeData, AddToolLifeError, getAddToolLife}=useAddToolLife()
    const {UpdateToolLoading, UpdateToolData, UpdateToolError, getUpdateTool}=useUpdateTool()
    const {DeleteToolLifeLoading, DeleteToolLifeData, DeleteToolLifeError, getDeleteToolLife}=useDeleteToolLife()

    useImperativeHandle(ref, () =>
    (
      {  
        handleToolDialogOpen: (data) => { 
          console.log(data,"EditData")
          setAssetType({ value: data.asset_type.id, isValid: true });
          setInstrument({ value: data.intruments, isValid: true });
          ToolNameRef.current.value = data.name
          LimitRef.current.value = data.limit
          setToolID(data.id)
          setresetTime(data.reset_ts)
          LimitTimeRef.current.inputElement.value =data.limit_ts
        },
        handleToolDelete: (data)=>{
          setDeleteID(data.id)

        }
      }
    ))

useEffect(() => {
    
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [headPlant]) 

useEffect(() => {
  if (!AddToolLifeLoading && !AddToolLifeError && AddToolLifeData) {
    if (AddToolLifeData.affected_rows > 0) {
      setSnackMessage('Success')
      setSnackDesc('Tool entity Created succesfully')
      setSnackType("success")
      setOpenSnack(true)
      setLoading(false)
      // NOSONAR  -  working fine
      props.refreshTable()// NOSONAR
      handleToolDialogClose(); 
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [AddToolLifeLoading, AddToolLifeData, AddToolLifeError])

useEffect(() => {
  if (!UpdateToolLoading && !UpdateToolError && UpdateToolData) {
    if (UpdateToolData.affected_rows > 0) {
      setSnackMessage('Success')
      setSnackDesc('Tool Updated succesfully')
      setSnackType("success")
      setOpenSnack(true)
      setLoading(false)
      // NOSONAR  -  working fine
      props.refreshTable()// NOSONAR
      handleToolDialogClose(); 
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [UpdateToolLoading, UpdateToolData, UpdateToolError])

useEffect(() => {
  if (!DeleteToolLifeLoading && !DeleteToolLifeError && DeleteToolLifeData) {
    if (DeleteToolLifeData.affected_rows > 0) {
      // console.log(DeleteToolLifeData,"DeleteToolLifeData")
      setSnackMessage('Success')
      setSnackDesc(DeleteToolLifeData.returning[0].name+' Deleted succesfully')
      setSnackType("success")
      setOpenSnack(true)
      // NOSONAR  -  working fine
      props.refreshTable()// NOSONAR
      handleToolDialogClose(); 
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [DeleteToolLifeLoading, DeleteToolLifeData, DeleteToolLifeError])

const handleAssetTypeChange = (event) => {
    setAssetType({ value: event.target.value, isValid: event.target.value !== "" }); 
}

const handleInstrumentsListChange = (event) => {
   
    setInstrument({ value: [{id:event.target.value}], isValid: event.target.value !== "" });
  
  }
  
  const handleToolDialogClose = () => {
   
    setAssetType({ value: '', isValid: true });
    setInstrument({ value: [], isValid: true });
    setToolName({ value: "", isValid: true });
    setLimitval({ value: "", isValid: true });
    // NOSONAR  -  skip
     props.handleToolDialogClose()// NOSONAR
    //  console.log("cancel",handleToolDialogClose)
    };
// NOSONAR  -  skip
    function saveToolLife(){// NOSONAR
      // console.log(LimitTimeRef.current,"LimitTimeRef")
        if(!ToolNameRef.current.value || ToolNameRef.current.value.trim() === ""){
            setToolName({value: "", isValid: false})
            return false
        }else{
            setToolName({value: ToolNameRef.current.value, isValid: true}) 
        }
        let Toolarr =[]
        let Instarr =[]
        let IntID = (instrument.value && instrument.value.length>0) ? instrument.value[0].id : ''
        // NOSONAR  start -  skip
        if(props.dialogMode === 'edit'){// NOSONAR
          const toolName = ToolNameRef.current?.value?.toLowerCase() || '';
          Toolarr = props.ToolList.filter(f =>
            f.name.toLowerCase() === toolName && f.id !== ToolID
          );
          Instarr = props.ToolList.filter(f => f.intruments[0].id === IntID && f.id !== ToolID)// NOSONAR
        }else{
          Toolarr = props.ToolList.filter(f=> f.name.toLowerCase() ===  ToolNameRef.current.value.toLowerCase())// NOSONAR
          Instarr = props.ToolList.filter(f=> f.intruments[0].id === IntID )// NOSONAR
        }
        // NOSONAR  - end skip 
        if(!assetType.value){
            setAssetType({value: "", isValid: false})
            return false
        }else{
            setAssetType({value: assetType.value, isValid: true}) 
        }
        if(instrument.value.length ===0){
          setInstrument({value: [], isValid: false})
            return false
        }else{
          setInstrument({value: instrument.value, isValid: true}) 
        }
        if(!LimitRef.current.value){
            setLimitval({value: "", isValid: false})
            return false
        }else{
          // NOSONAR  -  skip
            if(LimitRef.current.value.toString().length > 12 || LimitRef.current.value < 0){// NOSONAR
              setLimitval({value: "", isValid: false})
              return false
            }else{
              setLimitval({value: LimitRef.current.value, isValid: true}) 
            }
            
        } 

        let LimitDuration = LimitTimeRef.current.inputElement.value 
        if(LimitDuration){
          let timeval =LimitDuration.split(":")
          // console.log(timeval[1].length,"timeval[0]")
          if((timeval[0] == 0 && timeval[1] == 0 && timeval[2] == 0) || (timeval[0] == '__' || timeval[1] == '__' || timeval[2] == '__') || (timeval[0].replace('_','').length < 2 || timeval[1].replace('_','').length < 2 || timeval[2].replace('_','').length < 2) ){
            setDurationMsg('Please enter a valid numeric duration in days:hh:mm format')
            return false
          }else{
            setDurationMsg('')
          }
          if(Number(timeval[1]) > 23){
            setDurationMsg('Please enter a valid hour value between 00 and 23.')
            return false
          }else{
            setDurationMsg('')
          }
        }else{
          // NOSONAR  -  skip
          if(!LimitDuration){// NOSONAR
            setDurationMsg('Please enter a valid numeric duration in days:hh:mm format')
            return false
          }else{
            setDurationMsg('')  
          }
          
        }

        if(Toolarr.length>0){
          setSnackMessage(ToolNameRef.current.value +' already exist')
          setSnackDesc("Please enter a unique name.")
          setSnackType("warning")
          setOpenSnack(true)
          return false
        }
        // NOSONAR  -  skip
        if(Instarr.length>0){
          setSnackMessage('Instrument already assigned to another tool.')
          setSnackDesc('Please select a different instrument.')
          setSnackType("warning")
          setOpenSnack(true)
          return false
        }
// NOSONAR  -  skip
        if(props.dialogMode === 'create'){// NOSONAR
          setLoading(true)
          getAddToolLife(ToolNameRef.current.value,assetType.value,instrument.value,LimitRef.current.value,currUser.id,headPlant.id, LimitDuration ? LimitDuration:null)// NOSONAR
        }else{
          setLoading(true)
          getUpdateTool(ToolID,ToolNameRef.current.value,assetType.value,instrument.value,LimitRef.current.value,currUser.id,resetTime,LimitDuration ? LimitDuration:null)// NOSONAR
        }  
    }

    function deleteToolLife(){
      getDeleteToolLife(DeleteID)
    }

    function BtnTextFnc(){
      // NOSONAR  -  skip
      if(props.dialogMode === 'create') {// NOSONAR
        return t('Save')
      }else if(props.dialogMode === 'edit'){// NOSONAR
        return t('Update')
      }else{
        return t('Delete')
      }
    }
// NOSONAR  -  start skip
    let Title = (props.dialogMode === 'delete') ? 'Delete' : 'Update'// NOSONAR
    return (
        <React.Fragment>
            <ModalHeaderNDL>
                <TypographyNDL value={(props.dialogMode === 'create' ? 'Add' : Title) + ' Tool'} variant='heading-02-xs'  />
            </ModalHeaderNDL>

            <ModalContentNDL>
              {props.dialogMode === 'delete' ?
                <TypographyNDL variant="paragraph-s" color="secondary" value={<React.Fragment>{t('Do you really want to delete the Tool') + t('TheLine') + headPlant.name + t('NotReversible')} <br></br> <TypographyNDL style={{paddingTop:'12px'}} value={"Note: Tool Life Dashboard data will be deleted permanently."}  variant={'paragraph-xs'} color="danger" /></React.Fragment>}  />
                :
                <Grid container spacing={3}>
                <Grid item xs={12}>
                  <InputFieldNDL
                    label={"Name"}
                    inputRef={ToolNameRef}
                    mandatory
                    placeholder={t("Enter Tool Name")}
                    error={!ToolName.isValid ? true : false}// NOSONAR
                    helperText={!ToolName.isValid ? t('Enter ToolName') : ""}
                    //   onChange={handletoolNameChange}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <SelectBox
                    labelId="asset-type-label"
                    mandatory
                    label={('AssetType')}
                    id="asset-type-id"
                    auto={true}
                    multiple={false}
                    options={props.AssetTypeData ? props.AssetTypeData : []}// NOSONAR
                    isMArray={true}
                    checkbox={false}
                    value={assetType.value}
                    onChange={handleAssetTypeChange}
                    keyValue="name"
                    keyId="id"
                    error={!assetType.isValid ? true : false}// NOSONAR
                    msg={t('PlsSelectAsset')}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <SelectBox
                    id="instruments-List"
                    mandatory
                    label={t('Instruments')}
                    edit={true}
                    disableCloseOnSelect={true}
                    auto={true}
                    options={instruments}
                    isMArray={true}
                    keyValue={"name"}
                    keyId={"id"}
                    // multiple={true}
                    onChange={(option) => handleInstrumentsListChange(option)}
                    value={(instrument.value && instrument.value.length>0) ? instrument.value[0].id : ''}
                    error={!instrument.isValid ? true : false}// NOSONAR
                    msg={"Please select at least one instrument to proceed."}
                  />
                </Grid>

                <Grid item xs={12}>
                  <InputFieldNDL
                    label={"Limit"}
                    inputRef={LimitRef}
                    mandatory
                    placeholder={t("Enter Limit")}
                    type={'number'}
                    error={!Limitval.isValid ? true : false}// NOSONAR
                    helperText={!Limitval.isValid && Limitval.value.toString() === "" ? t('Please enter a valid numeric value not exceeding 12 characters') : ""}
                    // onChange={handletoolNameChange}
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <div className='mb-0.5'>
                    <div className="flex items-center">
                    <TypographyNDL  variant="paragraph-xs" color="primary"  value={t("Limit Duration")} />
                    <span style={{ color: 'red' }}>*</span>
                    </div>
                   
                    </div>
                    <div>
                    <MaskedInput
                        //{...other}
                        // ref={ref => {
                        //   inputRef(ref ? ref.inputElement : null);
                        // }}
                        mask={[
                          ///[0-2]/,
                          //this.checkHours(other.value),
                          //":",
                          /[0-9]/,//NOSONAR
                          /\d/,
                          ":",
                          /[0-2]/,
                          /[0-3]/,
                          ":",
                          /[0-5]/,
                          /\d/
                        ]}//NOSONAR
                        className={"maskedInput"}
                        ref={LimitTimeRef}
                        // value={defaultFormatTime(micStopFromTime)}
                        defaultValue={'01:00:00'}
                        placeholder={'DD:HH:MM'}
                        // onBlur={assignMicStopFrom}
                        helperText={"Format: DD:HH:MM (e.g., 10:10:25). Max allowed: 99:23:59"}
                      ></MaskedInput>
                     
                    </div>
                  </Grid>
                </Grid>
              }
              
            </ModalContentNDL>

            <ModalFooterNDL>
              <Button type={"secondary"} style={{width:"80px"}}  value={ t('Cancel')} onClick={() => handleToolDialogClose()}/>
              <Button type={"primary"} danger={props.dialogMode === 'delete' ? true: false} style={{width:"80px"}} loading={Load} value={BtnTextFnc()} onClick={() => props.dialogMode === 'delete' ? deleteToolLife():saveToolLife()}/>
 
            </ModalFooterNDL>
        </React.Fragment >
    )
// NOSONAR  - end skip
})
export default Newtool;