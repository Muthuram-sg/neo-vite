/* eslint-disable array-callback-return */
import React, { useState, useEffect, useImperativeHandle } from "react";
import SelectBox from "components/Core/DropdownList/DropdownListNDL"; 
import { useTranslation } from 'react-i18next';
import Grid from 'components/Core/GridNDL';
import { useRecoilState } from "recoil";
import { user, selectedPlant, snackToggle, snackMessage, snackType,instrumentsList } from "recoilStore/atoms";
import useGetSensorDetails from "components/layouts/Explore/ExploreMain/ExploreTabs/components/FaultHistory/hooks/useGetSensorDetails";
import "components/style/instrument.css";
import InputFieldNDL from "components/Core/InputFieldNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
import BredCrumbsNDL from "components/Core/Bredcrumbs/BredCrumbsNDL";
import Button from "components/Core/ButtonNDL";  
import Checkboxs from 'components/Core/CustomSwitch/CustomSwitchNDL'
import RadioNDL from 'components/Core/RadioButton/RadioButtonNDL';
import useAssetType from 'components/layouts/NewSettings/Node/hooks/useAssetType';
import useAddSensor from './hooks/useAddSensor'
import useUpdateSensor from './hooks/useUpdateSensor'
import useUpdateAllSensor from './hooks/useUpdateAllSensor'
import AccordianNDL1 from "components/Core/Accordian/AccordianNDL1";
import ModalNDL from 'components/Core/ModalNDL'; 
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL' 

