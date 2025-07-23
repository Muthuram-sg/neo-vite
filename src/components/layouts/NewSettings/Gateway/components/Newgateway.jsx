import React, { useEffect, useState, useRef } from "react";
import Grid from 'components/Core/GridNDL'
import InputFieldNDL from "components/Core/InputFieldNDL";
import Button from "components/Core/ButtonNDL";
import { useTranslation } from 'react-i18next';
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import { user, snackToggle, snackMessage, snackType } from 'recoilStore/atoms';
import { useRecoilState } from "recoil";
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import useGetInstrumentList from "../hooks/useGetOnlineInstrument";
import useCreateGateWay from "../hooks/useCreateGateWay";
import useUpdateGateWay from "../hooks/useUpdateGateWay";
import useDeleteGateWay from "../hooks/useDeleteGateWay";
// NOSONAR - This function requires multiple parameters due to its specific use case.
export default function NewGateway(props) {// NOSONAR -  skip this line
    const { t } = useTranslation();
    const [currUser] = useRecoilState(user);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [InstrumentList, setInstrumentList] = useState([]);
    const [Instrumentid, setInstrumentId] = useState([]);// NOSONAR -  skip this line
    const [editId, seteditId] = useState('')
    const GatewayId = useRef()
    const GatewayName = useRef()
    const GatewayIp = useRef()
    const Location = useRef()
    const endPointUrl = useRef()
    const { InstrumentListLoading, InstrumentListData, InstrumentListError, getOnlineInstrumentList } = useGetInstrumentList();
    const { CreateGateWayLoading, CreateGateWayData, CreateGateWayError, getCreateGateWay } = useCreateGateWay();
    const { UpdateGateWayLoading, UpdateGateWayData, UpdateGateWayError, getUpdateGateWay } = useUpdateGateWay()
    const { DeleteGateWayLoading, DeleteGateWayData, DeleteGateWayError, getDeleteGateWay } = useDeleteGateWay()
    const [, setIpAddress] = useState('');// NOSONAR -  skip this line
    const [, setIsValidIp] = useState(true);// NOSONAR -  skip this line
    const [, setIsGatewayIdInvalid] = useState(false);// NOSONAR -  skip this line
    const [GatewayidError, setGatewayidError] = useState('');
    const [GatewaynameError, setGatewaynameError] = useState('');
    const [GatewayipError, setGatewayipError] = useState('');
    const [gatewayIdcheck, setGatewayId] = useState('');// NOSONAR -  skip this line
const [gatewayNamecheck, setGatewayName] = useState('');// NOSONAR -  skip this line
const [gatewayIpcheck, setGatewayIp] = useState('');// NOSONAR -  skip this line
const [, setSelectedInstruments] = useState([]);// NOSONAR -  skip this line
const [GateWayInstrument,setGateWayInstrument] = useState('')
const [AvailableInstrument,setAvailableInstrument] = useState([])
  

    useEffect(() => {
        getOnlineInstrumentList(props.headPlant.id);// NOSONAR -  skip this line

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.headPlant])// NOSONAR -  skip this line
    useEffect(() => {
        if (props.dialogMode === "edit") {// NOSONAR -  skip this line
            if (props.editValue) {// NOSONAR -  skip this line
                // console.log(props.editValue,"props.editValue")
               
                seteditId(props.editValue.id)// NOSONAR -  skip this line
                setGatewayId(props.editValue.iid)// NOSONAR -  skip this line
                setGatewayName( props.editValue.name)// NOSONAR -  skip this line
                setGatewayIp(props.editValue.ip_address)// NOSONAR -  skip this line
                setTimeout(() => {
                    if (GatewayId.current) {
                        GatewayId.current.value = props.editValue.iid// NOSONAR -  skip this line
                    }
                    if (GatewayName.current) {
                        GatewayName.current.value = props.editValue.name// NOSONAR -  skip this line
                    }
                    if (GatewayIp.current) {
                        GatewayIp.current.value = props.editValue.ip_address// NOSONAR -  skip this line
                    }
                    if (Location.current) {
                        Location.current.value = props.editValue.location// NOSONAR -  skip this line
                    }
                    if(endPointUrl.current){
                        endPointUrl.current.value = props.editValue.end_point_url// NOSONAR -  skip this line
                    }

                }, 200)
                if (props.editValue.instrument_id && props.editValue.instrument_id.length > 0) {// NOSONAR -  skip this line
                    setInstrumentId(props.editValue.instrument_id)// NOSONAR -  skip this line
                }
                if(props.editValue.gateway_instrument){// NOSONAR -  skip this line
                setGateWayInstrument(props.editValue.gateway_instrument)// NOSONAR -  skip this line
                }

            }
        } else if (props.dialogMode === "delete") {// NOSONAR -  skip this line
            seteditId(props.editValue.id)// NOSONAR -  skip this line

        } else {
            setTimeout(() => {
                if (GatewayId.current) {
                    GatewayId.current.value = ""
                }
                if (GatewayName.current) {
                    GatewayName.current.value = ""
                }
                if (GatewayIp.current) {
                    GatewayIp.current.value = ""
                }
                if (Location.current) {
                    Location.current.value = ""
                }

            }, 200)
        }
    }, [props.GatewayDialog])// NOSONAR -  skip this line

    const handleDialogClosefn = () => {
        props.handleDialogClose();// NOSONAR -  skip this line
        setGatewayidError("");
        setGatewaynameError("");
        setGatewayipError("");
    }
    
    useEffect(() => {
        if (!CreateGateWayLoading && CreateGateWayData && !CreateGateWayError) {
            setOpenSnack(true)
            SetMessage(t("GateWay Created Successfully"))
            SetType("success")
            props.handleDialogClose()// NOSONAR -  skip this line
            props.triggerTableData()// NOSONAR -  skip this line

        }

    }, [CreateGateWayLoading, CreateGateWayData, CreateGateWayError])
    useEffect(() => {
        if (!UpdateGateWayLoading && UpdateGateWayData && !UpdateGateWayError) {
            setOpenSnack(true)
            SetMessage(t("GateWay Updated Successfully"))
            SetType("success")
            props.handleDialogClose()// NOSONAR -  skip this line
            props.triggerTableData()// NOSONAR -  skip this line

        }

    }, [UpdateGateWayLoading, UpdateGateWayData, UpdateGateWayError])

    useEffect(() => {
        console.log(DeleteGateWayData,'DeleteGateWayData')
        if (!DeleteGateWayLoading && DeleteGateWayData && !DeleteGateWayError) {
            setOpenSnack(true)
            SetMessage(t("GateWay Deleted Successfully"))
            SetType("success")
            props.handleDialogClose()// NOSONAR -  skip this line
            props.triggerTableData()// NOSONAR -  skip this line
        }
        else if(DeleteGateWayData === "error"){
            setOpenSnack(true)
            SetMessage(t("The gateway cannot be deleted because a connectivity alert associated with it is currently active."))
            SetType("error")
        props.handleDialogClose()// NOSONAR -  skip this line
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DeleteGateWayLoading, DeleteGateWayData, DeleteGateWayError])
   
    useEffect(() => {
        if (!InstrumentListLoading && InstrumentListData && !InstrumentListError) {

            setInstrumentList(InstrumentListData)
        }
    }, [InstrumentListLoading, InstrumentListData, InstrumentListError])


    useEffect(()=>{

        if(InstrumentList.length > 0){
            let Instrumentarray = [... new Set([].concat(...props.Instrumentarray))]     // NOSONAR -  skip this line  
       
            let availableInstruments = []
           
            if(Instrumentarray.length > 0){
             availableInstruments = InstrumentList.filter(item => {
                    return !Instrumentarray.includes(item.id);
                });
            }else{
                availableInstruments = InstrumentList
            }
            
            if(Instrumentid && props.dialogMode === "edit"){// NOSONAR -  skip this line
                availableInstruments = [...availableInstruments,...Instrumentid]
            }
            setAvailableInstrument(availableInstruments);
        }

    },[InstrumentList])

    const handleInstruments = (e, data) => {
        
        setInstrumentId(e)
        setSelectedInstruments(e);
       

    }
    const GateWayhandleInstruments = (e) => {
        setGateWayInstrument(e.target.value)
    }

    const handleGatewayIdChange = (e) => {
       
        const isDuplicate = checkForDuplicates();
        if (isDuplicate) {
            setIsGatewayIdInvalid(isDuplicate);
            setGatewayidError(t('GatewayId already exist'));
                             }
                             else{
                                setGatewayidError("")     
                             }
    }

    const handleGatewayNameChange = (e) => {
       
        const isDuplicate = checkForDuplicates();
        if (isDuplicate) {
            setGatewaynameError(t('GatewayName already exist'));
                   }
                   else
                   {
                    setGatewaynameError("")
                   }
              
        
    }

    const handleGatewayIpChange = (e) => {

        const isDuplicate = checkForDuplicates();
        
        if (isDuplicate) {
            setGatewayipError(t('GatewayIp already exist'));
        
                    }
                    else{
                        setGatewayipError("") 
                    }
        
    }

    const checkForDuplicates = () => {

        const existingGateways = props.GateWayData || [];   // NOSONAR -  skip this line  
        const isDuplicateId = existingGateways.some(gateway => gateway.iid === GatewayId.current.value);
        const isDuplicateName = existingGateways.some(gateway => gateway.name === GatewayName.current.value);
        const isDuplicateIp = existingGateways.some(gateway => gateway.ip_address === GatewayIp.current.value);
        return isDuplicateId || isDuplicateName || isDuplicateIp;
    }

    const checkvalidipaddress = () => {
        const ipAddressdata = GatewayIp.current.value;  
        setIpAddress(ipAddressdata);
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        const isValid = ipRegex.test(ipAddressdata);
      
        setIsValidIp(isValid);
        return isValid
           
           }

    const saveGateWay = () => {

        const validip = checkvalidipaddress();
       
        if (GatewayId.current.value === '') {
          
          setGatewayidError(t('Please enter a GatewayId'))
          return false;
        }
        else if (GatewayName.current.value === '') {
            setGatewaynameError(t('Please enter a Gatewayname'))
            return false;
          }
        else if (GatewayIp.current.value === '') {
            setGatewayipError(t('Please enter a GatewayIp'))
            return false;
          }else if(!validip) {
                setGatewayipError(t('Invalid ip address'));
                return false;
            }
         
          
          setGatewayidError("");
          setGatewaynameError("");
          setGatewayipError("");
     
          let body = {
            
            iid:GatewayId.current.value,
            ip_address: GatewayIp.current.value,
            line_id: props.headPlant.id,// NOSONAR -  skip this line
            name: GatewayName.current.value,
            created_by: currUser.id,
            location: Location.current.value,
            instrument_id: Instrumentid,
            gateway_instrument:GateWayInstrument,
            end_point_url:endPointUrl.current.value

        }
       
        getCreateGateWay(body)

       
    }
    const updateGateWay = () => {
        const validip = checkvalidipaddress();

   let someGateWayId =[]
   let someGateWayName =[]
   let someGateWayIP =[]



        if (GatewayId.current.value === '') {
          
            setGatewayidError(t('Please enter a GatewayId'))
            return false;
          }
         if (GatewayName.current.value === '') {
              setGatewaynameError(t('Please enter a Gatewayname'))
              return false;
            }
        if (GatewayIp.current.value === '') {
              setGatewayipError(t('Please enter a GatewayIp'))
              return false;
            }
             if(!validip) {
                setGatewayipError(t('Invalid ip address'));
                return false;
            }
            // NOSONAR START -  skip this line
            if(props.GateWayData && props.GateWayData.length ){// NOSONAR -  skip this line
                if(gatewayIdcheck !== GatewayId.current.value ){// NOSONAR -  skip this line
                     someGateWayId = props.GateWayData.filter(x=>x.iid === GatewayId.current.value)// NOSONAR 
                }
                if(gatewayNamecheck !== GatewayName.current.value){
                    someGateWayName = props.GateWayData.filter(x=>x.name ===  GatewayName.current.value)// NOSONAR 

                }
                if(gatewayIpcheck !== GatewayIp.current.value){
                    someGateWayIP = props.GateWayData.filter(x=>x.ip_address === GatewayIp.current.value)// NOSONAR 

                }

            }// NOSONAR END -  skip this line

            if(someGateWayId.length > 0 ){
                setOpenSnack(true)
                SetMessage(t('Gate way ID already Exist'));
                SetType('warning');
                return false;
            }
            if(someGateWayName.length > 0){
                setOpenSnack(true)
                SetMessage(t('Gate way Name already Exist'));
                SetType('warning');
                return false;
            }
           
            if(someGateWayIP.length > 0 ){
                setOpenSnack(true)
                SetMessage(t('Gate way IP already Exist'));
                SetType('warning');
                return false;
            }
            
        let body = {
            id: editId,
            iid: GatewayId.current.value,
            ip_address: GatewayIp.current.value,
            line_id: props.headPlant.id,// NOSONAR 
            name: GatewayName.current.value,
            updated_by: currUser.id,
            location: Location.current.value,
            instrument_id: Instrumentid,
            gateway_instrument:GateWayInstrument,
            end_point_url:endPointUrl.current.value
        }
        getUpdateGateWay(body)
    }

    const DeleteGateWay = () => {
        getDeleteGateWay(editId)
    }

    let title;

        if (props.dialogMode === "delete") {// NOSONAR 
        title = "Delete Gateway";
        } else if (props.dialogMode === "edit") {// NOSONAR 
        title = "Edit GateWay";
        } else {
        title = t("Add Gateway");
        }
        const handleChange1 = props.dialogMode === "edit" ? undefined : handleGatewayIdChange;// NOSONAR 
        let helperText1=GatewayidError ? GatewayidError : undefined// NOSONAR 
        let err1=GatewayidError ? true : false// NOSONAR 
        const handleChange2=props.dialogMode === "edit"? undefined: handleGatewayNameChange// NOSONAR 
        let helperText2=GatewaynameError ? GatewaynameError : undefined// NOSONAR 
        let err2=GatewaynameError ? true : false// NOSONAR 
        const handleChange3=props.dialogMode === "edit"? undefined: handleGatewayIpChange// NOSONAR 
        let helperText3=GatewayipError ? GatewayipError : undefined// NOSONAR 
        let err3=GatewayipError ? true : false// NOSONAR 
        const buttonLabel = props.dialogMode === "edit" ? "Update" : t('Save');// NOSONAR 
        const onClickHandler = props.dialogMode === "edit" ? updateGateWay : saveGateWay;// NOSONAR 

        // console.log(AvailableInstrument,'AvailableInstrument')

    return (
        <React.Fragment>
            <ModalHeaderNDL>
                <TypographyNDL variant="heading-02-xs" model value={title} />
                {/* <TypographyNDL variant="paragraph-xs" color="tertiary" value={t("Personalize your factory's identity, location, and business hierarchy ")} />            */}
         {/* <div className="float-right">
         <Close  onClick={()=>{props.handleDialogClose()}} />
         </div> */}
               

            </ModalHeaderNDL>
            <ModalContentNDL>
                {props.dialogMode === "delete" ?
                    <React.Fragment>
                        <TypographyNDL variant="paragraph-xs" color='secondary' value={`${t('The Following GateWay')} ${props.editValue.iid} ${t('will be Deleted and Not Reversible')}`} />
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <Grid container spacing={3}>
                            <Grid item lg={12}>
                                <InputFieldNDL
                                    id={"gateway-id"}
                                    label={t("Gateway Id")}
                                    placeholder={t("Gateway Id")}
                                    size={"small"}
                                    inputRef={GatewayId}
                                    onChange={handleChange1}
                                    helperText={helperText1}
                                    error={err1}
                                    mandatory
                                 
                                />
                            </Grid>
                            <Grid item lg={12}>
                                <InputFieldNDL
                                    id={"name"}
                                    label={t("Gateway Name")}
                                    placeholder={t("Name")}
                                    size={"small"}
                                    inputRef={GatewayName}
                                    onChange={handleChange2}
                                    helperText={helperText2}
                                    error={err2}
                                    mandatory

                                />
                            </Grid>

                            <Grid item lg={12}>
                                <InputFieldNDL
                                    id={"ip"}
                                    label={t("IPAddress")}
                                    placeholder={t("IPAddress")}
                                    size={"small"}
                                    // value={ipAddress}
                                    inputRef={GatewayIp}
                                    onChange={handleChange3}
                                    helperText={helperText3}
                                    error={err3}
                                    mandatory

                                />
                                    </Grid>
                                    <Grid item lg={12}>
                                <SelectBox
                                    id="combo-box-demo"
                                    label={t("Gateway Instrument")}
                                    edit={true}
                                    auto={true}
                                    options={AvailableInstrument.length > 0 ? AvailableInstrument : []}
                                    isMArray={true}
                                    keyValue={"name"}
                                    keyId={"id"}
                                    value={GateWayInstrument}
                                    multiple={false}
                                    onChange={(options) => GateWayhandleInstruments(options)}
                                    mandatory

                                />
                            </Grid>

                            <Grid item lg={12}>
                                <InputFieldNDL
                                    id={"Location"}
                                    label={"Location"}
                                    placeholder={t("Location")}
                                    size={"small"}
                                    // defaultValue={expectedenergy}
                                    inputRef={Location}
                                    required={true}
                                    mandatory

                                />
                            </Grid>
                            <Grid item lg={12}>
                                <SelectBox
                                    id="combo-box-demo"
                                    label={t("Instruments")}
                                    edit={true}
                                    auto={true}
                                    options={AvailableInstrument.length > 0 ? AvailableInstrument : []}
                                    isMArray={true}
                                    keyValue={"name"}
                                    keyId={"id"}
                                    value={Instrumentid}
                                    multiple={true}
                                    onChange={(options) => handleInstruments(options)}
                                    mandatory

                                />
                            </Grid>
                            <Grid item lg={12}>
                                <InputFieldNDL
                                    id={"End Point URL"}
                                    label={"End Point URL"}
                                    placeholder={t("URL")}
                                    size={"small"}
                                    // defaultValue={expectedenergy}
                                    inputRef={endPointUrl}
                                    mandatory
                                />
                            </Grid>
                           
                        </Grid>



                    </React.Fragment>

                }
            </ModalContentNDL>
            <ModalFooterNDL>


                {
                    props.dialogMode === "delete" ?
                        <React.Fragment>
                            <Button type="secondary" value={t('Cancel')}  onClick={() => handleDialogClosefn()} />

                            <Button type="primary" danger value={t("Delete")} 
                                onClick={DeleteGateWay}
                            />
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <Button type="secondary" value={t('Cancel')}  onClick={() => handleDialogClosefn()} />

                            <Button type="primary" value={buttonLabel} 
                                onClick={onClickHandler}
                            />
                        </React.Fragment>
                }

            </ModalFooterNDL>
        </React.Fragment >
    )
            }

