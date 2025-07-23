import React, { useState, useEffect, useRef } from 'react';
import Grid from 'components/Core/GridNDL';
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import Typography from "components/Core/Typography/TypographyNDL";
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import ParagraphText from 'components/Core/Typography/TypographyNDL';
import FileInput from 'components/Core/FileInput/FileInputNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Button from "components/Core/ButtonNDL";
import DummyImage from 'assets/neo_icons/SettingsLine/image_icon.svg?react';
import BlackX from 'assets/neo_icons/SettingsLine/black_x.svg?react';
import moment from 'moment';
import DatePickerNDL from 'components/Core/DatepickerNDL';
import useGetPolicyType from "../hooks/useGetPolicyType";
import useGetPolicyStatus from "../hooks/useGetPolicyStatus";
import useCreatePolicy from "../hooks/useCreatePolicy";
import useEditPolicy from "../hooks/useEditPolicy";
import useGetAllPolicy from "../hooks/useGetAllPolicy";
import { useRecoilState } from 'recoil';
import { userData, selectedPlant, snackToggle, snackMessage, snackType, snackDesc } from 'recoilStore/atoms';

export default function AddPolicyForm({ onClose, editData, onSuccess }) {
    const remarksRef = useRef();
    const [headPlant] = useRecoilState(selectedPlant);
    const [name, setName] = useState('');
    const [isUsingExistingFile, setIsUsingExistingFile] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [policyTypeError, setPolicyTypeError] = useState(false);
    const [policyStatusError, setPolicyStatusError] = useState(false);
    const [effectiveDateError, setEffectiveDateError] = useState(false);
    const [expiryDateError, setExpiryDateError] = useState(false);
    const [fileError, setFileError] = useState({
        hasError: false,
        message: ""
        });
    const [isFileSizeError, setisFileSizeError] = useState({ type: null, value: false });
    const [files, setFiles] = useState({ file1: null, file2: [], file3: { sop: [], warranty: [], user_manuals: [], others: [] } });
    const [isDuplicateError, setIsDuplicateError] = useState(false);
    const [effectiveDate, setEffectiveDate] = useState(new Date());
    const [expiryDate, setExpiryDate] = useState(new Date());
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
      const [, SetDesc] = useRecoilState(snackDesc);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const { policyTypeData, getPolicyType } = useGetPolicyType();
    const { policyStatusData, getPolicyStatus } = useGetPolicyStatus();
    const {createPolicyLoading, createPolicyData, createPolicyError, getCreatePolicy} = useCreatePolicy();
    const {editPolicyLoading, editPolicyData, editPolicyError, getEditPolicy} = useEditPolicy();
    const { allPolicyLoading, allPolicyData, allPolicyError, getAllPolicy } = useGetAllPolicy();
    const [policyType, setPolicyType] = useState('');
    const [policyStatus, setPolicyStatus] = useState('');
    const [currUser] = useRecoilState(userData);

    useEffect(() => {
        getPolicyType();
        getPolicyStatus();
        getAllPolicy()
    }, [headPlant]);

    useEffect(() => {
        if (editData && Object.keys(editData).length > 0) {
            setName(editData.policy_name);
            if (policyTypeData && policyTypeData.length > 0) {
                const matched = policyTypeData.find(x => x.desc === editData.policy_type);
                if (matched) {
                    setPolicyType(matched.code);
                }
            }
            if (policyStatusData && policyStatusData.length > 0) {
                const matched = policyStatusData.find(x => x.desc === editData.status);
                if (matched) {
                    setPolicyStatus(matched.code);
                }
            }
            setEffectiveDate(new Date(editData.effective_date));
            setExpiryDate(new Date(editData.expiry_date));
            setSelectedFile(editData.file_path);
            setIsUsingExistingFile(true);  
            remarksRef.current.value = editData.remarks;
        }
    }, [editData, policyTypeData, policyStatusData]);

    const resetForm = () => {
        setName('');
        setPolicyType('');
        setPolicyStatus('');
        setEffectiveDate(new Date());
        setExpiryDate(new Date());
        remarksRef.current.value = ''
        setFiles({ file1: null, file2: [], file3: { sop: [], warranty: [], user_manuals: [], others: [] } });
        setUploadedFiles([]);
    };

    const closeModal = () => {
        resetForm();
        onClose();
    };

   const handleSavePolicy = () => {
    try {
        
    
       let hasError = false;
        const hasLeadingOrTrailingSpaces = name !== name.trim();
        const nameRegex = /^[A-Za-z0-9-()/_*#$&$ ]+$/;
        const trimmedName = name.trim();
        const isDuplicate = allPolicyData && allPolicyData.length > 0 &&
            allPolicyData.some(
                (policy) =>
                    policy.policy_name.trim().toLowerCase() === trimmedName.toLowerCase() &&
                    (!editData || policy.policy_id !== editData.policy_id)
            );
            // || !nameRegex.test(name)
        if (!name || name.trim() === "" || hasLeadingOrTrailingSpaces ) {
            setNameError(true);
            hasError = true;
        } else if (isDuplicate) {
            setIsDuplicateError(true);
            hasError = true;
        } else {
            setNameError(false);
            setIsDuplicateError(false);
        }
        if (!policyType) {
            setPolicyTypeError(true);
            hasError = true;
        }

        if (!policyStatus) {
            setPolicyStatusError(true);
            hasError = true;
        }

        if (!effectiveDate) {
            setEffectiveDateError(true);
            hasError = true;
        }

        if (!expiryDate) {
            setExpiryDateError(true);
            hasError = true;
        } else if (expiryDate < effectiveDate) {
            setExpiryDateError(true);
            hasError = true;
        }

    //  if (!editData || !isUsingExistingFile) {
    //     if (!selectedFile) {
    //         setFileError({
    //             hasError: true,
    //             message: "Please upload a valid Policy Document"
    //         });
    //         hasError = true;
    //     } else if (selectedFile.size > 10 * 1024 * 1024) {
    //         setFileError({
    //             hasError: true,
    //             message: "Maximum file size exceeded. Upload a file less than 10MB."
    //         });
    //         hasError = true;
    //     } else if (selectedFile.type !== "application/pdf") {
    //         setFileError({
    //             hasError: true,
    //             message: "Only PDF files are allowed"
    //         });
    //         hasError = true;
    //     } else {
    //         setFileError({
    //             hasError: false,
    //             message: ""
    //         });
    //     }
    // }

        if (hasError) return;
    
        const formData = new FormData();
        formData.append("policy_id", editData?.policy_id || 0);
        formData.append("ap_code", '');
        formData.append("policy_name", trimmedName);
        formData.append("policy_type", policyType);
        formData.append("effective_date", moment(effectiveDate).format('YYYY-MM-DD'));
        formData.append("expiry_date", moment(expiryDate).format('YYYY-MM-DD'));
        formData.append("status", policyStatus);
        formData.append("remarks", remarksRef.current?.value || '');
        formData.append("is_deleted", false);
        formData.append("created_dt", "");
        formData.append("created_by", currUser?.user_id || '');
        formData.append("modl_dt", "");
        formData.append("modl_by", currUser?.user_id || '');
        formData.append("file_path", editData?.file_path || ""); 
    
        if (selectedFile && !isUsingExistingFile) {
            formData.append("file", selectedFile);
        }

        if(editData && Object.keys(editData).length){
            getEditPolicy(formData);
        } else {
            getCreatePolicy(formData);
        }
        } catch (error) {
        console.error("Error in handleSavePolicy:", error);
        
    }
    };   

      useEffect(()=>{
        if(!createPolicyLoading && createPolicyData && !createPolicyError){
            if(createPolicyData === "Created Successfully "){
                setOpenSnack(true)
                SetMessage("New Policy Added")
                SetType("success")
                 SetDesc("Policy has been successfully Added")
                resetForm();
                onSuccess();
            }
        }
      },[createPolicyLoading, createPolicyData, createPolicyError])

      useEffect(()=>{
        if(!editPolicyLoading && editPolicyData && !editPolicyError){
            if(editPolicyData === "Updated Successfully "){
                setOpenSnack(true)
                SetMessage("Policy Updated")
                SetType("success")
                 SetDesc("Policy has been successfully Updated")
                resetForm();
                onSuccess();
            }
        }
      },[editPolicyLoading, editPolicyData, editPolicyError])

    const handleRemoveAssetImage = () => {
        setSelectedFile(null);
        setFileError({
            hasError: true,
            message: "Please upload a valid Policy Document"
        });
        setIsUsingExistingFile(false);
    };

    return (
        <React.Fragment>
            <ModalHeaderNDL>
                <TypographyNDL value="New Policy" variant="heading-02-xs" />
            </ModalHeaderNDL>

            <ModalContentNDL>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                       <InputFieldNDL
                            label="Policy Name"
                            helperText={
                                nameError
                                    ? "Please enter a valid policy name"
                                    : isDuplicateError
                                        ? "Policy name already exists"
                                        : ""
                            }
                            error={nameError || isDuplicateError}
                            mandatory
                            value={name}
                            onChange={(e) => { setName(e.target.value); setNameError(false); setIsDuplicateError(false); }}
                            placeholder="Type here"
                        />
                    </Grid>

                    <Grid item xs={12}>
                    <SelectBox
                            labelId="policy-type-label"
                            label="Policy Type"
                            id="policy-type-id"
                            auto={true}
                            multiple={false}
                            mandatory
                            options={policyTypeData || []}
                            value={policyType}
                            keyValue="desc"
                            keyId="code"
                            onChange={(e) => {setPolicyType(e.target.value); setPolicyTypeError(false);}}
                            msg={"Select policy type"}
                            error={policyTypeError}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <div>
                        <ParagraphText variant="paragraph-xs">Effective Date<span style={{ color: 'red' }}>&nbsp;*</span></ParagraphText>
                            <DatePickerNDL
                            mandatory
                                id="effective-date-picker"
                                onChange={(e) => {setEffectiveDate(e); setExpiryDate(e);}}
                                error={effectiveDateError}
                                startDate={effectiveDate}
                                dateFormat="dd-MM-yyyy"
                                minDate={new Date()} 
                            />
                        </div>
                    </Grid>

                    <Grid item xs={12}>
                        <div>
                        <ParagraphText variant="paragraph-xs">Expiry Date<span style={{ color: 'red' }}>&nbsp;*</span></ParagraphText>
                            <DatePickerNDL
                                id="expiry-date-picker"
                                mandatory
                                minDate={new Date(effectiveDate)} 
                                onChange={(e) => setExpiryDate(e)}
                                error={expiryDateError}
                                startDate={expiryDate}
                                dateFormat="dd-MM-yyyy"
                            />
                        </div>
                    </Grid>

                    <Grid item xs={12}>
                        <SelectBox
                            labelId="policy-status-label"
                            label="Policy Status"
                            id="policy-status-id"
                            auto={true}
                            mandatory
                            multiple={false}
                            options={policyStatusData || []}
                            value={policyStatus}
                            onChange={(e) => {setPolicyStatus(e.target.value); setPolicyStatusError(false);}}
                            keyValue="desc"
                            keyId="code"
                            error={policyStatusError}
                            msg="Select policy status"
                        />
                    </Grid>
                     {editData && Object.keys(editData).length > 0 && isUsingExistingFile ? (
                            <React.Fragment>
                                <ParagraphText variant="paragraph-xs">Policy Document<span style={{ color: 'red' }}>*</span></ParagraphText>
                                <Grid item xs={12}>
                                    <div className="flex justify-between items-center">
                                    <div className="flex gap-2 items-center">
                                        <DummyImage />
                                        <Typography value={selectedFile} variant="lable-01-s" />
                                    </div>
                                    <div className="flex gap-2">
                                        <BlackX onClick={() => handleRemoveAssetImage()} />
                                    </div>
                                </div>
                                {fileError.hasError && (
                                    <Typography 
                                        variant="helper-text-xs" 
                                        style={{ color: 'red', marginTop: '4px' }}
                                    >
                                        {fileError.message}
                                    </Typography>
                                )}
                            </Grid>
                        </React.Fragment>
                        ) : (
                            <Grid item xs={12}>
                                <FileInput
                                    // mandatory={!editData}
                                    // showAstrisk={true}
                                    label="Policy Document"
                                    accept=".pdf"
                                    multiple={false}
                                    error={fileError.hasError}
                                    helperText={fileError.hasError ? fileError.message : "Max 10MB PDF"}
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setSelectedFile(file);
                                            setFileError({
                                                hasError: false,
                                                message: ""
                                            });
                                            setIsUsingExistingFile(false);
                                        }
                                    }}
                                />
                            </Grid>
                        )}
                    <Grid item xs={12}>
                        <InputFieldNDL
                            label="Additional Notes"
                            inputRef={remarksRef}
                            placeholder="Type additional notes here"
                            multiline
                            rows={4}
                        />
                    </Grid>
                </Grid>
            </ModalContentNDL>

            <ModalFooterNDL>
                <Button type="secondary" style={{ width: "80px" }} value="Cancel" onClick={closeModal} />
                <Button 
                type="primary" 
                style={{ width: "80px" }} 
                value={editData && Object.keys(editData).length > 0 ? "Update" : "Save"} 
                onClick={handleSavePolicy} 
                />
            </ModalFooterNDL>
        </React.Fragment>
    );
}