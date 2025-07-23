/* eslint-disable array-callback-return */
import React, { useState, useEffect, useImperativeHandle } from "react";
import Grid from 'components/Core/GridNDL'
import { useTranslation } from 'react-i18next';
import { useMutation } from "@apollo/client";
import configParam from "config";
import TypographyNDL from "components/Core/Typography/TypographyNDL";
import InputFieldNDL from "components/Core/InputFieldNDL";
import Button from 'components/Core/ButtonNDL';
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';

const AddPartSteelData = React.forwardRef((props, ref) => {

    const { t } = useTranslation();
    const [steelFormLayout, setsteelFormLayout] = useState([]);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if(props.SteelForm.length > 0){
            let steelForm = props.SteelForm[0].form_layout
            setsteelFormLayout(JSON.parse(steelForm))
            // console.log("steelFormLayout",steelForm,"props",props.SteelForm)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.SteelForm])

    useEffect(() => {
        if(props.partTime.steeldata!== undefined){
            setFormData(props.partTime.steeldata)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.partTime])

    useEffect(() => {
        if(props.latestData!== undefined){
            if(props.SteelForm.length > 0){
                let steelForm = props.SteelForm[0].form_layout;
                // console.log(props.latestData)
                // console.log(JSON.parse(steelForm))
                JSON.parse(steelForm).map((item, index) => {
                    if(item?.isAutoPopulate && !props.isEdit){
                        let value = props.latestData[item.FieldName];
                        setFormData(prevData => ({
                            ...prevData,
                            [item.FieldName]: value,
                        }));
                    }
                })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.latestData])

    useImperativeHandle(ref, () =>
        ({
            handleSteelDataDialog: (data) => {
                handleSteelDataDialog(data);
            }
        })
    )

    const handleSteelDataDialog = (data) =>{
        console.log(data);
    }

    const createAddData = () => {
        console.log(props.configData)
        console.log(formData);
        let partData = {
            entity_id: props.configData.entity_id,
            key:props.configData.metric.name,
            value:formData,
            time:props.partTime.time
        };
        
        let temp = { variables: partData }
        if(!props.isEdit) //Create
            addSteelData(temp);
        else//Update
            editSteelData(temp);
    }
    
    const [addSteelData, { error: addSteelDataError }] = useMutation(
        configParam.addPartSteelData, {
        update: (inMemoryCache, returnData) => {
            if (!addSteelDataError) {
                let data = returnData.data.insert_neo_skeleton_steel_data_one
                if (data) {
                    props.openNotification('Steel Data Added Sucessfully ',"success");
                    setFormData({})
                    props.handleAddDataDialogClose();
                    props.treiggerOEE();
                    props.getLatestSteelData()
                }
            }
            else {
                props.openNotification('Failed to add steel data',"error");
                props.handleAddDataDialogClose();
            }
        }
    }
    );

    const [editSteelData, { error: editSteelDataError }] = useMutation(
        configParam.editPartSteelData, {
        update: (inMemoryCache, returnData) => {
            if (!editSteelDataError) {
                let data = returnData.data.update_neo_skeleton_steel_data.affected_rows >= 1
                if (data) {
                    props.openNotification('Steel Data Updated Sucessfully ',"success");
                    setFormData({})
                    props.handleAddDataDialogClose();
                    props.treiggerOEE();
                    props.getLatestSteelData()
                }
            }
            else {
                props.openNotification('Failed to update steel data',"error");
                props.handleAddDataDialogClose();
            }
        }
    }
    );
    
    const handleInputChange = (fieldName, value) => {
        setFormData(prevData => ({
            ...prevData,
            [fieldName]: value,
        }));
    };

    const handleFocus = (fieldName, index) => {
        console.log(fieldName, index)
        console.log(props.latestData)
        console.log(steelFormLayout[index],props.latestData[fieldName])
        console.log(formData,formData[fieldName])
        
    }
    
    return (
        <React.Fragment>
            <ModalHeaderNDL>
                <TypographyNDL variant="heading-02-xs" value={props.isEdit && props.SteelForm.length > 0 ? "Update" + t( " Steel Data") : "Add" + t( " Steel Data")}/>
                </ModalHeaderNDL>
                <ModalContentNDL>
                             
                {steelFormLayout.length > 0 ? (
            <Grid container spacing={2}>
                {steelFormLayout.map((item, index) => (
                    <Grid item xs={12} key={item.FieldName}>

                        
                        {item.FieldType === "Dropdown" && (
                            
                            <SelectBox
                            labelId=""
                            id="combo-box-demo"
                            auto={false}
                            multiple={false}
                            label={item.FieldName}
                            options={item.FieldOptions.length>0 ? item.FieldOptions.map(x=>{ return {name: x}}) : ''}
                            keyValue="name"
                            keyId="name"
                            value={formData[item.FieldName] || ''}
                            isMArray={true}
                            onChange={(e) => handleInputChange(item.FieldName, e.target.value)}
                           
                        />
                        ) }

                        {item.FieldType === "TextInput" && (
                            <InputFieldNDL
                                id={item.FieldName}
                                label={item.FieldName}
                                placeholder={item.FieldName}
                                type="text" 
                                value={formData[item.FieldName] || ''}
                                onChange={(e) => handleInputChange(item.FieldName, e.target.value)}
                                onFocus={(e) => handleFocus(item.FieldName, index)}
                            />
                            
                        )}
                         {item.FieldType === "NumberInput" && (
                            <InputFieldNDL
                                id={item.FieldName}
                                label={item.FieldName}
                                placeholder={item.FieldName}
                                type="number"
                                value={formData[item.FieldName] || ''}
                                onChange={(e) => handleInputChange(item.FieldName, e.target.value)}
                                onFocus={(e) => handleFocus(item.FieldName, index)}
                                onWheel={(e)=> e.target.blur()}
                                onKeyDown
                            />
                            
                        )}
                                                    
                    </Grid>
                ))}
            </Grid>
        ) : (
            
            <TypographyNDL variant="lable-01-s" value={t("No Data- Please add the data in steel form under the settings->Production")} />
        )}
               
                    
                </ModalContentNDL>
                <ModalFooterNDL>
                {
                steelFormLayout.length > 0 ? 
                (
                <><Button type="secondary" value={t('Cancel')} onClick={props.handleAddDataDialogClose} /><Button value={t("Submit")} onClick={() => createAddData()} /></>
                ):
                (
                    <Button type="secondary" value={t('Cancel')} onClick={props.handleAddDataDialogClose} />
                )
}
                </ModalFooterNDL>
        </React.Fragment>
    );
});
export default AddPartSteelData;

