import React, { useEffect, useState, useRef } from "react";
import Grid from 'components/Core/GridNDL' 
import CustomSwitch from 'components/Core/CustomSwitch/CustomSwitchNDL';
import InputFieldNDL from "components/Core/InputFieldNDL";
import Button from "components/Core/ButtonNDL";
import { useTranslation } from 'react-i18next';
import MaskedInput from "components/Core/MaskedInput/MaskedInputNDL";
import moment from "moment"; 
import KeyboardArrowDownIcon from 'assets/neo_icons/Arrows/Arrowdown.svg?react';
import KeyboardArrowUpIcon from 'assets/neo_icons/Arrows/Arrowup.svg?react';
import useGetTheme from 'TailwindTheme'; 
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import useProductUnit from 'Hooks/useGetProductUnit';
import useDryerCount from "../hooks/useGetDryerCount";
import { selectedPlant,themeMode } from 'recoilStore/atoms';
import { useRecoilState } from "recoil"; 
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 


export default function Addproduct(props) {
    const { t } = useTranslation();
    const theme = useGetTheme();
    const [curTheme]=useRecoilState(themeMode)
    const classes = {

        maskedInput: {
            fontSize: "14px",
            fontFamily: "Inter",
            fontWeight: "400",
            padding: "6px 0px 6px 6px",
            width: "95%",
            border: "2px solid " + theme.colorPalette.backGround,
            borderRadius: "4px",
            margin: "0",
            display: "block",
            minWidth: "0",
            background: theme.colorPalette.backGround,
            boxSizing: "content-box",
            "&:focus": {
                border: "2px solid " + theme.colorPalette.blue,
                background: theme.palette.background.default,
            },
            "&:focus-visible": {
                outline: "none",
            },
            "&:active": {
                border: "2px solid " + theme.colorPalette.blue,
                background: theme.palette.background.default,
            }
        },
    
    }
    const [productID, setProductID] = useState('');
    const [isReading, setIsReading] = useState(false);
    const [name, setName] = useState('');
    const [micTime, setMicTime] = useState('')
    const [woID, setWOID] = useState('')
    const productref = useRef();
    const nameref = useRef();
    const micTimeRef = useRef();
    const [BtnLoad,setBtnLoad]= useState(false);
    const [textInputproduct, setTextInputproduct] = useState('')
    const [textInputproductname, setTextInputproductname] = useState('')
    const [textCycleTime, setTextCycleTime] = useState('')
    const [micTimeValid, setMicTimeValid] = useState(true);
    const [expectedenergy, setExpectedEnergy] = useState('')
    const [accordionOpen,setAccordionOpen] = useState(true);
    const [cycleUnit,setCycleUnit] = useState('');
    const [energyUnit,setEnergyUnit] = useState('');
    const [moistureInUnit] = useState(53);
    const [moistureOutUnit] = useState(53);
    const [headPlant] = useRecoilState(selectedPlant);
    const [isCycleStd,setisCycleStd] = useState(false);
    const [isMicroStop,setisMicroStop] = useState(false);
    const [ isRunningTime,setisRunningTime] = useState(false);
    const [micStopFromTime, setMicStopFromTime] = useState(30);
    const [micStopToTime, setMicStopToTime] = useState(120);
    const [micStopFromTimeValid, setMicStopFromTimeValid] = useState(true);
    const [micStopToTimeValid, setMicStopToTimeValid] = useState(true);
    const { ProductUnitsLoading, ProductUnitsData, ProductUnitsError, getProductUnit } = useProductUnit();
    const { DryerCountLoading, DryerCountData, DryerCountError, getDryerCount } = useDryerCount();
    const energypersqmtref = useRef()
    const moistureInRef = useRef();
    const moistureOutRef = useRef();
    const micStopFromTimeRef = useRef();
    const micStopToTimeRef = useRef();
   
    useEffect(() => {
        
        if (props.Editedvalue) {
            setTextInputproduct("")
            setTextInputproductname("")
            setWOID(props.Editedvalue.id); 
            setTimeout(() => {
                setProductID(props.Editedvalue.product_id);
                setIsReading(props.Editedvalue?.is_micro_stop)
                setMicStopFromTime(props.Editedvalue?.mic_stop_from_time || 0)
                setMicStopToTime(props.Editedvalue?.mic_stop_to_time || '')
                if (productref.current) {
                  productref.current.value = props.Editedvalue.product_id ? props.Editedvalue.product_id : '';
                }
              
                if (nameref.current) {
                  nameref.current.value = props.Editedvalue.name;
                }
              
                if (energypersqmtref.current) {
                  energypersqmtref.current.value = props.Editedvalue.expected_energy ? props.Editedvalue.expected_energy : '0';
                }
              }, 200);
            
            setName(props.Editedvalue.name);
            var reverse = moment.utc((3600 / props.Editedvalue.unit) * 1000).format('HH:mm:ss:SSS');
            setMicTime(reverse);
            setMicTimeValid(true);
            setExpectedEnergy(props.Editedvalue.expected_energy ? props.Editedvalue.expected_energy : "0");
            setTimeout(()=>{
                if(moistureInRef && moistureInRef.current){
                    moistureInRef.current.value = props.Editedvalue && props.Editedvalue.moisture_in?props.Editedvalue.moisture_in:0;
                }
                if(moistureOutRef && moistureOutRef.current){
                    moistureOutRef.current.value = props.Editedvalue && props.Editedvalue.moisture_out?props.Editedvalue.moisture_out:0;
                }
                
            },1000)
            setCycleUnit(props.Editedvalue.cycle_time_unit?props.Editedvalue.cycle_time_unit:53);
            setEnergyUnit(props.Editedvalue.expected_energy_unit?props.Editedvalue.expected_energy_unit:53);
        } else {
            setWOID("");
            setProductID("");
            setName("");
            setMicTime("")
            setTextInputproduct("")
            setTextInputproductname("")
            setMicTimeValid(true)
            setExpectedEnergy("0")
            setCycleUnit(53);
            setEnergyUnit(53);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.Editedvalue])

    useEffect(()=>{
        getProductUnit();
        getDryerCount(headPlant.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[headPlant])     
    const getSeconds = (time) => {
        var ts = time.split(':');
        return Date.UTC(1970, 0, 1, ts[0], ts[1], ts[2],ts[3]) / 1000;
    }

    const handleDialogClosefn = () => {
        props.handleDialogClose();
        setWOID("");
        setProductID("");
        setName("");
        setMicTime("")
        setMicTimeValid(true)
        setExpectedEnergy("")

        
    }

    const createOrderfn = () => {
        const microTime = 3600 / getSeconds(micTimeRef.current.textMaskInputElement.state.previousConformedValue) 
      
        if (productref.current.value !== "" && nameref.current.value !== "" &&   !isNaN(microTime) && isFinite(microTime)) {
                if(props.dialogMode === "create"){
                    setBtnLoad(true)
                    props.createOrder({ "productID": productref.current.value, "name": nameref.current.value, "unit": microTime.toString(), "expected_energy": energypersqmtref.current.value  ?  energypersqmtref.current.value : 0,moistureIn: moistureInRef && moistureInRef.current && moistureInRef.current.value?moistureInRef.current.value:0,moistureOut: moistureOutRef && moistureOutRef.current && moistureOutRef.current.value?moistureOutRef.current.value:0 ,cycleUnit: cycleUnit,energyUnit: energyUnit,moistureInUnit:moistureInUnit,moistureOutUnit: moistureOutUnit, isMicroStop: isReading, micStopFromTime: micStopFromTime, micStopToTime: micStopToTime});
                }else{
                    setBtnLoad(true)    
                    props.updateOrder({ 
                        "WOID": woID, 
                        "productID": productref.current.value, 
                        "name": nameref.current.value, 
                        "unit": microTime.toString(), 
                        "expected_energy": energypersqmtref.current.value ?  energypersqmtref.current.value : 0,
                        moistureIn: moistureInRef && moistureInRef.current && moistureInRef.current.value?(moistureInRef.current.value).toString():0,
                        moistureOut: moistureOutRef && moistureOutRef.current && moistureOutRef.current.value?(moistureOutRef.current.value).toString():0,
                        cycleUnit: cycleUnit,
                        energyUnit: energyUnit,
                        moistureInUnit:moistureInUnit,
                        moistureOutUnit: moistureOutUnit, 
                        isMicroStop: isReading, 
                        micStopFromTime: micStopFromTime, 
                        micStopToTime: micStopToTime 
                    });
                }
            
        } else {
            let regex = /^[A-Za-z0-9 ]+/;
            let isValid; 
        
            if (productref.current.value !== '') {
                isValid = regex.test(productref.current.value);
                if (!isValid) {
                    setTextInputproduct(t("Enter Valid Product"));
                    return false;
                }
            }
            if (productref.current.value === "") {
                setTextInputproduct(t("Enter Product"));
                return false;
            } else {
                setTextInputproduct("");
            }

            if(micTimeRef.current.textMaskInputElement.state.previousConformedValue===""){
                setTextCycleTime(t("Enter Cycle Time"));
                return false;   
            }
        
            if (nameref.current.value !== '') {
                isValid = regex.test(nameref.current.value);
                if (!isValid) {
                    setTextInputproductname(t("Enter Valid Name"));
                    return false;
                }
            }
            if (nameref.current.value === "") {
                setTextInputproductname(t("Enter Name"));
                return false;
            } else {
                setTextInputproductname("");
            }
        
            if (isNaN(microTime) || !isFinite(microTime)) {
                setMicTimeValid(false);
            }
        }
        handleDialogClosefn()
        

    }
   
    const deleteorderfn = () => {
        props.deleteselected({ "orderids": props.Editedvalue.prod_orders.map(val => val.id), "product_id": props.Editedvalue.id });
    }
    const handleAccordion = () =>{
        setAccordionOpen(!accordionOpen);
    }
    const handleCycleUnit = (e)=> setCycleUnit(e.target.value);
    const handleEnergyUnit = (e) => setEnergyUnit(e.target.value);
    let title;

            if (props.dialogMode === "delete") {
                title = t("Are you sure want to delete?");
            } else if (props.dialogMode === "create") {
                title = t("Add Product");
            } else {
                title = t("Edit Product");
            }

    let options;

            if (!ProductUnitsLoading && !ProductUnitsError && ProductUnitsData) {
                options = ProductUnitsData;
            } else {
                options = [];
            }   
            
    let iconComponent;

            if (accordionOpen) {
                iconComponent = (
                    <Grid item xs={1}>
                        <KeyboardArrowUpIcon />
                    </Grid>
                );
            } else {
                iconComponent = (
                    <Grid item xs={1}>
                        <KeyboardArrowDownIcon />
                    </Grid>
                );
            } 
            
    let buttonComponent;

            if (props.dialogMode === "create") {
                buttonComponent = (
                    <Button
                        type="primary"
                        value={t('Save')}
                        onClick={() => {createOrderfn(); }} 
                        loading={BtnLoad}
                    />
                );
            } else if (props.dialogMode === "delete") {
                buttonComponent = (
                    <Button
                        type="primary"
                        danger
                        value={t('Delete')}
                        onClick={() => {deleteorderfn(); handleDialogClosefn()}}
                    />
                );
            } else {
                buttonComponent = (
                    <Button
                        type="primary"
                        value={t('Update')}
                        loading={BtnLoad}
                        onClick={() => {createOrderfn(); handleDialogClosefn()}}
                    />
                );
            }
            
            const handlecycle = (e) => {
                setisCycleStd(!isCycleStd); 
            }

            const handleMicro = ()=>{
                setisMicroStop(!isMicroStop)
            }

            const handleDowntime = ()=>{
                setisRunningTime(!isRunningTime)
            }

            const defaultFormatTime = (time) => {
                if (time !== "") {
                    const minutes = parseInt(time / 60);
                    const seconds = parseInt(time % 60);
                
                    const formattedMinutes = (minutes <= 9 ? "0" : "") + minutes;
                    const formattedSeconds = (seconds <= 9 ? "0" : "") + seconds;
                
                    return `${formattedMinutes}:${formattedSeconds}`;
                } else {
                    return "";
                }
            };

            const assignMicStopFrom = async (e) => {
                // alert("1")
                console.log(micStopFromTimeRef.current)
                const microStopFrom = micStopFromTimeRef.current.textMaskInputElement.state.previousConformedValue
                const microStopTo = micStopToTimeRef.current.textMaskInputElement.state.previousConformedValue
              
                if (microStopFrom.toString() !== "") {
            
                  let microStopFromMin =  microStopFrom.split(":")[0] * 60;
                  let microStopFromSec =  microStopFrom.split(":")[1];
                  
                  setMicStopFromTime(parseInt(microStopFromMin) + parseInt(microStopFromSec));
                  setMicStopFromTimeValid(true)
                  if (microStopTo.toString() !== "") {
                    const currDate = new Date();
                    const strFromDate = currDate.toISOString().split('T').shift() + "T00:" + microStopFrom
                    const strToDate = currDate.toISOString().split('T').shift() + "T00:" + microStopTo
                   
            
                    if (new Date(strFromDate).getTime() < new Date(strToDate).getTime()) {
                      setMicStopFromTimeValid(true)
                      setMicStopToTimeValid(true)
            
                    }
                    else {
                      setMicStopFromTimeValid(false)
                      setMicStopToTimeValid(false)
                    }
                  }
                }
                else {
                  setMicStopFromTime("")
                  setMicStopFromTimeValid(true)
                }
              }
            
              
              const assignMicStopTo = async (e) => {
                const microStopFrom = micStopFromTimeRef.current.textMaskInputElement.state.previousConformedValue
                const microStopTo = micStopToTimeRef.current.textMaskInputElement.state.previousConformedValue
            
               
                if (microStopTo.toString() !== "") {
                 
                  let microStopToMin =  microStopTo.split(":")[0] * 60;
                  let microStopToSec =  microStopTo.split(":")[1];
            
                  setMicStopToTime(parseInt(microStopToMin) + parseInt(microStopToSec));
                  setMicStopToTimeValid(true)
            
                  if (microStopFrom.toString() !== "" && microStopTo.toString() !== "") {
                    const currDate = new Date();
                    const strFromDate = currDate.toISOString().split('T').shift() + "T00:" + microStopFrom
                    const strToDate = currDate.toISOString().split('T').shift() + "T00:" + microStopTo
                  
            
                    if (new Date(strFromDate).getTime() < new Date(strToDate).getTime()) {
                      setMicStopFromTimeValid(true)
                      setMicStopToTimeValid(true)
                    }
                    else {
                      setMicStopFromTimeValid(false)
                      setMicStopToTimeValid(false)
                    }
                  }
                }
                else {
                  setMicStopToTime("")
                  setMicStopToTimeValid(true)
                }
              }

            const helperTextCondition1 =
            micStopFromTime.toString() === "" || !micStopFromTimeValid;

            const helperTextMessage1 =
            micStopFromTime.toString() === "" ? t("Please enter time") : t("From Should be lesser than to");

            const helperText1 = helperTextCondition1 ? helperTextMessage1 : "";

            const helperTextCondition2 =
            micStopToTime.toString() === "" || !micStopToTimeValid;

            const helperTextMessage2 =
            micStopToTime.toString() === "" ? t("Please enter time") : t("To Should be greater than from");

            const helperText2 = helperTextCondition2 ? helperTextMessage2 : "";
           
                    
    return (
        <React.Fragment>  
                <ModalHeaderNDL>
                <TypographyNDL  variant="heading-02-xs" color="primary" model value={title}/>
                </ModalHeaderNDL>
                <ModalContentNDL>
                    {props.dialogMode === "delete" ? <TypographyNDL  variant='paragraph-s' color='secondary' value={t("Do you really want to delete the product? This action cannot be undone.")} /> :
                        <React.Fragment> 
                            <Grid container spacing={3}>
                                <Grid item lg={12}>
                                    <InputFieldNDL
                                        id={"product-id"}
                                        label={t("Product ID")}
                                        placeholder={t("Product ID")}
                                        size={"small"}
                                        defaultValue={productID}
                                        inputRef={productref}
                                        error={textInputproduct}
                                        helperText={textInputproduct}
            
                                    />
                                </Grid>

                                <Grid item lg={12}>
                                    <InputFieldNDL
                                        id={"product-name"}
                                        label={t("Name")}
                                        placeholder={t("Name")}
                                        size={"small"}
                                        defaultValue={name}
                                        inputRef={nameref}
                                        error={textInputproductname}
                                        helperText={textInputproductname}
            
                                    /> 
                                </Grid>
                                {/* <Grid item lg={12}>
                                <div className="my-3" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div className="flex flex-col gap-0.5" >
                                    <TypographyNDL variant={"label-01-s"} >{"Configure Standard Cycle Time"}</TypographyNDL>
                                    <TypographyNDL variant={"paragraph-xs"} color='tertiary'>{t("Set the product's standard cycle time, or use the first system default")}</TypographyNDL>
                                    </div>
                                    <CustomSwitch
                                    id={"switch"}
                                    switch={true}
                                    checked={isCycleStd}
                                    onChange={handlecycle}
                                    // primaryLabel="OEE Configurations"
                                    size="small"
                                    />
                                </div>
                                </Grid> */}
                                <Grid item lg={9}> 
                                    <div className="mb-0.5">
                                    <TypographyNDL value="Std.Cycle.Time" variant='paragraph-xs' />
                                    </div>
                                    <MaskedInput 
                                        mask={[
            
                                            /[0-9]/,
                                            /\d/,
                                            ":",
                                            /[0-5]/,
                                            /\d/,
                                            ":",
                                            /[0-9]/,
                                            /\d/,
                                            ":",
                                            /[0-9]/,
                                            /\d/,
                                            /\d/
            
                                        ]}
                                        style={classes.maskedInput}
                                        ref={micTimeRef}
                                        defaultValue={micTime}
                                        error={textCycleTime}
                                        placeholder={'HH:MM:SS:SSS'} 
                                    />
                                {(!micTimeValid) &&
                                    <span style={{ color: "#FF0D00" }}>
                                        {t("Please enter valid cycle time")}
                                    </span>
                                }
                                </Grid>
                                <Grid item lg={3} >
                                    <SelectBox
                                        id="cycletime_unit"
                                        label={t("Unit")}
                                        placeholder={t("Unit")}
                                        edit={true}
                                        disableCloseOnSelect={true}
                                        auto={false}
                                        options={options} 
                                        isMArray={true}
                                        keyValue={"unit"}
                                        keyId={"id"}
                                        multiple={false}
                                        onChange={handleCycleUnit}
                                        value={cycleUnit}
                                    />
                                </Grid>
                                <Grid item lg={9}> 
                                    <InputFieldNDL
                                        type={"number"}
                                        id={"product-energy-per-sqmt"}
                                        label={"Expected Energy"}
                                        placeholder={t("Enter Expected Energy")}
                                        size={"small"}
                                        defaultValue={expectedenergy}
                                        inputRef={energypersqmtref}
            
                                    />
                                </Grid>
                                <Grid item lg={3}>
                                    <SelectBox
                                        id="energy-unit"
                                        label={t("Unit")}
                                        placeholder={"Unit"}
                                        edit={true}
                                        disableCloseOnSelect={true}
                                        auto={false}
                                        options={options} 
                                        isMArray={true}
                                        keyValue={"unit"}
                                        keyId={"id"}
                                        multiple={false}
                                        onChange={handleEnergyUnit}
                                        value={energyUnit}
                                    />
                                </Grid>
                               
                                <Grid item lg={12}>
                                    <div className="my-3" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div className="flex flex-col gap-0.5" >
                                            <TypographyNDL variant={"label-01-s"} >{"Configure Microstop Duration"}</TypographyNDL>
                                            <TypographyNDL variant={"paragraph-xs"} color='tertiary'>Set the microstop duration for the product</TypographyNDL>
                                        </div>
                                        <CustomSwitch
                                          id={"switch"}
                                          switch={true}
                                          checked={isReading}
                                          onChange={() => setIsReading(!isReading)}
                                          // primaryLabel="OEE Configurations"
                                          size="small"
                                        />
                                    </div>                  
                                </Grid>
                                    {/* <Grid container spacing={3}> */}
                                        <Grid item xs={6} sm={6}>
                                            <div style={{ display:isReading ? "block" : "none"}}>
                                                <div className='mb-0.5'>
                                                    <TypographyNDL variant="label-02-s" color="secondary" value={t("From")} />
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
                                                        /[0-5]/,
                                                        /\d/,
                                                        ":",
                                                        /[0-5]/,
                                                        /\d/,
                                                        // ":",
                                                        // /[0-5]/,
                                                        // /\d/
                                                      ]}
                                                      className={"maskedInput"}
                                                      ref={micStopFromTimeRef}
                                                      value={defaultFormatTime(micStopFromTime)}
                                                      defaultValue={defaultFormatTime(micStopFromTime)}
                                                      placeholder={'MM:SS'}
                                                      onBlur={assignMicStopFrom}
                                                      helperText={helperText1}
                                                    ></MaskedInput>
                                                </div>
                                            </div>
                                        </Grid>
                                      
                                        <Grid item xs={6} sm={6}>
                                            <div style={{ display:isReading ? "block" : "none"}}>
                                                <div className='mb-0.5'>
                                                  <TypographyNDL variant="label-02-s" color="secondary" value={t("To")} />
                                                </div>
                                                <MaskedInput
                                                  mask={[
                                                    /[0-5]/,
                                                    /\d/,
                                                    ":",
                                                    /[0-5]/,
                                                    /\d/,
                                                  ]}
                                                  className={"maskedInput"}
                                                  ref={micStopToTimeRef}
                                                  value={defaultFormatTime(micStopToTime)}
                                                  defaultValue={defaultFormatTime(micStopToTime)}
                                                  placeholder={'MM:SS'}
                                                  onBlur={assignMicStopTo}
                                                  helperText={helperText2}
                                                ></MaskedInput>
                                            </div>
                                            {/* </div> */}
                                        </Grid>
                                    {/* </Grid> */}
                             
                            </Grid>
                            {
                                !DryerCountLoading && !DryerCountError && DryerCountData && DryerCountData !==null && DryerCountData > 0 && (
                                    
                                <React.Fragment>
                                    <Grid onClick={handleAccordion} container sm={12} style={{marginTop: 10}}> 
                                    <Grid item xs={11}><TypographyNDL variant="Body2" value={t("Additional Parameters")} /></Grid>
                                    {iconComponent}
                                    </Grid>
                                    {
                                        accordionOpen && (
                                            <Grid container>
                                                <Grid item lg={12}>
                                                    <InputFieldNDL
                                                        type={"number"}
                                                        label={"Expected Moisture In"}
                                                        id={"expected-moisture-in"}
                                                        placeholder={t("Expected Moisture In")}
                                                        size={"small"}  
                                                        inputRef={moistureInRef}
                                                    />
                                                </Grid>
                                                
                                                <Grid item lg={12}>
                                                    <InputFieldNDL
                                                        type={"number"}
                                                        label={"Expected Moisture Out"}
                                                        id={"expected-moisture-out"}
                                                        placeholder={t("Expected Moisture Out")}
                                                        size={"small"}  
                                                        inputRef={moistureOutRef}
                                                    />
                                                </Grid>
                                              
                                            </Grid>
                                        )
                                    }
                                </React.Fragment> 
                                )
                                
                            }                           
    
                        </React.Fragment>}
                </ModalContentNDL>
                <ModalFooterNDL>
                    <Button type="secondary" value={t('Cancel')}  onClick={() => handleDialogClosefn()} />
                    {buttonComponent}
                    
                </ModalFooterNDL> 
        </React.Fragment >
    )
}

