/* eslint-disable array-callback-return */
import React, { useState, useEffect, useImperativeHandle } from "react";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import Delete from 'assets/neo_icons/Menu/delete.svg?react';
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import { useTranslation } from "react-i18next";
import Grid from "components/Core/GridNDL";
import { useRecoilState } from "recoil";
import {
  user,
  selectedPlant,
  snackToggle,
  snackMessage,
  snackType,
  instrumentsList,
} from "recoilStore/atoms";
import useGetSensorDetails from "components/layouts/Explore/ExploreMain/ExploreTabs/components/FaultHistory/hooks/useGetSensorDetails";
import "components/style/instrument.css";
import FileInput from "components/Core/FileInput/FileInputNDL";
import InputFieldNDL from "components/Core/InputFieldNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import BredCrumbsNDL from "components/Core/Bredcrumbs/BredCrumbsNDL";
import Button from "components/Core/ButtonNDL";
import useAssetType from "components/layouts/NewSettings/Node/hooks/useAssetType";
import useAddCustomer from "./hooks/useAddSensor";
import useUpdateSensor from "./hooks/useUpdateSensor";
import useUpdateAllSensor from "./hooks/useUpdateAllSensor";
import ModalNDL from "components/Core/ModalNDL";
import ModalHeaderNDL from "components/Core/ModalNDL/ModalHeaderNDL";
import ModalContentNDL from "components/Core/ModalNDL/ModalContentNDL";
import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import NewDatepicker from "components/Core/DatepickerNDL";
import { AlarmDaterange, customdates } from "recoilStore/atoms";
import useTheme from "TailwindTheme";
import useGetCustomerMaster from "./hooks/useGetCustomerMaster";


