/* eslint-disable array-callback-return */
import React, { useState, useEffect, useImperativeHandle } from "react";
import Grid from 'components/Core/GridNDL'
import { useTranslation } from 'react-i18next';
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import InputFieldNDL from "components/Core/InputFieldNDL";
import { useRecoilState } from "recoil";
import { selectedPlant, snackToggle, snackMessage, snackType,assetHierarchy } from "recoilStore/atoms";
import Button from 'components/Core/ButtonNDL';
import Delete from 'assets/neo_icons/Menu/ActionDelete.svg?react';
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import ValidCheck from 'assets/neo_icons/Steel/ValidCheck.svg?react';
import InvalidCheck from 'assets/neo_icons/Steel/InvalidCheck.svg?react';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';

//Hooks
import useDeleteSteelAssetConfig from "../hooks/useDeleteSteelAssetConfig";
import useUpdateCalculations from "../hooks/useUpdateCalculations";


const AddCalculations = React.forwardRef((props, ref) => {

    const { t } = useTranslation();
    const [headPlant] = useRecoilState(selectedPlant);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [addCalcDialog, setAddCalcDialog] = useState(false);
    const [isAllValid, setIsAllValid] = useState(false);
    const [fromError, setFormError] = useState("");
    const [asset,]=useRecoilState(assetHierarchy)
    const [addCalcDialogMode, setAddCalcDialogMode] = useState("create");
    const [steelAssetConfigID, setSteelAssetConfigID] = useState({ value: "", name: "", product: "", formLayout: "",entityID:"" });
    const [MetricFields, setMetricFields] = useState([{ field: 1, FieldName: '', Formula: '', isValidFormula: true, isVerfiedFormula: false, errorMsg: "", ferrorMsg: "" }]);
    
    const { DeleteSteelAssetConfigLoading, DeleteSteelAssetConfigData, DeleteSteelAssetConfigError, getDeleteSteelAssetConfig } = useDeleteSteelAssetConfig();
    const { UpdateCalculationsLoading, UpdateCalculationsData, UpdateCalculationsError, getUpdateCalculations } = useUpdateCalculations();

    useEffect(() => {
        if (!DeleteSteelAssetConfigLoading && !DeleteSteelAssetConfigError && DeleteSteelAssetConfigData) {
            if (DeleteSteelAssetConfigData.affected_rows >= 1) {
                handleAddCalcDialogClose();
                SetMessage(t('Deleted ') + steelAssetConfigID.name)
                SetType("success")
                setOpenSnack(true)
                props.getUpdatedSteelAssetConfig(headPlant.id)
            } else {
                handleAddCalcDialogClose();
                SetMessage(steelAssetConfigID.name + t('deletion failed'))
                SetType("warning")
                setOpenSnack(true)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DeleteSteelAssetConfigLoading, DeleteSteelAssetConfigData, DeleteSteelAssetConfigError])

    useEffect(() => {
        if (UpdateCalculationsData && !UpdateCalculationsLoading && !UpdateCalculationsError) {
            if (UpdateCalculationsData.affected_rows >= 1) {
                handleAddCalcDialogClose();
                SetMessage(t('Updated the calculations for ') + steelAssetConfigID.name)
                SetType("success")
                setOpenSnack(true);
                props.setHandleCancelClick();
                props.getUpdatedSteelAssetConfig(headPlant.id)
            } else {
                handleAddCalcDialogClose();
                SetMessage(t('Failed to update the calculations for ') + steelAssetConfigID.name)
                SetType("error")
                setOpenSnack(true)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [UpdateCalculationsData]);

    useImperativeHandle(ref, () =>
    (
        {
            handleAddCalcDialog: (data) => {
                if (data.calculations && data.calculations.length > 0) {
                    setAddCalcDialogMode("edit")
                    setMetricFields(data.calculations)
                }
                else {
                    setAddCalcDialogMode("create")
                    setMetricFields([{ field: 1, FieldName: '', Formula: '', isValidFormula: true, isVerfiedFormula: false, errorMsg: "", ferrorMsg: "" }])
                }
                setSteelAssetConfigID({ value: data.id, name: data.entity.name, product: data.steel_product.name, formLayout: data.form_layout,entityID:data.entity_id })
                setFormError("")
                setAddCalcDialog(true)
            },
            handleDeleteDialogOpen: (data) => {

                setAddCalcDialogMode("delete")
                setSteelAssetConfigID({ value: data.id, name: data.entity.name, product: data.steel_product.name, formLayout: data.form_layout,entityID:data.entity_id })
                setFormError("")
                setAddCalcDialog(true);
            },  
            handleEditDialogOpen: () => {
                handleEditCalcDialog();
            },
            handleConfirmDialogOpen: (data) => {
                setAddCalcDialogMode("confirm")
                if (data.calculations && data.calculations.length > 0) {
                    setMetricFields(data.calculations)
                }
                else {
                    setMetricFields([{ field: 1, FieldName: '', Formula: '', isValidFormula: true, isVerfiedFormula: false, errorMsg: "", ferrorMsg: "" }])
                }
                setSteelAssetConfigID({ value: data.id, name: data.entity.name, product: data.steel_product.name, formLayout: data.form_layout,entityID:data.entity_id })
                setFormError("")
                setAddCalcDialog(true);
            }

        }
    ))

    const handleEditCalcDialog = () => {
        if(addCalcDialogMode === "confirm"){
            if(MetricFields[0]['FieldName'] !== "")
                BindEditDataCalculations();
            else
                setAddCalcDialogMode("create")
        }
        else
            BindEditDataCalculations()
    }

    const handleAddCalcDialogClose = () => {
        setAddCalcDialog(false);
        setFormError("")
        setSteelAssetConfigID({ value: "", name: "", product: "", formLayout: "",entityID:"" })
        props.handleAddCalcDialogClose()
    };

    const handleSaveClick = () => {

        if (addCalcDialogMode === "delete") {
            getDeleteSteelAssetConfig(steelAssetConfigID.value)
        }
        else {

            let FieldNameValid = false
            let FormulaValid = false
            // eslint-disable-next-line array-callback-return
            MetricFields.forEach(val => {
                if (!val.FieldName) {
                    FieldNameValid = true;
                }
                if (!val.Formula || !val.isVerfiedFormula) {
                    FormulaValid = true;
                }
                if(val.ferrorMsg !=='' ){ 
                    setFormError(t('Please fill unique field name for all formula'))
                    return false
                }
            })

            if (FieldNameValid) { 
                setFormError(t('Please fill all the field name'))
                return false
            }

            if (FormulaValid) { 
                setFormError(t('Please fill all the formula and check verified'))
                return false
            }

            if (addCalcDialogMode === "create" || addCalcDialogMode === "edit") {
                setFormError("")
                let formulasArr = []
                if (MetricFields.length > 0) {
                    // eslint-disable-next-line array-callback-return
                    MetricFields.forEach(val => {
                        formulasArr.push({
                            "field": val.field,
                            "FieldName": val.FieldName,
                            "Formula": val.Formula,
                            "isVerfiedFormula": val.isVerfiedFormula,
                            "isValidFormula": val.isValidFormula,
                            "errorMsg": val.errorMsg, 
                            "ferrorMsg": val.ferrorMsg
                        })
                    })
                }

                getUpdateCalculations(steelAssetConfigID.value, formulasArr)

            }
        }
    }

    function AddFormulaFields() {
      
        let setelement = [...MetricFields];
        const lastfield = setelement.length > 0 ? Number(setelement[setelement.length - 1].field) + 1 : 1;
        setelement.push({ field: lastfield, FieldName: '', Formula: '', isValidFormula: true, isVerfiedFormula: false, errorMsg: "", ferrorMsg: "" });
        setIsAllValid(setelement.isVerfiedFormula)
        setMetricFields(setelement);
    }

    function validateFieldNames(name,index){//Validate unique Field name
        let setelement = [...MetricFields];
        const found = setelement.filter(el => el.FieldName === name);
        return found.length > 1;
    }

    const removeFormulaFields = (field) => {
        let setelement = [...MetricFields];
        let removed = setelement.filter(x => x.field !== field);
      
        setMetricFields(removed);
         /** check all formula fields */
         let formulaValidation = true;
         removed.forEach((elt,index) => {
            if(!elt.isVerfiedFormula){
                formulaValidation = false
                elt.isValidFormula = false;
                elt.isVerfiedFormula = false; 
            }
            else{
                if(validateFieldNames(elt.FieldName,index)){ // FieldName unique validation
                    formulaValidation = false;
                    elt.isVerfiedFormula = false;
                    elt.ferrorMsg =   "Please change the field name"
                }
            }
        });
        setIsAllValid(formulaValidation)
    }

    function handleFieldName(e, field) {

        let setelement = [...MetricFields];
        const fieldIndex = setelement.findIndex(x => x.field === field);
        let fieldObj = { ...setelement[fieldIndex] };

        fieldObj['FieldName'] = e.target.value
        fieldObj['isVerfiedFormula'] = false
        let isRepeat = validateFieldNames(e.target.value,fieldIndex)//Validate unique Field name
        if(isRepeat)
            fieldObj['ferrorMsg'] = "Please change the field name"
        else
            fieldObj['ferrorMsg'] = ""
        setelement[fieldIndex] = fieldObj;

        setMetricFields(setelement);
        setIsAllValid(false);
    }

    function handleFormulaField(e, field) {

        let setelement = [...MetricFields];
        const fieldIndex = setelement.findIndex(x => x.field === field);
        let fieldObj = { ...setelement[fieldIndex] };

        fieldObj['Formula'] = e.target.value
        fieldObj['isVerfiedFormula'] = false
        setelement[fieldIndex] = fieldObj;

        setMetricFields(setelement);
        setIsAllValid(false);
    }

    const verifyFormulaFields = (field) => {

        let setelement = [...MetricFields];
        const fieldIndex = setelement.findIndex(x => x.field === field);
        let fieldObj = { ...setelement[fieldIndex] };

        if (fieldObj.Formula !== "") {
            const inputString = fieldObj.Formula
          
            let regex = /\b[a-zA-Z0-9]\w*(?:\s[a-zA-Z0-9]\w*)*\b/g;
         

            let variables = inputString.match(regex);
            let formLayout = JSON.parse(steelAssetConfigID.formLayout);
           
            
        
            let fieldNames = formLayout.map((obj) => getFieldName(obj))
           
           
         
           
            processAsset(asset, steelAssetConfigID, fieldNames)
          
            let formulaValidation = true
            
            variables.forEach(variable => {
                const isNumber = !isNaN(variable);
                if (!fieldNames.includes(variable)  && !isNumber) {
                    console.log(`Variable "${variable}" is not present in the field names.
                  `);
                    formulaValidation = false
                }
               
            });

            setIsAllValid(formulaValidation)

            if (formulaValidation) {
                fieldObj['isVerfiedFormula'] = true
                fieldObj['isValidFormula'] = true
                fieldObj['errorMsg'] = ""
                fieldObj['ferrorMsg'] = ""
                setelement[fieldIndex] = fieldObj;

                setMetricFields(setelement);
                
                /** check all formula fields */
                setelement.forEach((elt,index) => {
                    if(!elt.isVerfiedFormula){
                        formulaValidation = false
                        elt.isValidFormula = false;
                        elt.isVerfiedFormula = false; 
                    }
                    else{
                        if(validateFieldNames(elt.FieldName,index)){ // FieldName unique validation
                            formulaValidation = false;
                            elt.isVerfiedFormula = false;
                            elt.ferrorMsg =   "Please change the field name"
                        }
                    }
                });
                setIsAllValid(formulaValidation)
            } else {
                fieldObj['isVerfiedFormula'] = false
                fieldObj['isValidFormula'] = false
                fieldObj['errorMsg'] = "Entered inputs are not matching with the form"
                fieldObj['ferrorMsg'] = ""
                setelement[fieldIndex] = fieldObj;

                setMetricFields(setelement);
            }
        } else {
            fieldObj['isVerfiedFormula'] = false
            fieldObj['isValidFormula'] = false
            fieldObj['errorMsg'] = "Please enter the formula"
            fieldObj['ferrorMsg'] = ""
            setelement[fieldIndex] = fieldObj;

            setMetricFields(setelement);
        }

    }

    function getFieldName(obj) {
        if (obj.FieldType !== 'TextInput') {
            if (obj.FieldType === 'Dropdown') {
                const areAllNumbers = obj.FieldOptions.every(option => !isNaN(option));
                if (areAllNumbers) {
                    return obj.FieldName;
                }
            } else {
                return obj.FieldName;
            }
        }
    }
    function processAsset(Asset, SteelAssetConfigID, fieldNames) {
        Asset.forEach(entity => {
            if (entity.id === SteelAssetConfigID.entityID) {
                entity.children.forEach(instrument => {
                    instrument.children.forEach(metric => {
                        fieldNames.push(metric.metric_name);
                    });
                });
            }
        });
    }
    

    const BindEditDataCalculations = () => {
        let setelement = [...MetricFields];

        // eslint-disable-next-line array-callback-return
        setelement.forEach((val, fieldIndex) => {
            let fieldObj = { ...setelement[fieldIndex] };
            const inputString = fieldObj.Formula;
        
            let regex = /\b[a-zA-Z]\w*(?:\s[a-zA-Z]\w*)*\b/g;
        
            let variables = inputString.match(regex);
            let formLayout = JSON.parse(steelAssetConfigID.formLayout);
            let fieldNames = formLayout.map((obj) => getFieldName(obj));
            if (fieldNames.length === 1 && fieldNames[0] === undefined) {
                fieldNames = [];
            }
          
            processAsset(asset, steelAssetConfigID, fieldNames)
           
        
            let formulaValidation = true;
            if (variables) {
                variables.forEach(variable => {
                    const isNumber = !isNaN(variable);
                    if (!fieldNames.includes(variable) && !isNumber) {
                        console.log(`Variable "${variable}" is not present in the field names.`);
                        formulaValidation = false;
                    }
                });
            }
        
            setIsAllValid(formulaValidation);
        
            if (formulaValidation) {
                if(validateFieldNames(val.FieldName,fieldIndex)){ // FieldName unique validation
                    fieldObj['isVerfiedFormula'] = false;
                    fieldObj['isValidFormula'] = false
                    fieldObj['errorMsg'] = ""
                    fieldObj['ferrorMsg'] =   "Please change the field name"
                }
                else{
                    fieldObj['isVerfiedFormula'] = true
                    fieldObj['isValidFormula'] = true
                    fieldObj['errorMsg'] = ""
                    fieldObj['ferrorMsg'] = ""
                }
                setelement[fieldIndex] = fieldObj;
            } else {
                fieldObj['isVerfiedFormula'] = false
                fieldObj['isValidFormula'] = false
                fieldObj['errorMsg'] = "Entered inputs are not matching with the form"
                fieldObj['ferrorMsg'] = ""
                setelement[fieldIndex] = fieldObj;
            }
        });
        

        setMetricFields(setelement);

        setAddCalcDialogMode("create")
        setAddCalcDialog(true)

    }

    let operationLabel;

        if (addCalcDialogMode === "create") {
            operationLabel = t('Data Calculations');
        } else if (addCalcDialogMode === "edit") {
            operationLabel = t('Data Calculations');
        } else {
            operationLabel = t('Delete');
        }

     const label = `${operationLabel} - ${steelAssetConfigID.product} (${steelAssetConfigID.name})`;


    return (
        <React.Fragment>
            {addCalcDialog &&
                <React.Fragment>
                    <ModalHeaderNDL>
                        {addCalcDialogMode === "confirm" && 
                            <TypographyNDL variant="heading-02-s" model value={t('Action Required!')} /> 
                        }
                        {addCalcDialogMode !== "confirm" && 
                        <TypographyNDL variant="heading-02-s" model value={label} />
                        }
                    </ModalHeaderNDL>
                    <ModalContentNDL>
                        {addCalcDialogMode === "confirm" &&
                            <TypographyNDL variant="lable-01-s" color="secondary" value={t("The changes done in this form might impact the data calculations, please do the required changes in the formula and validate.")} />
                        }
                        {addCalcDialogMode === "delete" &&
                            <TypographyNDL variant="lable-01-s" color="secondary" value={t("Steel configuration for ") + steelAssetConfigID.name + t(" shall be deleted.Are you sure") + t('NotReversible')} />
                        }
                        {
                            addCalcDialogMode === "create" &&

                            <Grid item xs={12}>
                                <Grid item xs={12}>
                                    <TypographyNDL variant="lable-01-s" color="danger" value={fromError} />
                                </Grid>
                                {MetricFields.map((val) => {
                                    return (
                                        <Grid container>
                                            <Grid item xs={3}>
                                                <InputFieldNDL
                                                    id="Field"
                                                    label={t("Field")}
                                                    placeholder={t('Field')}
                                                    value={val.FieldName}
                                                    dynamic={MetricFields}
                                                    onChange={(e) => handleFieldName(e, val.field)}
                                                    error = {val.ferrorMsg ? true: false}
                                                    helperText = {val.ferrorMsg}
                                                />
                                            </Grid>
                                            <Grid item xs={1} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <TypographyNDL variant="xl-heading-04" style={{ paddingTop: '15px' }} value={"="} ></TypographyNDL>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <InputFieldNDL
                                                    id="Formula"
                                                    label={t("Formula")}
                                                    placeholder={t("Formula")}
                                                    value={val.Formula}
                                                    dynamic={MetricFields}
                                                    onChange={(e) => handleFormulaField(e, val.field)}
                                                    error={val.isValidFormula ? false : true}
                                                    helperText={val.isValidFormula ? "" : val.errorMsg}
                                                />
                                            </Grid>
                                            <Grid item xs={1} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {val.isVerfiedFormula ? <ValidCheck style={{ marginTop: "19px" }} onClick={() => verifyFormulaFields(val.field)} /> : <InvalidCheck style={{ marginTop: "19px" }} onClick={() => verifyFormulaFields(val.field)} />}
                                            </Grid>
                                            <Grid item xs={1} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Button type="ghost" danger icon={Delete} stroke={"#FF0D00"} style={{ marginTop: "15px" }} onClick={() => removeFormulaFields(val.field)} />
                                            </Grid>

                                        </Grid>)
                                }
                                )}

                                <Grid container>
                                    <Grid item xs={12} align={'right'}>
                                        <div className="flex justify-end">
                                            <Button type="tertiary" style={{ width: "120px" }} value={t("Add Field")} icon={Plus} onClick={AddFormulaFields} />
                                        </div>
                                    </Grid>
                                </Grid>

                            </Grid>
                        }

                        {
                            addCalcDialogMode === "edit" &&

                            <Grid item xs={12}>
                                {MetricFields.map((val) => {
                                    return (
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <TypographyNDL variant="label-02-s" color="secondary" value={val.FieldName} />
                                                <TypographyNDL variant="lable-01-s" color="secondary" value={val.Formula} />
                                            </Grid>
                                            <br></br>
                                        </Grid>)
                                }
                                )}

                            </Grid>
                        }

                    </ModalContentNDL>
                    <ModalFooterNDL>
                        {addCalcDialogMode !== "confirm" && 
                        <Button type="secondary" value={addCalcDialogMode === "Delete" ? t('NoCancel') : t('Cancel')} onClick={() => handleAddCalcDialogClose()} />
                        }
                        {addCalcDialogMode === "delete" && <Button type="primary" danger value={t('YesDelete')} onClick={() => handleSaveClick()} />}
                        {addCalcDialogMode !== "delete" && addCalcDialogMode !== "edit" && addCalcDialogMode !== "confirm" && <Button type="primary" value={t('Save')} disabled={!isAllValid} onClick={() => handleSaveClick()} />}
                        
                        {addCalcDialogMode === "edit" && <Button type="primary" value={t('Edit')} onClick={() => handleEditCalcDialog()} />}

                        {addCalcDialogMode === "confirm" && <Button type="primary" value={t('Proceed')} onClick={() => handleEditCalcDialog()} />}

                    </ModalFooterNDL>
                </React.Fragment>}
        </React.Fragment>
    );
});
export default AddCalculations;

