import React, { useState, useEffect } from "react";
import Grid from "components/Core/GridNDL";
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import Typography from "components/Core/Typography/TypographyNDL";
import ModalHeaderNDL from "components/Core/ModalNDL/ModalHeaderNDL";
import ModalContentNDL from "components/Core/ModalNDL/ModalContentNDL";
import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import ParagraphText from "components/Core/Typography/TypographyNDL";
import FileInput from "components/Core/FileInput/FileInputNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Button from "components/Core/ButtonNDL";
import moment from "moment";
import DatePickerNDL from "components/Core/DatepickerNDL";
import useGetOperMech from "../hooks/useGetOperationMech";
import useCreateOperations from "../hooks/useCreateOperations";
import { useRecoilState } from "recoil";
import {
  userData,
  selectedPlant,
  snackToggle,
  snackMessage,
  snackType,
  snackDesc,
} from "recoilStore/atoms";
import useUpdateOperations from "../hooks/useUpdateOperations";
import { is, tr } from "date-fns/locale";
import { set } from "lodash";

export default function AddOperationsForm({ onClose, editData, onSuccess, existingOperationIds }) {
  const isEditMode = editData && Object.keys(editData).length > 0;
  const [headPlant] = useRecoilState(selectedPlant);
  const [name, setName] = useState("");
  const [nameerror, setnameerror] = useState(false);
  const [Operror, setOperror] = useState(false);
  const [amerror, setamerror] = useState(false);
  const [isFileSizeError, setisFileSizeError] = useState({
    type: null,
    value: false,
  });
  const [files, setFiles] = useState({
    file1: null,
    file2: [],
    file3: { sop: [], warranty: [], user_manuals: [], others: [] },
  });
  const [isDuplicateError, setIsDuplicateError] = useState(false);
  const [existingOpIds, setExistingOpIds] = useState(existingOperationIds || []); // Assuming existingOpIds is passed as a prop or defined elsewhere
  const [effectiveDate, setEffectiveDate] = useState(new Date());
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [remarks, setRemarks] = useState("");
  const [operation, setOperation] = useState("");
  const [, setOpenSnack] = useRecoilState(snackToggle);
  const [, SetMessage] = useRecoilState(snackMessage);
  const [, SetType] = useRecoilState(snackType);
  const [, SetDesc] = useRecoilState(snackDesc);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const { OperMechData, getOperMech } = useGetOperMech();
  const {
    editOpertaionsLoading,
    editOpertaionsData,
    editOpertaionsError,
    getUpdateOperations,
  } = useUpdateOperations();
  const {
    CreateOperationsLoading,
    createOperationsData,
    createOperationsError,
    getCreateOperations,
  } = useCreateOperations();
  const [OperMech, setOperMech] = useState("");
  const [currUser] = useRecoilState(userData);

  useEffect(() => {
    getOperMech();
  }, [headPlant]);

  useEffect(() => {
    // if (!editOpertaionsLoading && editOpertaionsData && !editOpertaionsError) {
      // console.clear()
      console.log("editOpertaionsData", editOpertaionsData);
      if (editOpertaionsData === "Created Successfully ") {
        setOpenSnack(true);
        SetMessage("Operation Updated");
        SetType("success");
        SetDesc("Operation has been successfully updated");
        resetForm();
        onClose();
        onSuccess();
      }
    // }
  }, [editOpertaionsLoading, editOpertaionsData, editOpertaionsError]);

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) {
      //   if (OperMechData && OperMechData.length > 0) {
      //     // const matched = OperMechData.find(
      //     //   (x) => x.value === editData.avlbl_machn
      //     // );
      //     // if (matched) {
      //     //   setOperMech(matched.key);
      //     // }
      //     const valdata = editData.avlbl_machn?.split(',')
      //     let tempdata;
      //     for(let val in valdata){
      //                 const matched = OperMechData.find(
      //       (x) => x.value === editData.avlbl_machn
      //     );
      //     tempdata.push(matched)
      //     }
      //    if (tempdata?.length>0) {
      //       setOperMech(tempdata);
      //     }
      //   }
      if (editData && OperMechData?.length > 0) {
        // const valdata = editData.avlbl_machn?.split(",") || [];
        // const tempdata = valdata
        // .map(val => OperMechData.find(x => x.value ===  ))
        // .filter(Boolean) // remove undefined
        // .map(m => m.key); // if you need just the key
        // console.log('valdatavaldatavaldatavaldatavaldata',tempdata,valdata)
        // if (tempdata.length > 0) {
        // setOperMech(tempdata);
        // }
        const keysArray =
          editData.avlbl_machn?.split(",").map((key) => key.trim()) || [];

        const tempdata = OperMechData.filter((item) =>
          keysArray.includes(item.key)
        );
        console.log("valdatavaldatavaldatavaldatavaldata", tempdata);
        if (tempdata.length > 0) {
          setOperMech(tempdata); // Set array of { value, key } objects
        }
      }
      setName(editData.op_id);
      setOperation(editData.stepno);
      setRemarks(editData.description);
    }
  }, [editData, OperMechData]);

  const resetForm = () => {
    setName("");
    setOperMech("");
    setEffectiveDate(new Date());
    setExpiryDate(new Date());
    setRemarks("");
    setOperation("");
    setFiles({
      file1: null,
      file2: [],
      file3: { sop: [], warranty: [], user_manuals: [], others: [] },
    });
    setUploadedFiles([]);
  };

  const closeModal = () => {
    resetForm();
    onClose();
  };

  const handleValidation = () => {
    let isValid = true
    if(!/^[a-zA-Z0-9 ]*$/.test(name) || name.trim() !== name || name.length <= 0 ||  name.length > 20) {
        setnameerror(true);
        isValid = false;
      }

      if (!editData && existingOpIds?.includes(name.trim())) {
        console.clear()
        console.log(existingOpIds, "existingOpIds");
        console.log(name.trim(), "name.trim()");
        setIsDuplicateError(true);
        isValid = false;
        // return;
      }

    if(!/^[a-zA-Z0-9 ]*$/.test(operation) || operation.trim() !== operation || operation.length > 20 || operation.length <= 0) {
          setOperror(true);
          isValid = false;
    }

    if (OperMech === "" || OperMech === null || OperMech === undefined || !OperMech) {
      setamerror(true);
      isValid = false;
    }

        return isValid;
  }

  const handleSaveOperation = () => {
    const trimmedOpId = name.trim();
    let isValid = handleValidation();
    // let teamopvalue = "";
    // if (trimmedOpId === "") {
    //   setnameerror(true);
    //   return
    // }
    // if (!OperMech) {
    //   setamerror(true);
    //   return
    // }
    // if (trimmedOpId === "") {
    //   setnameerror(true);
    //   return
    // } else {
    //   setnameerror(false);
    // }

    // if (!isValidOperationName(operation, "operation")) {
    //   setOperror(true);
    //   return;
    // } else {
    //   setOperror(false);
    // }

    // if (OperMech === "" || OperMech === null || OperMech === undefined) {
    //   setamerror(true);
    //   return;
    // } else {
    //   teamopvalue = OperMech.map((val) => val.key).join(",");
    //   setamerror(false);
    // }

    // if (!editData && existingOpIds.includes(trimmedOpId)) {
    //   setIsDuplicateError(true);
    //   return;
    // }

    console.log(isValid, "isValid");
    if(isValid){
      let teamopvalue = "";
      teamopvalue = OperMech?.map((val) => val.key).join(",");
    const payload = {
      op_id: trimmedOpId,
      ap_code: "",
      stepno: operation,
      description: remarks,
      code_desc: "",
      status: "Y",
      avlbl_machn: teamopvalue,
      create_dt: "",
      create_by: "",
      modified_dt: "",
      modified_by: "",
    };

    if (editData && Object.keys(editData).length) {
      getUpdateOperations(payload);
      // onClose()
    } else {
      getCreateOperations(payload);
    }
    } else { console .log("Validation Error") }
  };

  useEffect(() => {
    if (
      !CreateOperationsLoading &&
      createOperationsData &&
      !createOperationsError
    ) {
      if (createOperationsData === "Created Successfully ") {
        setOpenSnack(true);
        SetMessage("Operation Created Successfully");
        SetType("success");
        SetDesc("");
        resetForm();
        onClose();
        onSuccess();
      } else if (createOperationsData?.response === "op_id Already Exist") {
        setOpenSnack(true);
        SetMessage("Duplicate Operation ID");
        SetType("error");
        SetDesc("Operation ID already exists. Please use a unique one.");
      }
    }
  }, [CreateOperationsLoading, createOperationsData, createOperationsError]);


  useEffect(() => {
    if (
      !editOpertaionsLoading &&
      editOpertaionsData &&
      !editOpertaionsError
    ) {
      if (editOpertaionsData === "Updated Successfully ") {
        setOpenSnack(true);
        SetMessage("Operation Updated Successfully");
        SetType("success");
        SetDesc("");
        resetForm();
        onClose();
        onSuccess();
      }
    }
  }, [editOpertaionsLoading,
    editOpertaionsData,
    editOpertaionsError])

  const isValidOperationName = (value, key) => {
    if (key === "operation") {
      const trimmed = operation.trim();
      const regex = /^[A-Za-z\s]+$/;
      console.log(trimmed, "trimmed");
      return trimmed.length > 0 && trimmed.length <= 20 && regex.test(trimmed);
    } else {
      return value;
    }
  };

  return (
    <React.Fragment>
      <ModalHeaderNDL>
        <TypographyNDL value="New Operation" variant="heading-02-xs" />
      </ModalHeaderNDL>

      <ModalContentNDL>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <InputFieldNDL
              label="Operation Code"
              helperText={
                nameerror
                  ? "Enter valid Operation Code (letters, numbers, no spaces, max 20 characters)"
                  : isDuplicateError
                  ? "Operation Code already exists"
                  : ""
              }
              error={nameerror || isDuplicateError}
              mandatory
              value={name}
              onChange={(e) => {
                setIsDuplicateError(false);
                setnameerror(false);
                setName(e.target.value);
              }}
              placeholder="Type here"
              disabled={isEditMode}
            />
          </Grid>

          <Grid item xs={12}>
            <InputFieldNDL
              label="Operation"
              helperText={
                Operror
                  ? "Enter valid Operation Name (letters, numbers, no spaces, max 20 characters)"
                  : ""
              }
              error={Operror}
              mandatory
              value={operation}
              onChange={(e) => {
                setOperation(e.target.value);
                setOperror(false);
              }}
              placeholder="Type here"
            />
          </Grid>

          <Grid item xs={12}>
            <InputFieldNDL
              label="Description"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Type here"
              multiline
              rows={4}
            />
          </Grid>

          <Grid item xs={12}>
            {/* <SelectBox
              labelId="Operation-status-label"
              label="Available Machine"
              id="Operation-status-id"
              //   auto={true}
              mandatory
              error={amerror}
              helperText={amerror ? "Select Available Operation Mechine" : ""}
              msg="Select Available Operation Mechine"
              multiple={true}
              options={OperMechData || []}
              value={OperMech}
              onChange={(e) => setOperMech(e.target.value)}
              keyValue="value"
              keyId="key"
              //   msg="Select machine"
            /> */}
            <SelectBox
              id="Operation-status-id"
              label="Available Machine"
              edit={true}
              auto={true}
              options={OperMechData || []}
              isMArray={true}
              keyValue="value"
              keyId="key"
              value={OperMech}
              multiple={true}
              mandatory={true}
              selectAll={true}
              selectAllText={"Select All"}
              onChange={(e) => {setOperMech(e); setamerror(false);}}
              //disabled={disableOpSelect}
              error={amerror}
              helperText={amerror ? "Select Available Operation Mechine" : ""}
              msg="Select Available Operation Mechine"
              //isBtnActive={userWhoCanAddMetrics.includes(currUser.id)}
              // btnProps={<Button onClick={(e) => { e.stopPropagation(); handleMetricDialog() }} icon={AddLight} type={"ghost"} />}
            />
          </Grid>
        </Grid>
      </ModalContentNDL>

      <ModalFooterNDL>
        <Button
          type="secondary"
          style={{ width: "80px" }}
          value="Cancel"
          onClick={closeModal}
        />
        <Button
          type="primary"
          style={{ width: "80px" }}
          value={isEditMode ? "Update" : "Save"}
          onClick={handleSaveOperation}
        />
      </ModalFooterNDL>
    </React.Fragment>
  );
}
