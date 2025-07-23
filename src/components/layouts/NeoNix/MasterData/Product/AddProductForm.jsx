import React, { useState, useEffect, useRef } from "react";
import InputFieldNDL from "components/Core/InputFieldNDL";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import ParagraphText from 'components/Core/Typography/TypographyNDL';
import Button from "components/Core/ButtonNDL";
import { useRecoilState } from 'recoil';
import { userData, selectedPlant, snackToggle, snackMessage, snackType, snackDesc } from 'recoilStore/atoms';
import ContentSwitcherNDL from "components/Core/ContentSwitcher/ContentSwitcherNDL";
import Trash from 'assets/neo_icons/trash.svg?react';
import SixDots from 'assets/neo_icons/Neonix/Drag_6_dots.svg?react';
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import useCreateProduct from "./hooks/useCreateProduct";
import useEditProduct from "./hooks/useEditProduct";

export default function AddProductForm({ onClose, editData, onSuccess,...props }) {
    const [headPlant] = useRecoilState(selectedPlant);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [, SetDesc] = useRecoilState(snackDesc);
    const [contentSwitchIndex, setContentSwitchIndex] = useState(0);
    const ProductIDRef =useRef()
    const productNameRef = useRef()
    const descriptionRef = useRef()
    const hsnCodeRef = useRef()
    const [validProductName, setValidProductName] = useState({isValid: true, value: ""});
    const [validProductID, setValidProductID] = useState({isValid: true, value: ""});
    const [validHsnCode, setValidHsnCode] = useState({isValid: true, value: ""});
    const [componentList, setComponentList] = useState([]);
    const [isComponentSelected, setIsComponentSelected] = useState(false);
    const [noproducts, setNoProducts] = useState(false);
 const [bomRows, setBOMRows] = useState([
        { id:1,sequnece: "OP1", operation: "", cycleTime: "", isSelectboxError: false,  isTextFieldError: false },
        { id:2,sequnece: "OP2", operation: "", cycleTime: "", isSelectboxError: false,  isTextFieldError: false },
        { id:3,sequnece: "OP3", operation: "", cycleTime: "", isSelectboxError: false,  isTextFieldError: false },
    ]);

    const {createProductLoading, createProductData, createProductError, createProduct } = useCreateProduct();
    const {editProductLoading, editProductData, editProductError, editProduct } = useEditProduct();

    const buttonList = [
        {id:"DiscreteProduct", value:"Discrete Product", disabled:false},
        {id:"AssembledProduct", value:"Assembled Product", disabled:false},
      ]


      useEffect(() => {
        if(!createProductLoading && createProductData && !createProductError){
            if(createProductData && createProductData === "Created Successfully ") {
                setOpenSnack(true);
                SetMessage("New Product Added");
                SetType("success");
                SetDesc("Product has been successfully added.");
                props.onCancel(true);
            }else if(createProductData === "Product already exists with the same code and material number."){
                setOpenSnack(true);
                SetMessage('Product ID already exists.');
                SetType("error");
                SetDesc("Please use a different Product ID.");
                props.onCancel(false);

            } else {
                setOpenSnack(true);
                SetMessage("Error Adding Product");
                SetType("error");
                SetDesc("An error occurred while adding the product.");
                props.onCancel(false);

            }

        }
      },[createProductLoading, createProductData, createProductError])

      useEffect(() => {
        if(!editProductLoading && editProductData && !editProductError){
            if(editProductData && editProductData === "Created Successfully ") {
                setOpenSnack(true);
                SetMessage("Product Updated");
                SetType("success");
                SetDesc("Product has been successfully updated.");
                props.onCancel(true);
            } else {
                setOpenSnack(true);
                SetMessage("Error Updating Product");
                SetType("error");
                SetDesc("An error occurred while updating the product.");
                props.onCancel(false);

            }

        }
      },[editProductLoading, editProductData, editProductError])
      const contentSwitcherClick = (e) =>{
        setContentSwitchIndex(e)
    }

    useEffect(() => {
        if (editData && Object.keys(editData).length > 0) {
            setContentSwitchIndex(editData.prd_category === "D" ? 0 : 1);
            setValidProductName({ isValid: true, value: editData.matnr });
            setValidProductID({ isValid: true, value: editData.code });
            setTimeout(() => {
                productNameRef.current.value = editData.matnr || "";
                ProductIDRef.current.value = editData.code || "";
                descriptionRef.current.value = editData.description || "";
                hsnCodeRef.current.value = editData.hsn_no || "";
            },300)
            
            if (editData.products && editData.products.length > 0) {
                const updatedBOMRows = editData.products
                .sort((a, b) => {
                    const seqA = parseInt(a.sequnece.replace(/\D/g, ""), 10); // Extract numeric part from sequnece
                    const seqB = parseInt(b.sequnece.replace(/\D/g, ""), 10); // Extract numeric part from sequnece
                    return seqA - seqB; // Sort in ascending order
                })
                .map((item, index) => ({
                    sequnece: "OP" + (index + 1), // Update sequnece to OP1, OP2, etc.
                    id: index + 1,
                    operation: item.op_id,
                    cycleTime: item.cycle_time,
                    isSelectboxError: false,
                    isTextFieldError: false
                }));
                setBOMRows(updatedBOMRows);
            }
            if (editData.component && editData.component.length > 0) {
                const selectedComponentIDs = editData.component.map(item => item.component);
                const selectedComponents = props.ComponentMasterOption.filter(item =>selectedComponentIDs.includes(item.com_id));
                setComponentList(selectedComponents);
            }
        }


    },[editData])

    const handleSaveProduct = () => {
        let hasError = false;
    
        // Validate Product Name
        if (!validProductName.isValid || validProductName.value.trim() === "") {
            setValidProductName({
                ...validProductName,
                isValid: false
            });
            hasError = true;
        }
    
        // Validate Product ID
        if (!validProductID.isValid || validProductID.value.trim() === "") {
            setValidProductID({
                ...validProductID,
                isValid: false
            });
            hasError = true;
        }
    
        // Check for duplicate Product Name
        const isDuplicateName = props.OverallData.some(
            (item) =>
                item.matnr.toLowerCase() === validProductName.value.trim().toLowerCase() &&
                (props.dialogMode !== "edit" || item.code !== editData?.code) // Exclude current record in edit mode
        );
    
        if (isDuplicateName) {
            setValidProductName({
                ...validProductName,
                isValid: false,
                isDuplicate: true
            });
            hasError = true;
        }
    
        // Check for duplicate Product ID
        const isDuplicateID = props.OverallData.some(
            (item) =>
                item.code.toLowerCase() === validProductID.value.trim().toLowerCase() &&
                (props.dialogMode !== "edit" || item.code !== editData?.code) // Exclude current record in edit mode
        );
    
        if (isDuplicateID) {
            setValidProductID({
                ...validProductID,
                isValid: false,
                isDuplicate: true
            });
            hasError = true;
        }
    
        // Validate BOM Rows
        if (contentSwitchIndex === 0) {
            let updatedBOMRows = [...bomRows];
            const hasBOMErrors = updatedBOMRows.some((row, index) => {
                const isOperationEmpty = !row.operation.trim();
                const isCycleTimeEmpty = !row.cycleTime.trim();
                const isCycleTimeInvalid = parseFloat(row.cycleTime) <= 0; // Check if cycle time is greater than 0
    
                const hasError = (isOperationEmpty && !isCycleTimeEmpty) || (!isOperationEmpty && (isCycleTimeEmpty || isCycleTimeInvalid));
                if (hasError) {
                    updatedBOMRows[index] = {
                        ...row,
                        isSelectboxError: isOperationEmpty,
                        isTextFieldError: isCycleTimeEmpty || isCycleTimeInvalid,
                    };
                }
                return hasError;
            });
    
            // Check if at least one record is filled with both operation and cycle time
            const hasAtLeastOneValidRecord = updatedBOMRows.some(row => row.operation.trim() && row.cycleTime.trim());
    
            if (!hasAtLeastOneValidRecord) {
                setNoProducts(true);
                hasError = true;
            } else {
                setNoProducts(false);
            }
    
            setBOMRows(updatedBOMRows); // Update BOM rows with error flags
    
            if (hasBOMErrors) {
                hasError = true;
            }
        } else {
            // Validate Components for assembled products
            if (componentList.length === 0) {
                setIsComponentSelected(true);
                hasError = true;
            } else {
                setIsComponentSelected(false);
            }
        }
    
        // Block save/update if any error occurs
        if (hasError) {
            return false;
        }
    
        // Prepare product data
        const productData = {
            "id": 0,
            "ap_code": "",
            "matnr": validProductName.value.trim(), // name
            "code": validProductID.value.trim(), // id
            "description": descriptionRef.current?.value || "",
            "hsn_no": hsnCodeRef.current?.value || "",
            "status": "Y",
            "prd_category": contentSwitchIndex === 0 ? "D" : "A",
            "create_dt": "",
            "create_by": "",
            "modified_dt": "",
            "modified_by": "",
            products: contentSwitchIndex === 0
                ? bomRows.filter(x => x.operation && x.operation !== '').map((row, i) => ({
                    "id": 0,
                    "ap_code": "",
                    "prod_code": validProductID.value.trim(),
                    "op_id": row.operation,
                    "cycle_time": row.cycleTime,
                    "sequnece": row.sequnece,
                    "status": "Y",
                    "create_dt": "",
                    "create_by": "",
                    "modified_dt": "",
                    "modified_by": "",
                }))
                : [],
            component: contentSwitchIndex === 1
                ? componentList.flatMap(x =>
                    x.items
                        ? x.items.map(item => ({
                            "op_id": item.op_id,
                            "component": x.com_id
                        }))
                        : [{
                            "op_id": -1,
                            "component": x.com_id
                        }]
                )
                : [],
        };
    
        // Call appropriate hook based on edit mode
        if (props.dialogMode === 'edit') {
            editProduct(productData);
        } else {
            createProduct(productData);
        }
    };

    const handleProductNameChange = (e) => {
        const value = e.target.value;
        const isValid =
       /^[a-zA-Z0-9_.\-\[\]{} ]*$/.test(value)
       && value.length <= 50;
 
       setValidProductName({
            isValid: isValid,
            value: value
        });

    }

    const defaultBOMRow = {
        id: "",
        operation: "",
        cycleTime: "",
    };
    
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
                id: index + 1, // Update ID based on new order
                sequnece: `OP${index + 1}` // Update op_id based on new order
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
                sequnece: `OP${index + 1}` // Update op_id based on new order
            }
        })
        setBOMRows(updatedRowsWithSequnece);
    };

    const handleAddBOMRow = () => {
        const nextId = bomRows.length
            ? 1 + bomRows.length
            : 1;

        setBOMRows([
            ...bomRows,
            { ...defaultBOMRow, id: nextId,sequnece: `OP${nextId}`}
        ]);
    };

    const handleProductIDChange = (e) => {
        const value = e.target.value;
        const isValid =
       /^[a-zA-Z0-9_.\-\[\]{} ]*$/.test(value)
       && value.length <= 50;
 
       setValidProductID({
            isValid: isValid,
            value: value
        });
    }

    const validateProductDetails = (ProductDetails,field,isDuplicate) => {
        if(isDuplicate) {
            return `${field} already exists`;
        }
            if (ProductDetails.value.trim() === "" || !/^[a-zA-Z0-9_.\-\[\]{} ]*$/.test(ProductDetails.value)) {
                return `${field} should contain alphanumerics and special chars like -,_,[],{}`;
            } else if (ProductDetails.value !== ProductDetails.value.trim()) {
                return `${field} should contain alphanumerics and special chars like -,_,[],{}`;
            } else if (ProductDetails.value.length > 50) {
                return `${field} must be less than 50 characters`;
            }
        return "";
      }

    const handleComponentChange = (e) => {
        setComponentList(e)
    }

    const handleHsnCodeChange=(e)=>{
    const value = e.target.value;
        const isValid =
       /^[a-zA-Z0-9 ]*$/.test(value)
       && value.length <= 50;
 
       setValidHsnCode({
            isValid: isValid,
            value: value
        });

    }
    return (
        <React.Fragment>
        <ModalHeaderNDL>
            <TypographyNDL value={props.dialogMode === 'edit'  ? "Edit Product"    :"New Product"} variant="heading-02-xs" />
        </ModalHeaderNDL>
        <ModalContentNDL>
            <div className="mb-3">
            <InputFieldNDL
                        label="Product Name"
                        placeholder="Type Product Name"
                        inputRef={productNameRef}
                        mandatory
                        helperText={!validProductName.isValid ? validateProductDetails(validProductName,"Product Name",validProductName.isDuplicate) : ''}
                        error={validProductName && !validProductName.isValid}
                        onChange={handleProductNameChange}
                    />
            </div>
            <div className="mb-3">
            <InputFieldNDL
                        label="Product ID"
                        placeholder="Type Product ID"
                        disabled={props.dialogMode === 'edit' ? true : false}
                        inputRef={ProductIDRef}
                        mandatory
                        helperText={!validProductID.isValid ? validateProductDetails(validProductID,"Product ID",validProductID.isDuplicate) : ''}
                        error={validProductID && !validProductID.isValid}
                        onChange={handleProductIDChange}
                    />
            </div>
                    <div className="mb-3 ">
                    <ContentSwitcherNDL noMinWidth listArray={buttonList} 
                    contentSwitcherClick={props.dialogMode === "create" ? contentSwitcherClick : undefined} 
                    switchIndex={contentSwitchIndex} ></ContentSwitcherNDL>
                    </div>
                    {
                        contentSwitchIndex === 0 &&
                        <React.Fragment>
                        <div className="mb-3">  
                           <InputFieldNDL
                            label="Description"
                            inputRef={descriptionRef}
                            placeholder="Type description here"
                            multiline
                            rows={4}
                            maxLength={'150'}
                        />
                    </div>
                    <div className="mb-3">  
                    <InputFieldNDL
                        label="HSN Code (if applicable)"
                        placeholder="Enter HSN Code"
                        inputRef={hsnCodeRef}
                        helperText={!validHsnCode.isValid ? validateProductDetails(validHsnCode,"HSN Code",validHsnCode.isDuplicate) : ''}
                        error={validHsnCode && !validHsnCode.isValid}
                        onChange={handleHsnCodeChange}

                    />
</div>
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
                                        <InputFieldNDL value={row.sequnece} disabled />
                                    </div>
                                    <div className="col-span-4">
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
                                    <div className="col-span-4">
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

                    {
                        noproducts &&
                        <TypographyNDL
                            value="Please fill at least one operation with cycle time to proceed."
                            variant="paragraph-s"
                            color="danger"
                            className="mt-2" />
                    }
                    </React.Fragment>
                   
                    }
                    
                    {
                        contentSwitchIndex === 1 &&
                        <React.Fragment>
                            <div className="mb-3">
                            <SelectBox
                                            labelId={`Components-label`}
                                            id={`Components-id`}
                                            auto={false}
                                            multiple={true}
                                            isMArray={true}
                                            label="Components"
                                            checkbox={false}
                                            keyValue="com_name"
                                            keyId="com_id"
                                            error={isComponentSelected}
                                            msg={isComponentSelected ? 'Select Components' : ''}
                                            options={props.ComponentMasterOption && props.ComponentMasterOption.length > 0 ? props.ComponentMasterOption : []} // keep empty for now
                                            value={componentList}
                                            onChange={handleComponentChange}
                                            placeholder="Select Components"
                                            mandatory
                                        />
                            </div>
                              <div className="mb-3">  
                           <InputFieldNDL
                            label="Description"
                            inputRef={descriptionRef}
                            placeholder="Type description here"
                            multiline
                            rows={4}
                            maxLength={'150'}
                        />
                    </div>
                    <div className="mb-3">  
                    <InputFieldNDL
                        label="HSN Code (if applicable)"
                        placeholder="Enter HSN Code"
                        inputRef={hsnCodeRef}
                        helperText={!validHsnCode.isValid ? validateProductDetails(validHsnCode,"HSN Code",validHsnCode.isDuplicate) : ''}
                        error={validHsnCode && !validHsnCode.isValid}
                        onChange={handleHsnCodeChange}

                    />
</div>
                        </React.Fragment>
                    }

        </ModalContentNDL>
        <ModalFooterNDL>
                        <Button type="secondary" style={{ width: "80px" }} value="Cancel" onClick={()=>props.onCancel()} />
                        <Button 
                        type="primary" 
                        style={{ width: "80px" }} 
                        value={props.dialogMode === 'edit' ? "Update" : "Save"} 
                        onClick={handleSaveProduct} 
                        />
                    </ModalFooterNDL>
        </React.Fragment>
    );
}