const AddCustomer = React.forwardRef((props, ref) => {
  const [instruments] = useRecoilState(instrumentsList);
  const [rangeValue, setbtGroupValue] = useRecoilState(AlarmDaterange);
  const [Customdatesval] = useRecoilState(customdates);
  const [selectedDateStart, setSelectedDateStart] = useState(
    Customdatesval.StartDate
  );
  const [selectedDateEnd, setSelectedDateEnd] = useState(
    Customdatesval.EndDate
  );
  const [instrument, setInstrument] = useState();
  const useThemes = useTheme();
  const [editValue, setEditValue] = useState();
  const [isEdit, setisEdit] = useState(false);
  const [isVfd, setisVfd] = useState(false);
  const [techNumber, setTechNumber] = useState("");
  const [, setisdiabled] = useState(false);
  const [techId, setTechId] = useState("");
  const [applyToAll, setApplyToAll] = useState(false);
  const [techName, setTechName] = useState("");
  const [axis, setAxis] = useState("");
  const [dbName, setDbName] = useState("");
  const [driveEnd, setDriveEnd] = useState("Drive End");
  const [OpenModel, setOpenModel] = useState(false);
  const [currUser] = useRecoilState(user);
  const [assetType, setAssetType] = useState(null);
  const [intermediate, setIntermediate] = useState(null);
  const [domain, setDomain] = useState(null);
  const [rpm, setRpm] = useState(0);
  const [minrpm, setMinRpm] = useState(0); //NOSONAR

  const [maxrpm, setMaxRpm] = useState(0); //NOSONAR
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
  const [bredCrumbName, setbredCrumbName] = useState("New Customer");
  const [formulaDialogMode] = useState("create");
  const [instrumentDialogMode] = useState("instrumentDetails");
  const {allCustomerLoading, allCustomerData, allCustomerError, getCustomerData} = useGetCustomerMaster()
  const { AssetTypeLoading, AssetTypeData, AssetTypeError, getAssetType } =
    useAssetType();
  const breadcrump = [
    { id: 0, name: "Customer Info" },
    { id: 1, name: bredCrumbName },
  ];
  const {
    AddCustomerLoading,
    AddCustomerData,
    AddCustomerError,
    getAddCustomer,
  } = useAddCustomer();
  const { EditSensorLoading, EditSensorData, EditSensorError, getEditSensor } =
    useUpdateSensor();
  const { sensordetailsdata, getSensorDetails } = useGetSensorDetails();
  const {
    EditAllSensorLoading,
    EditAllSensorData,
    EditAllSensorError,
    getEditAllSensor,
  } = useUpdateAllSensor();
  const handleActiveIndex = (index) => {
    if (index === 0) {
      props.handlepageChange(); //NOSONAR
    }
  };

  useEffect(() => {
    getAssetType();
    getSensorDetails(headPlant.id);
    getCustomerData()
  }, [headPlant]);

  const intermediateOptions = [
    { id: 1, name: "Coupling" },
    { id: 2, name: "Pulley" },
    { id: 3, name: "Nil" },
  ];

  const domainOptions = [
    { id: 1, name: "condmaster_200" },
    { id: 2, name: "retina" },
  ];

  const onClose = () => {
    props.handlepageChange(); //NOSONAR
  };
  const handleTechNumberChange = (e) => setTechNumber(e.target.value);
  const handleTechIdChange = (e) => setTechId(e.target.value);
  const handleTechNameChange = (e) => setTechName(e.target.value);
  const handleInstrumentChange = (e) => setInstrument(e.target.value);
  const handleAxisChange = (e) => {
    const value = e.target.value;
    const validAxes = ["X", "Y", "Z", "E"];

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
  let subdialoTitle = "Contact Information";

  if (instrumentDialogMode === "instrumentDetails") {
    if (formulaDialogMode === "create") {
      dialogTitle = t("Basic Info");
    } else if (formulaDialogMode === "edit") {
      dialogTitle = t("EditInstrument");
    } else {
      dialogTitle = t("DeleteInstrument");
    }
  }

  useImperativeHandle(ref, () => ({
    handleEditDialogOpen: (id, value) => {
      setisEdit(true);
      setisdiabled(true);
      setEditValue(value);

      const selectedDomain = domainOptions.find(
        (option) => option.name === value.domain
      );
      const domainid = selectedDomain ? selectedDomain.id : "";

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
        const isDriveEnd = locationString.includes("Drive")
          ? "Non-Drive End"
          : "Non-Drive End"; //NOSONAR
        setDriveEnd(isDriveEnd);
      } else {
        const lastThreeLetters = locationString.slice(-3);
        const isDriveEnd =
          lastThreeLetters === "NDE"
            ? "Non-Drive End"
            : lastThreeLetters === "DE"
            ? "Drive End"
            : null; //NOSONAR

        if (isDriveEnd !== null) {
          setDriveEnd(isDriveEnd);
        }
      }
      setId(value.id);
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
    },
  }));

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

    if (
      typeof obj1 === "object" &&
      typeof obj2 === "object" &&
      obj1 !== null &&
      obj2 !== null
    ) {
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
      if (
        typeof currentValue[key] === "object" &&
        typeof editValue[key] === "object"
      ) {
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
      id: id,
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
      order: json,
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
    if (
      !techNumber ||
      !techId ||
      !techName ||
      !dbName ||
      !domain ||
      !instrument
    ) {
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

    if (isEdit) {
      const hasChanges =
        editValue.tech_id !== techId ||
        editValue.number !== techNumber ||
        editValue.axis !== axis;

      if (
        !hasChanges &&
        sensordetailsdata &&
        sensordetailsdata.length > 1 &&
        sensordetailsdata.filter((sensor) => sensor.iid === editValue.iid)
          .length > 1
      ) {
        setOpenModel(true);
      } else {
        handleApplytoAll(false);
      }
    }

    if (!isEdit) {
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
        updated_by: currUser.id,
      };

      getAddCustomer(body);
    }
  };

  //   useEffect(() => {
  //     if (!AddCustomerLoading && AddCustomerData && !AddCustomerError) {
  //       SetMessage("Instrument Data inserted successfully");
  //       SetType("success");
  //       setOpenSnack(true);
  //       setTimeout(() => {
  //         props.refreshTable(); //NOSONAR
  //         onClose();
  //       }, 500);
  //     } else if (
  //       !AddCustomerLoading &&
  //       AddCustomerError === undefined &&
  //       !AddCustomerData
  //     ) {
  //       SetMessage(
  //         ""
  //       );
  //       SetType("error");
  //       setOpenSnack(true);
  //     }
  //   }, [AddCustomerLoading, AddCustomerData, AddCustomerError]);

  useEffect(() => {
    if (!EditSensorLoading && EditSensorData && !EditSensorError) {
      SetMessage("Instrument Data updated successfully");
      SetType("info");
      setOpenSnack(true);
      setTimeout(() => {
        props.refreshTable(); //NOSONAR
        onClose();
      }, 500);
    } else if (
      !EditSensorLoading &&
      EditSensorError === undefined &&
      !EditSensorData
    ) {
      SetMessage(
        "The combination of Tech Number, Tech ID, Axis already exists"
      );
      SetType("error");
      setOpenSnack(true);
    }
  }, [EditSensorLoading, EditSensorData, EditSensorError]);

  useEffect(() => {
    if (!EditAllSensorLoading && EditAllSensorData && !EditAllSensorError) {
      SetMessage("Instrument Data updated successfully");
      SetType("info");
      setOpenSnack(true);
      setTimeout(() => {
        props.refreshTable(); //NOSONAR
        onClose();
      }, 500);
    }
  }, [EditAllSensorLoading, EditAllSensorData, EditAllSensorError]);

  const handleclick = () => {
    setAccordian1(!accordian1);
  };

  const tosetstartdate = (date) => {
    setSelectedDateStart(date);
  };

  const tosetenddate = (date) => {
    setSelectedDateEnd(date);
  };

  return (
    <React.Fragment>
      <div className="h-[48px] py-3.5 px-4 border-b flex items-center justify-between bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50">
        <BredCrumbsNDL breadcrump={breadcrump} onActive={handleActiveIndex} />

        <div className="flex gap-2 items-center">
          <Button
            id="reason-update"
            type="secondary"
            value={t("Cancel")}
            onClick={onClose}
          ></Button>
          <Button
            id="reason-update"
            type="primary"
            value={isEdit ? t("Update") : t("Create")}
            onClick={handleSave}
          ></Button>
        </div>
      </div>

      <div className="p-4 max-h-[93vh] overflow-y-auto">
        <div className="flex flex-col items-start mb-3">
          <TypographyNDL
            id="entity-dialog-title"
            variant="heading-02-xs"
            value={dialogTitle}
          />
          <TypographyNDL
            variant="lable-01-s"
            color="secondary"
            value={"Provide essential information to define the policy."}
          />
        </div>
        <Grid container style={{ padding: "16px", "padding-left": "0px" }}>
          {/* <Grid item xs={2}></Grid> */}

          <Grid item xs={6}>
            <div className="flex flex-col gap-2">
              <InputFieldNDL
                id=""
                label={"Policy Name"}
                type="text"
                placeholder={"Type Here"}
                value={techNumber}
                onChange={handleTechNumberChange}
                mandatory
              />
              <SelectBox
                id="instruments-List"
                label={t("Company Type")}
                edit={true}
                disableCloseOnSelect={true}
                placeholder={"Select an Option"}
                auto={true}
                options={allCustomerData && allCustomerData.length > 0 ? allCustomerData : []}
                isMArray={true}
                keyValue={"name"}
                keyId={"code"}
                onChange={(e) => handleInstrumentChange(e)}
                value={instrument}
                mandatory
              />
              <SelectBox
                id="instruments-List"
                label={t("Industry Type")}
                edit={true}
                disableCloseOnSelect={true}
                placeholder={"Select an Option"}
                auto={true}
                options={instruments.length > 0 ? instruments : []}
                isMArray={true}
                keyValue={"name"}
                keyId={"id"}
                onChange={(e) => handleInstrumentChange(e)}
                value={instrument}
                mandatory
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="flex flex-col gap-2">
              <SelectBox
                id="instruments-List"
                label={t("Policy Type")}
                edit={true}
                disableCloseOnSelect={true}
                placeholder={"Select an Option"}
                auto={true}
                options={instruments.length > 0 ? instruments : []}
                isMArray={true}
                keyValue={"name"}
                keyId={"id"}
                onChange={(e) => handleInstrumentChange(e)}
                value={instrument}
                mandatory
              />
              <SelectBox
                id="instruments90-List"
                label={t("Company Category")}
                edit={true}
                disableCloseOnSelect={true}
                placeholder={"Select an Option"}
                auto={true}
                options={instruments.length > 0 ? instruments : []}
                isMArray={true}
                keyValue={"name"}
                keyId={"id"}
                onChange={(e) => handleInstrumentChange(e)}
                value={instrument}
                mandatory
              />
            </div>
          </Grid>
        </Grid>
        {/* <Grid container style={{ padding: "1px", "padding-left": "0px" }}>
          <Grid item xs={12}>
            <div className="flex flex-col gap-2">
              <SelectBox
                id="instruments-List"
                label={t("Policy Status")}
                edit={true}
                disableCloseOnSelect={true}
                placeholder={"Select an Option"}
                auto={true}
                options={instruments.length > 0 ? instruments : []}
                isMArray={true}
                keyValue={"name"}
                keyId={"id"}
                onChange={(e) => handleInstrumentChange(e)}
                value={instrument}
                mandatory
              />
            </div>
          </Grid>
        </Grid> */}
        {/* <br></br> */}
        <div className="flex flex-col items-start mb-3">
          <TypographyNDL
            id="entity-dialog-title"
            variant="heading-02-xs"
            value={subdialoTitle}
          />
          <TypographyNDL
            variant="lable-01-s"
            color="secondary"
            value={
              "Provide contact details for communication and correspondence."
            }
          />
        </div>
        <Grid container style={{ padding: "1px", "padding-left": "0px" }}>
          <Grid item xs={6}>
            <div className="flex flex-col gap-2">
              <InputFieldNDL
                id=""
                label={"Address Line 1"}
                type="text"
                placeholder={"Type Here"}
                value={techNumber}
                onChange={handleTechNumberChange}
                mandatory
              />
            </div>

            <div className="flex flex-col gap-2">
              <InputFieldNDL
                id=""
                label={"Email"}
                type="text"
                placeholder={"Type Here"}
                value={techNumber}
                onChange={handleTechNumberChange}
                mandatory
              />
            </div>

            <div className="flex flex-col gap-2">
              <InputFieldNDL
                id=""
                label={"Alternative Contact Person"}
                type="text"
                placeholder={"Type Here"}
                value={techNumber}
                onChange={handleTechNumberChange}
                mandatory
              />
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="flex flex-col gap-2">
              <InputFieldNDL
                id=""
                label={"Designation"}
                type="text"
                placeholder={"Type Here"}
                value={techNumber}
                onChange={handleTechNumberChange}
                mandatory
              />
            </div>

            <div className="flex flex-col gap-2">
              <InputFieldNDL
                id=""
                label={"Contact Number"}
                type="text"
                placeholder={"Type Here"}
                value={techNumber}
                onChange={handleTechNumberChange}
                mandatory
              />
            </div>
          </Grid>
        </Grid>
        <br />
        <div className="flex flex-col items-start mb-3">
          <TypographyNDL
            id="entity-dialog-title"
            variant="heading-02-xs"
            value={"Address Details"}
          />
          <TypographyNDL
            variant="lable-01-s"
            color="secondary"
            value={
              "Enter organization-level information to align the enquiry with business context.."
            }
          />
          <TypographyNDL
            style={{ "padding-top": "8px" }}
            variant="lable-01-s"
            // color=""
            value={"Billing Address"}
          />
        </div>
        <Grid container style={{ padding: "1px", "padding-left": "0px" }}>
          <Grid item xs={12}>
            <div className="flex flex-col gap-2">
              <InputFieldNDL
                id=""
                label={"Address Line 1"}
                type="text"
                placeholder={"Type Here"}
                value={techNumber}
                onChange={handleTechNumberChange}
                mandatory
              />

              <InputFieldNDL
                id=""
                label={"Address Line 2"}
                type="text"
                placeholder={"Type Here"}
                value={techNumber}
                onChange={handleTechNumberChange}
                mandatory
              />
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="flex flex-col gap-2">
              <InputFieldNDL
                id=""
                label={"City"}
                type="text"
                placeholder={"Type Here"}
                value={techNumber}
                onChange={handleTechNumberChange}
                mandatory
              />
            </div>

            <div className="flex flex-col gap-2">
              <SelectBox
                id="instruments-List"
                label={t("State")}
                edit={true}
                disableCloseOnSelect={true}
                placeholder={"Select an Option"}
                auto={true}
                options={instruments.length > 0 ? instruments : []}
                isMArray={true}
                keyValue={"name"}
                keyId={"id"}
                onChange={(e) => handleInstrumentChange(e)}
                value={instrument}
                mandatory
              />
            </div>
          </Grid>

          <Grid item xs={6}>
            <div className="flex flex-col gap-2">
              <InputFieldNDL
                id=""
                label={"Country"}
                type="text"
                placeholder={"Type Here"}
                value={techNumber}
                onChange={handleTechNumberChange}
                mandatory
              />
            </div>

            <div className="flex flex-col gap-2">
              <SelectBox
                id="instruments-List"
                label={t("Zip Code")}
                edit={true}
                disableCloseOnSelect={true}
                placeholder={"Select an Option"}
                auto={true}
                options={instruments.length > 0 ? instruments : []}
                isMArray={true}
                keyValue={"name"}
                keyId={"id"}
                onChange={(e) => handleInstrumentChange(e)}
                value={instrument}
                mandatory
              />
            </div>
          </Grid>
        </Grid>
        <br />
        <div className="flex flex-col items-start mb-3">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TypographyNDL
              id="entity-dialog-title"
              variant="heading-02-xs"
              value={"Shipping Address 1"}
            />
            <Button
              style={{
                margin: "2px",
                marginLeft: "5px",
                width: "10%",
                height: "10%",
              }}
              type="ghost"
              danger
              icon={Delete}
              stroke={useThemes.colorPalette.genericRed}
            />
          </div>

          <TypographyNDL
            variant="lable-01-s"
            color="secondary"
            value={"Shipping Address Same a Billing Address."}
          />
        </div>
        <Grid container style={{ padding: "16px", "padding-left": "0px" }}>
          {/* <Grid item xs={2}></Grid> */}

          <Grid item xs={12}>
            <div className="flex flex-col gap-2">
              <InputFieldNDL
                id=""
                label={"Address lane 1"}
                type="text"
                placeholder={"Type Here"}
                value={techNumber}
                onChange={handleTechNumberChange}
                mandatory
              />
              <InputFieldNDL
                id=""
                label={"Address lane 2"}
                type="text"
                placeholder={"Type Here"}
                value={techNumber}
                onChange={handleTechNumberChange}
                mandatory
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="flex flex-col gap-2">
              <InputFieldNDL
                id=""
                label={"City"}
                type="text"
                placeholder={"Type Here"}
                value={techNumber}
                onChange={handleTechNumberChange}
                mandatory
              />
            </div>

            <div className="flex flex-col gap-2">
              <SelectBox
                id="instruments-List"
                label={t("State")}
                edit={true}
                disableCloseOnSelect={true}
                placeholder={"Select an Option"}
                auto={true}
                options={instruments.length > 0 ? instruments : []}
                isMArray={true}
                keyValue={"name"}
                keyId={"id"}
                onChange={(e) => handleInstrumentChange(e)}
                value={instrument}
                mandatory
              />
            </div>
            <Button
              type="tertiary"
              value={t("Add Shipping Address")}
              icon={Plus}
              style={{ margin: "19px", marginLeft: "8px" }}
            />
          </Grid>
          <Grid item xs={6}>
            <div className="flex flex-col gap-2">
              <InputFieldNDL
                id=""
                label={"Country"}
                type="text"
                placeholder={"Type Here"}
                value={techNumber}
                onChange={handleTechNumberChange}
                mandatory
              />
            </div>

            <div className="flex flex-col gap-2">
              <SelectBox
                id="instruments-List"
                label={t("Zip Code")}
                edit={true}
                disableCloseOnSelect={true}
                placeholder={"Select an Option"}
                auto={true}
                options={instruments.length > 0 ? instruments : []}
                isMArray={true}
                keyValue={"name"}
                keyId={"id"}
                onChange={(e) => handleInstrumentChange(e)}
                value={instrument}
                mandatory
              />
            </div>
          </Grid>
        </Grid>

        <div className="flex flex-col items-start mb-3">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TypographyNDL
              id="entity-dialog-title"
              variant="heading-02-xs"
              value={"Financial Details"}
            />
          </div>

          <TypographyNDL
            variant="lable-01-s"
            color="secondary"
            value={
              "Store financial and tax information for compliance and transactions."
            }
          />
        </div>
        <Grid container style={{ padding: "16px", "padding-left": "0px" }}>
          {/* <Grid item xs={2}></Grid> */}
          <Grid item xs={6}>
            <div className="flex flex-col gap-2">
              <InputFieldNDL
                id=""
                label={"GST Number"}
                type="text"
                placeholder={"Type Here"}
                value={techNumber}
                onChange={handleTechNumberChange}
                mandatory
              />
            </div>
            <br />
            <div className="flex flex-col gap-2">
              <SelectBox
                id="instruments-List"
                label={t("Tax Identification Number (TIN)")}
                edit={true}
                disableCloseOnSelect={true}
                placeholder={"Select an Option"}
                auto={true}
                options={instruments.length > 0 ? instruments : []}
                isMArray={true}
                keyValue={"name"}
                keyId={"id"}
                onChange={(e) => handleInstrumentChange(e)}
                value={instrument}
                mandatory
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="flex flex-col gap-2">
              <FileInput
                multiple={false}
                onClose={(val, index, e) =>
                  val.type ? console.log(index, e) : console.log(index, val)
                }
                helperText={
                  "Supports CSV files only, Max size of each file is 10MB"
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <FileInput
                multiple={false}
                onClose={(val, index, e) =>
                  val.type ? console.log(index, e) : console.log(index, val)
                }
                helperText={
                  "Supports CSV files only, Max size of each file is 10MB"
                }
              />
            </div>
          </Grid>
        </Grid>

        <div className="flex flex-col items-start mb-3">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TypographyNDL
              id="entity-dialog-title"
              variant="heading-02-xs"
              value={"Policies"}
            />
          </div>

          <TypographyNDL
            variant="lable-01-s"
            color="secondary"
            value={
              "Agree to standard business policies and terms for transactions."
            }
          />
        </div>
        <Grid container style={{ padding: "16px", "padding-left": "0px" }}>
          {/* <Grid item xs={2}></Grid> */}
          <Grid item xs={6}>
            <div className="flex flex-col gap-1">
              <SelectBox
                id="instruments-List"
                label={t("Terms & Conditions")}
                edit={true}
                disableCloseOnSelect={true}
                placeholder={"Select an Option"}
                auto={true}
                options={instruments.length > 0 ? instruments : []}
                isMArray={true}
                keyValue={"name"}
                keyId={"id"}
                onChange={(e) => handleInstrumentChange(e)}
                value={instrument}
                mandatory
              />
            </div>
          </Grid>
          <Grid item xs={1}>
            <div className="flex flex-col ">
              <Button
                style={{
                  // margin: "2px",
                  marginTop: "12%",
                  width: "10%",
                  height: "10%",
                }}
                type="ghost"
                danger
                icon={Delete}
                stroke={useThemes.colorPalette.genericRed}
              />
            </div>
          </Grid>
        </Grid>
        <Grid container style={{ padding: "16px", "padding-left": "0px" }}>
          {/* <Grid item xs={2}></Grid> */}
          <Grid item xs={6}>
            <div className="flex flex-col gap-1">
              <SelectBox
                id="instruments-List"
                label={t("Return Policy")}
                edit={true}
                disableCloseOnSelect={true}
                placeholder={"Select an Option"}
                auto={true}
                options={instruments.length > 0 ? instruments : []}
                isMArray={true}
                keyValue={"name"}
                keyId={"id"}
                onChange={(e) => handleInstrumentChange(e)}
                value={instrument}
                mandatory
              />
            </div>

            <Button
              type="tertiary"
              value={t("Add Policy")}
              icon={Plus}
              style={{ margin: "19px", marginLeft: "8px" }}
            />

            <InputFieldNDL
              id=""
              label={"Additional Notes"}
              type="text"
              multiline={true}
              placeholder={"Type Here"}
              value={techNumber}
              onChange={handleTechNumberChange}
              mandatory
            />
          </Grid>
          <Grid item xs={1}>
            <div className="flex flex-col ">
              <Button
                style={{
                  // margin: "2px",
                  marginTop: "12%",
                  width: "10%",
                  height: "10%",
                }}
                type="ghost"
                danger
                icon={Delete}
                stroke={useThemes.colorPalette.genericRed}
              />
            </div>
          </Grid>
        </Grid>
      </div>

      <ModalNDL
        onClose={handleDialogClose}
        maxWidth={"md"}
        aria-labelledby="entity-dialog-title"
        open={OpenModel}
      >
        <ModalHeaderNDL>
          <TypographyNDL
            id="entity-dialog-title"
            variant="heading-02-xs"
            model
            value={t("Apply changes ?")}
          />
        </ModalHeaderNDL>
        <ModalContentNDL>
          <TypographyNDL color="secondary" value={""} variant="lable-01-s" />
        </ModalContentNDL>
        <ModalFooterNDL>
          <Button
            value={t("No")}
            type="secondary"
            onClick={() => {
              handleApplytoAll(false);
            }}
          />
          <Button
            value={t("Yes")}
            primary
            onClick={() => handleApplytoAll(true)}
          />
        </ModalFooterNDL>
      </ModalNDL>
    </React.Fragment>
  );
});
export default AddCustomer;
