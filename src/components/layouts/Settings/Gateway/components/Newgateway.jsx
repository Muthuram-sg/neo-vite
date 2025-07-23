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

export default function NewGateway(props) {
    const { t } = useTranslation();
    const [currUser] = useRecoilState(user);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [InstrumentList, setInstrumentList] = useState([]);
    const [Instrumentid, setInstrumentId] = useState([]);
    const [editId, seteditId] = useState('')
    const GatewayId = useRef()
    const GatewayName = useRef()
    const GatewayIp = useRef()
    const Location = useRef()
    const { InstrumentListLoading, InstrumentListData, InstrumentListError, getOnlineInstrumentList } = useGetInstrumentList();
    const { CreateGateWayLoading, CreateGateWayData, CreateGateWayError, getCreateGateWay } = useCreateGateWay();
    const { UpdateGateWayLoading, UpdateGateWayData, UpdateGateWayError, getUpdateGateWay } = useUpdateGateWay()
    const { DeleteGateWayLoading, DeleteGateWayData, DeleteGateWayError, getDeleteGateWay } = useDeleteGateWay()
    const [, setIpAddress] = useState('');
    const [, setIsValidIp] = useState(true);
    const [, setIsGatewayIdInvalid] = useState(false);
    const [GatewayidError, setGatewayidError] = useState('');
    const [GatewaynameError, setGatewaynameError] = useState('');
    const [GatewayipError, setGatewayipError] = useState('');
    const [gatewayIdcheck, setGatewayId] = useState('');
const [gatewayNamecheck, setGatewayName] = useState('');
const [gatewayIpcheck, setGatewayIp] = useState('');
const [, setSelectedInstruments] = useState([]);
  

    useEffect(() => {
        getOnlineInstrumentList(props.headPlant.id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.headPlant])
    useEffect(() => {
        if (props.dialogMode === "edit") {
            if (props.editValue) {
               
                seteditId(props.editValue.id)
                setGatewayId(props.editValue.iid)
                setGatewayName( props.editValue.name)
                setGatewayIp(props.editValue.ip_address)
                setTimeout(() => {
                    if (GatewayId.current) {
                        GatewayId.current.value = props.editValue.iid
                    }
                    if (GatewayName.current) {
                        GatewayName.current.value = props.editValue.name
                    }
                    if (GatewayIp.current) {
                        GatewayIp.current.value = props.editValue.ip_address
                    }
                    if (Location.current) {
                        Location.current.value = props.editValue.location
                    }

                }, 200)
                if (props.editValue.instrument_id && props.editValue.instrument_id.length > 0) {
                  
                    setInstrumentId(props.editValue.instrument_id)
                }

            }
        } else if (props.dialogMode === "delete") {
            seteditId(props.editValue.id)

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
    }, [props.GatewayDialog])

    const handleDialogClosefn = () => {
        props.handleDialogClose();
        setGatewayidError("");
        setGatewaynameError("");
        setGatewayipError("");
    }
    
    useEffect(() => {
        if (!CreateGateWayLoading && CreateGateWayData && !CreateGateWayError) {
            setOpenSnack(true)
            SetMessage(t("GateWay Created Successfully"))
            SetType("success")
            props.handleDialogClose()
            props.triggerTableData()

        }

    }, [CreateGateWayLoading, CreateGateWayData, CreateGateWayError])
    useEffect(() => {
        if (!UpdateGateWayLoading && UpdateGateWayData && !UpdateGateWayError) {
            setOpenSnack(true)
            SetMessage(t("GateWay Updated Successfully"))
            SetType("success")
            props.handleDialogClose()
            props.triggerTableData()

        }

    }, [UpdateGateWayLoading, UpdateGateWayData, UpdateGateWayError])

    useEffect(() => {
        if (!DeleteGateWayLoading && DeleteGateWayData && !DeleteGateWayError) {
            setOpenSnack(true)
            SetMessage(t("GateWay Deleted Successfully"))
            SetType("success")
            props.handleDialogClose()
            props.triggerTableData()

        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DeleteGateWayLoading, DeleteGateWayData, DeleteGateWayError])
   
    useEffect(() => {
        if (!InstrumentListLoading && InstrumentListData && !InstrumentListError) {

            setInstrumentList(InstrumentListData)
        }
    }, [InstrumentListLoading, InstrumentListData, InstrumentListError])

    const getAvailableInstruments = () => {

        
        let Instrumentarray = [... new Set([].concat(...props.Instrumentarray))]       
       
        let availableInstruments = []
       
        if(Instrumentarray.length > 0){
         availableInstruments = InstrumentList.filter(item => {
                return !Instrumentarray.includes(item.id);
            });
        }else{
            availableInstruments = InstrumentList
        }
        
        if(Instrumentid && props.dialogMode === "edit"){
            availableInstruments = [...availableInstruments,...Instrumentid]
        }
        return availableInstruments;
    };

    const handleInstruments = (e, data) => {
        
        setInstrumentId(e)
        setSelectedInstruments(e);
       

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

        const existingGateways = props.GateWayData || [];     
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
            line_id: props.headPlant.id,
            name: GatewayName.current.value,
            created_by: currUser.id,
            location: Location.current.value,
            instrument_id: Instrumentid

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
            
            if(props.GateWayData && props.GateWayData.length ){
                if(gatewayIdcheck !== GatewayId.current.value ){
                     someGateWayId = props.GateWayData.filter(x=>x.iid === GatewayId.current.value)
                }
                if(gatewayNamecheck !== GatewayName.current.value){
                    someGateWayName = props.GateWayData.filter(x=>x.name ===  GatewayName.current.value)

                }
                if(gatewayIpcheck !== GatewayIp.current.value){
                    someGateWayIP = props.GateWayData.filter(x=>x.ip_address === GatewayIp.current.value)

                }

            }

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
            line_id: props.headPlant.id,
            name: GatewayName.current.value,
            updated_by: currUser.id,
            location: Location.current.value,
            instrument_id: Instrumentid

        }
        getUpdateGateWay(body)
    }

    const DeleteGateWay = () => {
        getDeleteGateWay(editId)
    }

    let title;

        if (props.dialogMode === "delete") {
        title = "Delete Gateway";
        } else if (props.dialogMode === "edit") {
        title = "Edit GateWay";
        } else {
        title = t("Add Gateway");
        }
        const handleChange1 = props.dialogMode === "edit" ? undefined : handleGatewayIdChange;
        let helperText1=GatewayidError ? GatewayidError : undefined
        let err1=GatewayidError ? true : false
        const handleChange2=props.dialogMode === "edit"? undefined: handleGatewayNameChange
        let helperText2=GatewaynameError ? GatewaynameError : undefined
        let err2=GatewaynameError ? true : false
        const handleChange3=props.dialogMode === "edit"? undefined: handleGatewayIpChange
        let helperText3=GatewayipError ? GatewayipError : undefined
        let err3=GatewayipError ? true : false
        const buttonLabel = props.dialogMode === "edit" ? "Update" : t('Save');
        const onClickHandler = props.dialogMode === "edit" ? updateGateWay : saveGateWay;

    return (
        <React.Fragment>
            <ModalHeaderNDL>
                <TypographyNDL variant="heading-02-xs" model value={title} />
                {/* <TypographyNDL variant="paragraph-xs" color="tertiary" value={t("Personalize your factory's identity, location, and business hierarchy ")} />            */}

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

                                />
                            </Grid>
                            <Grid item lg={12}>
                                <SelectBox
                                    id="combo-box-demo"
                                    label={t("Instruments")}
                                    edit={true}
                                    auto={true}
                                    options={getAvailableInstruments()}
                                    isMArray={true}
                                    keyValue={"name"}
                                    keyId={"id"}
                                    value={Instrumentid}
                                    multiple={true}
                                    onChange={(options) => handleInstruments(options)}

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