const AddSensor = React.forwardRef((props, ref) => {
    const [instruments] = useRecoilState(instrumentsList);
    const [instrument, setInstrument] = useState();
    const [editValue, setEditValue] = useState();
    const [isEdit, setisEdit]= useState(false);
    const [isVfd, setisVfd] = useState(false);
    const [techNumber, setTechNumber] = useState('');
    const [, setisdiabled] = useState(false);
    const [techId, setTechId] = useState('');
    const [applyToAll, setApplyToAll] = useState(false);
    const [techName, setTechName] = useState('');
    const [axis, setAxis] = useState('');
    const [dbName, setDbName] = useState('');
    const [driveEnd, setDriveEnd] = useState('Drive End'); 
    const [OpenModel,setOpenModel] = useState(false)
    const [currUser] = useRecoilState(user);
    const [assetType, setAssetType] = useState(null);
    const [intermediate, setIntermediate] = useState(null);
    const [domain, setDomain] = useState(null);
    const [rpm, setRpm] = useState(0);
    const [minrpm, setMinRpm] = useState(0);//NOSONAR
    
    const [maxrpm, setMaxRpm] = useState(0);//NOSONAR
    const [BPFO, setBPFO] = useState("");
    const [BSF, setBSF] = useState("");
    const [BPFI, setBPFI] = useState("");
    const [FTF, setFTF] = useState("");
    const [VPF, setVPF] = useState("");
    const [BRO, setBRO] = useState("");
    const [GMF1, setGMF1] = useState("");
    const [GMF2, setGMF2] = useState("");
    const [GMF3, setGMF3] = useState("");
    const [GMF4, setGMF4] = useState("");
    const { t } = useTranslation();
    const [headPlant] = useRecoilState(selectedPlant);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [id, setId] = useState("");
    const [accordian1, setAccordian1] = useState(false);
    const [bredCrumbName,setbredCrumbName] = useState('New Instrument')    
    const [formulaDialogMode] = useState('create');
    const [instrumentDialogMode] = useState('instrumentDetails');
    const { AssetTypeLoading, AssetTypeData, AssetTypeError, getAssetType } = useAssetType(); 
    const breadcrump = [{ id: 0, name: 'Manage Instrument' }, { id: 1, name: bredCrumbName }]
    const { AddSensorLoading, AddSensorData, AddSensorError, getAddSensor } = useAddSensor()
    const { EditSensorLoading, EditSensorData, EditSensorError, getEditSensor } = useUpdateSensor()
    const {  sensordetailsdata, getSensorDetails } = useGetSensorDetails()
    const { EditAllSensorLoading, EditAllSensorData, EditAllSensorError, getEditAllSensor } = useUpdateAllSensor()
    const handleActiveIndex = (index) => {
        if (index === 0) {
            props.handlepageChange()//NOSONAR
        }

    }

    useEffect(()=>{
        getAssetType() 
        getSensorDetails(headPlant.id)
    },[headPlant])

    const intermediateOptions = [
        { id: 1, name: 'Coupling' },
        { id: 2, name: 'Pulley' },
        { id: 3, name: 'Nil' }
    ];

    const domainOptions = [
        { id: 1, name: 'condmaster_200' },
        { id: 2, name: 'retina' }
    ];

    const onClose = () => {
        props.handlepageChange()//NOSONAR

    }
    const handleTechNumberChange = (e) => setTechNumber(e.target.value)  
    const handleTechIdChange = (e) => setTechId(e.target.value)
    const handleTechNameChange = (e) => setTechName(e.target.value);
    const handleInstrumentChange = (e) => setInstrument(e.target.value);
    const handleAxisChange = (e) => {
      const value = e.target.value;
      const validAxes = ['X', 'Y', 'Z', 'E']; 
  
      if (!validAxes.includes(value)) {
          SetMessage("Enter valid axis");
          SetType("warning");
          setOpenSnack(true);
      } else {
          SetMessage("");
          SetType("");
          setOpenSnack(false);
      }

      const matchingInstrument = sensordetailsdata?.find(
        (data) => data.iid === instrument && data.axis === value
    );
    if (matchingInstrument) {
        SetMessage("Axis already exists");
        SetType("warning");
        setOpenSnack(true);
    } else {
      setAxis(value);
    }
    
  };  
    const handleDbNameChange = (e) => setDbName(e.target.value);
    const handleRPMChange = (e) => setRpm(e.target.value);
    const handleMaxRPMChange = (e) => setMaxRpm(e.target.value);
    const handleMinRPMChange = (e) => setMinRpm(e.target.value);
    const handleVfdChange = (e) => setisVfd(!isVfd);
    const handleDriveEndChange = (e) => setDriveEnd(e.target.id);
    const handleAssetTypeChange = (e) => setAssetType(e.target.value);
    const handleIntermediateChange = (e) => setIntermediate(e.target.value);
    const handleDomainChange = (e) => setDomain(e.target.value);
    const handleBPFOChange = (e) => {
      setBPFO(e.target.value);
    };
    
    const handleBSFChange = (e) => {
      setBSF(e.target.value);
    };
    
    const handleBPFIChange = (e) => {
      setBPFI(e.target.value);
    };
    
    const handleFTFChange = (e) => {
      setFTF(e.target.value);
    };
    
    const handleVPFChange = (e) => {
      setVPF(e.target.value);
    };
    
    const handleBROChange = (e) => {
      setBRO(e.target.value);
    };
    
    const handleGMF1Change = (e) => {
      setGMF1(e.target.value);
    };
    
    const handleGMF2Change = (e) => {
      setGMF2(e.target.value);
    };
    
    const handleGMF3Change = (e) => {
      setGMF3(e.target.value);
    };
    
    const handleGMF4Change = (e) => {
      setGMF4(e.target.value);
    }; 
    
    let dialogTitle;

    if (instrumentDialogMode === "instrumentDetails") {
      if (formulaDialogMode === "create") {
        dialogTitle = t('Instrument Details ');
      }  else if (formulaDialogMode === "edit") {
        dialogTitle = t('EditInstrument');
      } else {
        dialogTitle = t('DeleteInstrument');
      }
    }

    useImperativeHandle(ref, () =>
        (
            {
              handleEditDialogOpen: (id, value) => {
                setisEdit(true);
                setisdiabled(true);
                setEditValue(value);
                
                const selectedDomain = domainOptions.find((option) => option.name === value.domain);
                const domainid = selectedDomain ? selectedDomain.id : '';
                
                setbredCrumbName("Edit Instrument");
                setInstrument(value.iid);
                setisVfd(value.vfd);
                setTechNumber(value.number);
                setTechId(value.tech_id);
                setTechName(value.tech_name);
                setAxis(value.axis);
                setDbName(value.db_name);
            
               
                const locationString = value.location?.trim() || "";
                
                if (locationString.startsWith("Non-")) {
                  const isDriveEnd = locationString.includes("Drive") ? "Non-Drive End" : "Non-Drive End";//NOSONAR
                  setDriveEnd(isDriveEnd);
                } else {
                  const lastThreeLetters = locationString.slice(-3);
                  const isDriveEnd = lastThreeLetters === "NDE" ? "Non-Drive End" : lastThreeLetters === "DE" ? "Drive End" : null;//NOSONAR
                
                  if (isDriveEnd !== null) {
                    setDriveEnd(isDriveEnd);
                  }
                }
                setId(value.id)
                setAssetType(value.type);
                setIntermediate(value.intermediate);
                setDomain(domainid);
                setRpm(value.rpm);
                setMinRpm(value.min_rpm);
                setMaxRpm(value.max_rpm);
                setBPFO(value.order.BPFO);
                setBPFI(value.order.BPFI);
                setBSF(value.order.BSF);
                setFTF(value.order.FTF);
                setVPF(value.order.VPF);
                setBRO(value.order.BRO);
                setGMF1(value.order.GMF1);
                setGMF2(value.order.GMF2);
                setGMF3(value.order.GMF3);
                setGMF4(value.order.GMF4);
            }                       
    }
        ))

        const handleDialogClose = () => {
          setApplyToAll(false);
          setOpenModel(false);
      };

      const handleApplytoAll = (state) => {
        setOpenModel(false);
        setApplyToAll(state);
        finalizeSave(state);
    };    

    function deepEqual(obj1, obj2) {
      if (obj1 === obj2) return true;
  
      if (typeof obj1 === 'object' && typeof obj2 === 'object' && obj1 !== null && obj2 !== null) {
          const keys1 = Object.keys(obj1);
          const keys2 = Object.keys(obj2);
  
          // If key lengths differ, objects are not equal
          if (keys1.length !== keys2.length) return false;
  
          // Compare each key and its value recursively
          for (const key of keys1) {
              if (!deepEqual(obj1[key], obj2[key])) return false;
          }
  
          return true;
      }
  
      // Primitive value comparison
      return false;
  }
  
  function getUpdatedValues(editValue, currentValue) {
      const updatedValues = {};
  
      for (const key in currentValue) {
          if (typeof currentValue[key] === 'object' && typeof editValue[key] === 'object') {
              // Perform deep comparison for objects
              if (!deepEqual(currentValue[key], editValue[key])) {
                  updatedValues[key] = currentValue[key];
              }
          } else {
              // Simple comparison for primitive values
              if (currentValue[key] !== editValue[key]) {
                  updatedValues[key] = currentValue[key];
              }
          }
      }
  
      return updatedValues;
  }

    const finalizeSave = (currentstate) => {
      const selectedDomain = domainOptions.find((option) => option.id === domain);
      const domainName = selectedDomain ? selectedDomain.name : "";
  
      const json = {
          BPFO,
          BSF,
          BPFI,
          FTF,
          VPF,
          BRO,
          GMF1,
          GMF2,
          GMF3,
          GMF4,
      };
  
      let body = {
          iid: instrument,
          number: techNumber,
          tech_id: techId,
          tech_name: techName,
          axis: axis,
          db_name: dbName,
          vfd: isVfd,
          rpm: rpm || null,
          min_rpm: minrpm || null,
          max_rpm: maxrpm || null,
          location: driveEnd,
          type: assetType,
          intermediate: intermediate,
          domain: domainName,
          order: json,
          updated_by: currUser.id,
          id:id
      };

      let Allbody = {
        iid: instrument,
        db_name: dbName,
        vfd: isVfd,
        rpm: rpm || null,
        min_rpm: minrpm || null,
        max_rpm: maxrpm || null,
        location: driveEnd,
        type: assetType,
        intermediate: intermediate,
        domain: domainName,
        order: json
    };
    const updatedBody = getUpdatedValues(editValue, Allbody);
    updatedBody.iid = instrument;
      if (applyToAll || currentstate) {
       
          getEditAllSensor(updatedBody);
      } else {
          getEditSensor(body);
      }
  };
  
  const handleSave = () => {
    if (!techNumber || !techId || !techName || !dbName || !domain || !instrument) {
        SetMessage("Please fill all the mandatory fields.");
        SetType("warning");
        setOpenSnack(true);
        return;
    }

    const selectedDomain = domainOptions.find((option) => option.id === domain);
    const domainName = selectedDomain ? selectedDomain.name : "";

    const json = {
        BPFO,
        BSF,
        BPFI,
        FTF,
        VPF,
        BRO,
        GMF1,
        GMF2,
        GMF3,
        GMF4,
    };

    if(isEdit){
    const hasChanges =
        editValue.tech_id !== techId ||
        editValue.number !== techNumber ||
        editValue.axis !== axis;
        
        if (
          !hasChanges &&
          sensordetailsdata &&
          sensordetailsdata.length > 1 &&
          sensordetailsdata.filter((sensor) => sensor.iid === editValue.iid).length > 1
        ) {
          setOpenModel(true);
        } else {
          handleApplytoAll(false);
        }
        
  }

  if(!isEdit){
    const body = {
        iid: instrument,
        number: techNumber,
        tech_id: techId,
        tech_name: techName,
        axis: axis,
        db_name: dbName,
        vfd: isVfd,
        rpm: rpm || null,
        min_rpm: minrpm || null,
        max_rpm: maxrpm || null,
        location: driveEnd,
        type: assetType,
        intermediate: intermediate,
        domain: domainName,
        order: json,
        updated_by: currUser.id
    };

    getAddSensor(body);
  }
};
    
  useEffect(() => {
    if (!AddSensorLoading && AddSensorData && !AddSensorError) {
        SetMessage("Instrument Data inserted successfully");
        SetType("success");
        setOpenSnack(true);
        setTimeout(() => {
            props.refreshTable();//NOSONAR
            onClose();
        }, 500);
    } else if (!AddSensorLoading && AddSensorError === undefined && !AddSensorData) { 
        SetMessage("The combination of Tech Number, Tech ID, Axis already exists");
        SetType("error");
        setOpenSnack(true);
    }
  }, [AddSensorLoading, AddSensorData, AddSensorError]);

      useEffect(()=>{
        if(!EditSensorLoading && EditSensorData && !EditSensorError){
          SetMessage("Instrument Data updated successfully")
          SetType("info")
          setOpenSnack(true)
          setTimeout(() => {
              props.refreshTable();//NOSONAR
              onClose();
          }, 500)
        } else if (!EditSensorLoading && EditSensorError === undefined && !EditSensorData) { 
          SetMessage("The combination of Tech Number, Tech ID, Axis already exists");
          SetType("error");
          setOpenSnack(true);
      }
      },[EditSensorLoading, EditSensorData, EditSensorError])

      useEffect(()=>{
        if(!EditAllSensorLoading && EditAllSensorData && !EditAllSensorError){
          SetMessage("Instrument Data updated successfully")
          SetType("info")
          setOpenSnack(true)
          setTimeout(() => {
              props.refreshTable();//NOSONAR
              onClose();
          }, 500)
        }
      },[EditAllSensorLoading, EditAllSensorData, EditAllSensorError])

      const handleclick = () => {
            setAccordian1(!accordian1)
        }

    return (
        <React.Fragment>
        <div className="h-[48px] py-3.5 px-4 border-b flex items-center justify-between bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50">
          <BredCrumbsNDL breadcrump={breadcrump} onActive={handleActiveIndex} />
  
          <div className="flex gap-2 items-center">
            <Button id="reason-update" type="secondary" value={t('Cancel')} onClick={onClose}></Button>
            <Button
              id="reason-update"
              type="primary"
              value={isEdit ? t('Update') : t('Save')}
              onClick={handleSave}
            ></Button>
          </div>
        </div>
  
        <div className="p-4 max-h-[93vh] overflow-y-auto">
          <Grid container style={{ padding: "16px" }}>
            <Grid item xs={2}></Grid>
            <Grid item xs={6}>
              <div className="flex flex-col items-start mb-3">
                <TypographyNDL id="entity-dialog-title" variant="heading-02-xs" value={dialogTitle} />
                <TypographyNDL
                  variant="lable-01-s"
                  color="secondary"
                  value={'Add and configure new Instrument within the Neo'}
                />
              </div>
  
              <div className="flex flex-col gap-2">
                <SelectBox
                  id="instruments-List"
                  label={t('Instrument')}
                  edit={true}
                  disableCloseOnSelect={true}
                  placeholder={"Select Instrument"}
                  auto={true}
                  options={instruments.length > 0 ? instruments : []}
                  isMArray={true}
                  keyValue={"name"}
                  keyId={"id"}
                  onChange={(e) => handleInstrumentChange(e)}
                  value={instrument}
                  mandatory
                />
  
                <InputFieldNDL
                  id="tech-number"
                  label={"Tech Number"}
                  type="text"
                  placeholder={"Tech Number"}
                  value={techNumber}
                  onChange={handleTechNumberChange}
                  mandatory
                />
                <InputFieldNDL
                  id="tech-id"
                  label={"Tech ID"}
                  type="text"
                  placeholder={"Tech ID"}
                  value={techId}
                  //disabled={isdiabled}
                  onChange={handleTechIdChange}
                  mandatory
                />
                <InputFieldNDL
                  id="tech-name"
                  label={"Tech Name"}
                  type="text"
                  placeholder={"Tech Name"}
                  value={techName}
                  onChange={handleTechNameChange}
                  mandatory
                />
                <InputFieldNDL
                  id="axis"
                  label={"Axis"}
                  type="text"
                  placeholder={"Axis"}
                  helperText={"X, Y, Z, E are valid inputs, and no other values will be accepted."}
                  value={axis}
                  onChange={handleAxisChange}
                  mandatory
                />
                <InputFieldNDL
                  id="db-name"
                  label={"DB Name"}
                  type="text"
                  placeholder={"DB Name"}
                  value={dbName}
                  helperText={"Enter the valid DB Name"}
                  onChange={handleDbNameChange}
                  mandatory
                />
  
                <Checkboxs
                  checked={isVfd}
                  primaryLabel="VFD Configuration"
                  description="Select this checkbox if a motor Variable Frequency Drive (VFD) is available for the instrument"
                  onChange={handleVfdChange}
                />
                   {isVfd &&
                    <div className="grid grid-cols-2 gap-4">
                      <InputFieldNDL
                        id="min-rpm"
                        label={"Min RPM"}
                        type="number"
                        placeholder={"Min RPM"}
                        value={minrpm}
                        onChange={handleMinRPMChange}
                        className="w-full"
                      />
                      <InputFieldNDL
                        id="max-rpm"
                        label={"Max RPM"}
                        type="number"
                        placeholder={"Max RPM"}
                        value={maxrpm}
                        onChange={handleMaxRPMChange}
                        className="w-full"
                      />
                    </div>
                  }
                  {!isVfd &&
                    <div>
                      <InputFieldNDL
                        id="rpm"
                        label={"RPM"}
                        type="number"
                        placeholder={"RPM"}
                        value={rpm}
                        onChange={handleRPMChange}
                        className="w-full"
                      />
                    </div>
                  }
                <div className="my-3">
                  <div className="flex items-center gap-4">
                    <RadioNDL
                      name={'Drive End'}
                      labelText={'Drive End'}
                      description={'The end of the motor where the drive mechanism connects, housing the rotor'}
                      id={"Drive End"}
                      checked={driveEnd === 'Drive End'}
                      onChange={handleDriveEndChange}
                    />
                    <RadioNDL
                      name={'Non-Drive End'}
                      labelText={'Non-Drive End'}
                      description={'The opposite end containing the bearing support and electrical connections'}
                      id={"Non-Drive End"}
                      checked={driveEnd === 'Non-Drive End'}
                      onChange={handleDriveEndChange}
                    />
                  </div>
                </div>
  
                <SelectBox
                  id="asset-type"
                  label={t('Asset Type')}
                  edit={true}
                  disableCloseOnSelect={true}
                  auto={true}
                  options={
                    !AssetTypeLoading && !AssetTypeError && AssetTypeData && AssetTypeData.length > 0
                      ? AssetTypeData
                      : []
                  }
                  isMArray={true}
                  keyValue={"name"}
                  keyId={"id"}
                  onChange={(e) => handleAssetTypeChange(e)}
                  value={assetType}
                />
  
                <SelectBox
                  id="intermediate-list"
                  label={t('Intermediate')}
                  edit={true}
                  disableCloseOnSelect={true}
                  auto={true}
                  options={intermediateOptions}
                  isMArray={true}
                  keyValue={"name"}
                  keyId={"id"}
                  onChange={(e) => handleIntermediateChange(e)}
                  value={intermediate}
                />
  
                <SelectBox
                  id="domain-list"
                  label={t('Domain')}
                  edit={true}
                  disableCloseOnSelect={true}
                  auto={true}
                  options={domainOptions}
                  isMArray={true}
                  keyValue={"name"}
                  keyId={"id"}
                  placeholder={"Select Domain"}
                  onChange={(e) => handleDomainChange(e)}
                  value={domain}
                  mandatory
                />
                 <AccordianNDL1
                  title={t("Orders")}
                  isexpand={accordian1}
                  multiple
                  managetoggle={() => handleclick()}
                >
               
                  <Grid container spacing={2} style={{ padding: '10px' }}>
                    <Grid item xs={6} sm={6}>
                      <InputFieldNDL
                        id="min-rpm"
                        label={"BPFO"}
                        type="number"
                        placeholder={"BPFO"}
                        value={BPFO}
                        onChange={handleBPFOChange}
                        className="w-50%"
                      />
                      </Grid>
                        <Grid item xs={6} sm={6}>
                      <InputFieldNDL
                        id="max-rpm"
                        label={"BSF"}
                        type="number"
                        placeholder={"BSF"}
                        value={BSF}
                        onChange={handleBSFChange}
                        className="w-50%"
                      />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <InputFieldNDL
                        id="min-rpm"
                        label={"BPFI"}
                        type="number"
                        placeholder={"BPFI"}
                        value={BPFI}
                        onChange={handleBPFIChange}
                        className="w-full"
                      />
                       </Grid>
                       <Grid item xs={6} sm={6}>
                      <InputFieldNDL
                        id="max-rpm"
                        label={"FTF"}
                        type="number"
                        placeholder={"FTF"}
                        value={FTF}
                        onChange={handleFTFChange}
                        className="w-full"
                      />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <InputFieldNDL
                        id="min-rpm"
                        label={"VPF"}
                        type="number"
                        placeholder={"VPF"}
                        value={VPF}
                        onChange={handleVPFChange}
                        className="w-full"
                      />
                       </Grid>
                       <Grid item xs={6} sm={6}>
                      <InputFieldNDL
                        id="max-rpm"
                        label={"BRO"}
                        type="number"
                        placeholder={"BRO"}
                        value={BRO}
                        onChange={handleBROChange}
                        className="w-full"
                      />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <InputFieldNDL
                        id="min-rpm"
                        label={"GMF1"}
                        type="number"
                        placeholder={"GMF1"}
                        value={GMF1}
                        onChange={handleGMF1Change}
                        className="w-full"
                      />
                       </Grid>
                       <Grid item xs={6} sm={6}>
                      <InputFieldNDL
                        id="max-rpm"
                        label={"GMF2"}
                        type="number"
                        placeholder={"GMF2"}
                        value={GMF2}
                        onChange={handleGMF2Change}
                        className="w-full"
                      />
                       </Grid>
                       <Grid item xs={6} sm={6}>
                      <InputFieldNDL
                        id="min-rpm"
                        label={"GMF3"}
                        type="number"
                        placeholder={"GMF3"}
                        value={GMF3}
                        onChange={handleGMF3Change}
                        className="w-full"
                      />
                       </Grid>
                       <Grid item xs={6} sm={6}>
                      <InputFieldNDL
                        id="max-rpm"
                        label={"GMF4"}
                        type="number"
                        placeholder={"GMF4"}
                        value={GMF4}
                        onChange={handleGMF4Change}
                        className="w-full"
                      />
                    </Grid>
                  </Grid>
                
                </AccordianNDL1>
              </div>
            </Grid>
          </Grid>
        </div>
        <ModalNDL onClose={handleDialogClose} maxWidth={"md"} aria-labelledby="entity-dialog-title" open={OpenModel}>
        <ModalHeaderNDL>
            <TypographyNDL id="entity-dialog-title" variant="heading-02-xs" model value={t("Apply changes ?")} />
        </ModalHeaderNDL>
        <ModalContentNDL>
            <TypographyNDL color='secondary' value={"Do you want to apply the changes to all axis under this instrument."} variant="lable-01-s" />
        </ModalContentNDL>
        <ModalFooterNDL>
            <Button value={t('No')}  type="secondary" onClick={() => { handleApplytoAll(false) }} />
            <Button value={t('Yes')}  primary  onClick={()=>handleApplytoAll(true)} />
       
        </ModalFooterNDL>
    </ModalNDL> 
      </React.Fragment>
    )
});
export default AddSensor;
