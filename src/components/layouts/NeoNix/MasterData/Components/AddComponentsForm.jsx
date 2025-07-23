import React, { useState, useEffect, useRef } from 'react';
import Grid from 'components/Core/GridNDL';
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import Button from "components/Core/ButtonNDL";
import { useRecoilState } from 'recoil';
import { userData, selectedPlant, snackToggle, snackMessage, snackType, snackDesc } from 'recoilStore/atoms';
import { useTranslation } from "react-i18next";
import RadioNDL from "components/Core/RadioButton/RadioButtonNDL";
import Trash from 'assets/neo_icons/trash.svg?react';
import SixDots from 'assets/neo_icons/Neonix/Drag_6_dots.svg?react';
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import useCreateComponent from './hooks/useCreateComponent';
import useEditComponent from './hooks/useEditComponent';

export default function AddPolicyForm({ onClose, editData, onSuccess,...props }) {
    const remarksRef = useRef();
    const { t } = useTranslation();
    const [headPlant] = useRecoilState(selectedPlant);
    const[isMainComponent, setIsMainComponent] = useState(true);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
      const [, SetDesc] = useRecoilState(snackDesc);
    const [ValidCompanyName,setValidCompanyName] = useState({isValid: true, value: ''});
    const [ValidCompanyID,setValidCompanyID] = useState({isValid: true, value: ''});
    const companyNameRef = useRef();
    const companyIDRef = useRef();
    const {createComponentLoading, createComponentData, createComponentError, createComponent}  = useCreateComponent();
    const {editComponentLoading, editComponentData, editComponentError, editComponent}  = useEditComponent();




    // Operation row state and handlers
    const defaultBOMRow = {
        id: "",
        operation: "",
        cycleTime: "",
    };

    const [bomRows, setBOMRows] = useState([
        { id: 1, operation: "", cycleTime: "", isSelectboxError: false,  isTextFieldError: false },
        { id: 2, operation: "", cycleTime: "", isSelectboxError: false,  isTextFieldError: false },
        { id: 3, operation: "", cycleTime: "", isSelectboxError: false,  isTextFieldError: false },
    ]);
    const [draggedBOMRow, setDraggedBOMRow] = useState(null);
    const [dragOverBOMRow, setDragOverBOMRow] = useState(null);

    const handleBOMDragStart = (index) => setDraggedBOMRow(index);
    const handleBOMDragEnter = (index) => setDragOverBOMRow(index);
    const handleBOMDragEnd = () => {
        if (
            draggedBOMRow === null ||
            dragOverBOMRow === null ||
            draggedBOMRow === dragOverBOMRow
        ) {
            setDraggedBOMRow(null);
            setDragOverBOMRow(null);
            return;
        }
        const updatedRows = [...bomRows];
        const [removed] = updatedRows.splice(draggedBOMRow, 1);
        updatedRows.splice(dragOverBOMRow, 0, removed);
        let sequneceIDChange = updatedRows.map((row, index) => {
            return {
                ...row,
                id: index + 1 // Update ID based on new order
            }
        })
        setBOMRows(sequneceIDChange);
        setDraggedBOMRow(null);
        setDragOverBOMRow(null);
    };

    const handleBOMRowChange = (index, key, value) => {
        if (key === "cycleTime" && isNaN(value)) {
            // If the key is "cycleTime" and the value is not a number, return early
            return;
        }
        setBOMRows((prev) => {
    const updatedArray = [...prev]; // Create a copy of the current state
    
    updatedArray[index][key] = value;
    updatedArray[index].isSelectboxError = false; // Reset the error state for selectbox
    updatedArray[index].isTextFieldError = false; // Reset the error state for text field
     // Update the specific index with the new value
    return updatedArray; // Return the updated array
  });
  
    };

    const handleDeleteBOMRow = (indexToDelete) => {
        const updatedRows = bomRows.filter((_, idx) => idx !== indexToDelete);
        let updatedRowsWithSequnece = updatedRows.map((row, index) => {
            return {
                ...row,
                id: index + 1, // Update ID based on new order
            }
        })
        setBOMRows(updatedRowsWithSequnece);
    };

    const handleAddBOMRow = () => {
        const nextId = bomRows.length
            ? `${1 + bomRows.length}`
            : 1;
        setBOMRows([
            ...bomRows,
            { ...defaultBOMRow, id: nextId }
        ]);
    };

    

    useEffect(() => {
        if (editData && Object.keys(editData).length > 0) {
            // console.log(editData, 'editData')
            const headerValue = editData.header;
            if(Object.keys(headerValue).length > 0){
                const discription =  headerValue.description 
                ? headerValue.description.substring(0, 150) 
                : '';
                setTimeout(() => {
                    companyNameRef.current.value = headerValue.com_name || '';
                    companyIDRef.current.value = headerValue.com_id || '';
                    remarksRef.current.value = discription || '';

                },300)
                setValidCompanyName({
                    value: headerValue.com_name || '',
                    isValid: true
                });
                setValidCompanyID({
                    value: headerValue.com_id || '',
                    isValid: true
                });
                setIsMainComponent(headerValue.com_type === 'main');
                // Set BOM Rows
                const bomData = editData.items || [];
                if(bomData.length === 0){
                    bomData.push({
                        id: 1, operation: "", cycleTime: "", isSelectboxError: false,  isTextFieldError: false
                    });
                    setBOMRows(bomData);
                }else{
                    const formattedBOMRows = bomData.map((item, index) => ({
                        id: index + 1,
                        operation: item.op_name || '',
                        cycleTime: item.cycle_time ? item.cycle_time.replace('s', '') : '',
                        isSelectboxError: false,
                        isTextFieldError: false
                    }));
                setBOMRows(formattedBOMRows);
                }
             
            }
           
         
        }
    }, [editData]);


    const closeModal = () => {
        // resetForm();
        onClose();
    };

    const handleSavComponents = () => {
        let hasError = false;
    
        // Validate Component Name
        if (!ValidCompanyName.isValid || ValidCompanyName.value.trim() === "") {
            setValidCompanyName({
                ...ValidCompanyName,
                isValid: false
            });
            hasError = true;
        }
    
        // Validate Component ID
        if (!ValidCompanyID.isValid || ValidCompanyID.value.trim() === "") {
            setValidCompanyID({
                ...ValidCompanyID,
                isValid: false
            });
            hasError = true;
        }
    
        // Validate BOM Rows
        let updatedBOMRows = [...bomRows];
        const hasBOMErrors = updatedBOMRows.some((row, index) => {
            const isOperationEmpty = !row.operation.trim();
            const isCycleTimeEmpty = !row.cycleTime.trim();
            const isCycleTimeInvalid = parseFloat(row.cycleTime) <= 0; // Check if cycle time is greater than 0
            const hasError = 
                (isOperationEmpty && !isCycleTimeEmpty) || 
                (!isOperationEmpty && (isCycleTimeEmpty || isCycleTimeInvalid));
        
            if (hasError) {
                updatedBOMRows[index] = {
                    ...row,
                    isSelectboxError: isOperationEmpty,
                    isTextFieldError: isCycleTimeEmpty || isCycleTimeInvalid,
                };
            }
            return hasError;
        });
    
        setBOMRows(updatedBOMRows); // Update state with error flags
    
        if (hasBOMErrors) {
            hasError = true;
        }
    
        // Check for duplicate Component Name
        const isDuplicateName = props.OverallData.some(
            (item) =>
                item.com_name.toLowerCase() === ValidCompanyName.value.trim().toLowerCase() &&
                (props.dialogMode !== "edit" || item.com_id !== editData?.header?.com_id) // Exclude current record in edit mode
        );
    
        if (isDuplicateName) {
            setValidCompanyName({
                ...ValidCompanyName,
                isValid: false,
                isDuplicate: true
            });
            hasError = true;
        }
    
        // Check for duplicate Component ID
        const isDuplicateID = props.OverallData.some(
            (item) =>
                item.com_id.toLowerCase() === ValidCompanyID.value.trim().toLowerCase() &&
                (props.dialogMode !== "edit" || item.com_id !== editData?.header?.com_id) // Exclude current record in edit mode
        );
    
        if (isDuplicateID) {
            setValidCompanyID({
                ...ValidCompanyID,
                isValid: false,
                isDuplicate: true
            });
            hasError = true;
        }

        
    
        // Block save/update if any error occurs
        if (hasError) {
            return;
        }
    
        // Prepare payload
        const payload = {
            header: {
                "id": 0,
                "ap_code": "",
                "com_type": isMainComponent ? "main" : "sub",
                "is_deleted": 0,
                "create_dt": "",
                "create_by": "",
                "modified_dt": "",
                "modified_by": "",
                "com_name": ValidCompanyName.value,
                "com_id": ValidCompanyID.value,
                "description": remarksRef.current.value
            },
            items: bomRows.filter(x => x.operation && x.operation !== '').map((row, i) => ({
                "id": 0,
                "op_id": i,
                "op_name": row.operation,
                "com_id": ValidCompanyID.value,
                "ap_code": "",
                "cycle_time": row.cycleTime + 's',
                "sequnece": i,
                "create_dt": "",
                "create_by": "",
                "modified_dt": "",
                "modified_by": ""
            })),
        };
    
        // Call API based on edit or create mode
        if (props.dialogMode === "edit") {
            editComponent(payload);
        } else {
            createComponent(payload);
        }
    };

      useEffect(()=>{
        if(!createComponentLoading &&  createComponentData && !createComponentError){
            // console.log(  createComponentData, 'createComponentData')
            if(createComponentData === "Created Successfully "){
                setOpenSnack(true)
                SetMessage("New Component Added")
                SetType("success")
                 SetDesc("Component has been successfully Added")
                // resetForm();
                onSuccess(true);
            }else{
                setOpenSnack(true)
                SetMessage("Unable to Add Component")
                 SetType("error")
                 SetDesc("Something went wrong while adding the component")
                // resetForm();
                onSuccess(false);
            }
        }
      },[createComponentLoading, createComponentData, createComponentError,])

      useEffect(()=>{
        if(!editComponentLoading && editComponentData && !editComponentError){
            if(editComponentData === "Created Successfully "){
                setOpenSnack(true)
                SetMessage("Component Updated")
                SetType("success")
                SetDesc("Component has been successfully Updated")
                // resetForm();
                onSuccess(true);
            }else{
                setOpenSnack(true)
                SetMessage("Unable to Update Component")
                 SetType("error")
                 SetDesc("Something went wrong while updating the component")
                // resetForm();
                onSuccess(false);
            }
        }
      },[editComponentLoading, editComponentData, editComponentError])

      const validateCompanyDetails = (companyDetail,field,isDuplicate) => {
        if(isDuplicate) {
            return `${field} already exists`;
        }
            if (companyDetail.value.trim() === "" || !/^[a-zA-Z0-9_.\-\[\]{} ]*$/.test(companyDetail.value)) {
                return `${field} should contain alphanumerics and special chars like -,_,[],{}`;
            } else if (companyDetail.value !== companyDetail.value.trim()) {
                return `${field} should contain alphanumerics and special chars like -,_,[],{}`;
            } else if (companyDetail.value.length > 50) {
                return `${field} must be less than 50 characters`;
            }
        return "";
      }


      const CompanyNameChange=(e)=>{

       const value = e.target.value;

    const isValid =
      /^[a-zA-Z0-9_.\-\[\]{} ]*$/.test(value)
      && value.length <= 50;

    setValidCompanyName({
      value,
      isValid,
    });
      }

      const CompanyIDChange=(e)=>{
        const value = e.target.value;
        const isValid =
       /^[a-zA-Z0-9_.\-\[\]{} ]*$/.test(value)
       && value.length <= 50;
 
       setValidCompanyID({
       value,
       isValid,
     });
       }

       const handleInstrumentSwitch = (e) => {
        setIsMainComponent(e.target.id === "MainComponent");
       }

    return (
        <React.Fragment>
            <ModalHeaderNDL>
                <TypographyNDL value={props.dialogMode === "create" ? "New Component" : 'Edit Component'} variant="heading-02-xs" />
            </ModalHeaderNDL>

            <ModalContentNDL>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                       <InputFieldNDL
                            label="Component Name"
                            helperText={!ValidCompanyName.isValid ? validateCompanyDetails(ValidCompanyName,"Component Name",ValidCompanyName.isDuplicate) : ''}
                            error={ValidCompanyName && !ValidCompanyName.isValid}
                            mandatory
                            inputRef={companyNameRef}
                            onChange={CompanyNameChange}
                            placeholder="Type here"
                        />
                    </Grid>
                <Grid item xs={12}>
                       <InputFieldNDL
                            label="Component ID"
                            helperText={ !ValidCompanyID.isValid? validateCompanyDetails(ValidCompanyID,"Component ID",ValidCompanyID.isDuplicate) : ''}
                            error={ValidCompanyID && !ValidCompanyID.isValid}
                            mandatory
                            disabled={props.dialogMode === 'edit' ? true : false}
                            inputRef={companyIDRef}
                            onChange={CompanyIDChange}
                            placeholder="Type here"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <RadioNDL
                        name={t("Main Component")}
                        labelText={t("Main Component")}
                        id={"MainComponent"}
                        checked={isMainComponent}
                        onChange={handleInstrumentSwitch}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <RadioNDL
                        name={t("Sub Component")}
                        labelText={t("Sub Component")}
                        id={"Sub Component"}
                        checked={!isMainComponent}
                        onChange={handleInstrumentSwitch}
                        />
                    </Grid>
                      <Grid item xs={12}>
                        <InputFieldNDL
                            label="Description"
                            inputRef={remarksRef}
                            placeholder="Type description here"
                            multiline
                            rows={4}
                            maxLength={'150'}
                        />
                    </Grid>
                     <Grid item xs={12}>
                    <div className="w-full">
                        <div className="w-full">
                            <div className="grid grid-cols-12 gap-2 bg-[#F0F0F0] px-4 py-2 text-sm font-semibold text-gray-700 w-full">
                                <div className="col-span-1"></div>
                                <div className="col-span-2">ID</div>
                                <div className="col-span-5">Operation</div>
                                <div className="col-span-3">Cycle Time</div>
                                <div className="col-span-1"></div>
                            </div>
                            {bomRows.map((row, index) => (
                                <div
                                    key={row.id}
                                    className={`grid grid-cols-12 gap-2 px-4 py-2 items-center w-full
                                        ${dragOverBOMRow === index ? 'bg-blue-100' : ''}
                                    `}
                                    draggable
                                    onDragStart={() => handleBOMDragStart(index)}
                                    onDragEnter={() => draggedBOMRow !== null && handleBOMDragEnter(index)}
                                    onDragEnd={handleBOMDragEnd}
                                    onDragOver={e => e.preventDefault()}
                                    style={{ cursor: 'move', width: '100%' }}
                                > 
                                    <div className="col-span-1 flex items-center justify-center cursor-move">
                                        <SixDots />
                                    </div>
                                    <div className="col-span-2">
                                        <InputFieldNDL value={row.id} disabled />
                                    </div>
                                    <div className="col-span-5">
                                        <SelectBox
                                            labelId={`operation-label-${index}`}
                                            id={`operation-id-${index}`}
                                            auto={false}
                                            multiple={false}
                                            isMArray={true}
                                            checkbox={false}
                                            keyValue="stepno"
                                            keyId="op_id"
                                            error={row.isSelectboxError}
                                            msg={row.isSelectboxError ? 'Select operation' : ''}
                                            options={props.Operationoptions && props.Operationoptions.length > 0  ? props.Operationoptions : []  } // keep empty for now
                                            value={row.operation}
                                            onChange={(e) => handleBOMRowChange(index, 'operation', e.target.value)}
                                            placeholder="Select operation"
                                            mandatory
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <InputFieldNDL
                                            value={row.cycleTime}
                                            onChange={(e) => handleBOMRowChange(index, 'cycleTime', e.target.value)}
                                            placeholder="Enter cycle time"
                                            // type="number"
                                            error={row.isTextFieldError}
                                            helperText={row.isTextFieldError ? 'Enter Valid cycle time ': ''}
                                            mandatory
                                        />
                                    </div>
                                    <div className="col-span-1 flex items-center justify-center">
                                        {bomRows.length > 1 && (
                                            <button
                                                onClick={() => handleDeleteBOMRow(index)}
                                                className="text-red-500 hover:scale-105 transition-transform"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-end mt-2 w-full">
                                <Button
                                    id="add-bom-row"
                                    type="tertiary"
                                    icon={Plus}
                                    value="Add Operation"
                                    onClick={handleAddBOMRow}
                                />
                            </div>
                        </div>
                    </div>
                    </Grid>
                </Grid>
            </ModalContentNDL>

            <ModalFooterNDL>
                <Button type="secondary" style={{ width: "80px" }} value="Cancel" onClick={closeModal} />
                <Button 
                type="primary" 
                style={{ width: "80px" }} 
                value={props.dialogMode === "edit" ? "Update" : "Save"} 
                onClick={handleSavComponents} 
                />
            </ModalFooterNDL>
        </React.Fragment>
    );
}