import React, { useState, useEffect } from "react";
import Grid from "components/Core/GridNDL";
import { useRecoilState } from "recoil"; 
import CancelIcon from 'assets/neo_icons/Menu/Close_Icon.svg?react';
import InputFieldNDL from "components/Core/InputFieldNDL";
import Button from "components/Core/ButtonNDL";
import { selectedPlant, QualityMetrics, snackToggle, snackMessage, snackType} from "recoilStore/atoms";
import { useTranslation } from 'react-i18next';
import useQuality from "./hooks/useQuality";
import useAddquality from "./hooks/useAddQuality";
import useDelquality from "./hooks/useDelQuality";
import useEditquality from "./hooks/useEditQuality"; 
import EditIcon from 'assets/neo_icons/Menu/EditMenu.svg?react';
 

export default function Quality(props) {
    const { t } = useTranslation(); 
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, setSnackMessage] = useRecoilState(snackMessage);
    const [, setSnackType] = useRecoilState(snackType);
    const [headPlant] = useRecoilState(selectedPlant);
    const [savedQualityMetrics, setSavedQualityMetrics] = useRecoilState(QualityMetrics)
    const [qualityMetrics, setQualityMetrics] = useState(savedQualityMetrics)
    const [deleteObject, setDeleteObject] = useState([])
    const { outQTLoading, outQTData, outQTError, getQuality } = useQuality();
    const { addqualitywithoutIDLoading, addqualitywithoutIDData, addqualitywithoutIDError, getaddqualitywithoutID } = useAddquality()
    const { editqualitywithoutIDLoading, editqualitywithoutIDData, editqualitywithoutIDError, geteditqualitywithoutID } = useEditquality()
    const { delqualitywithoutIDLoading, delqualitywithoutIDData, delqualitywithoutIDError, getdelqualitywithoutID } = useDelquality()
    const [dataload, setDataload] = useState([])
    const [dataid, setDataid] = useState([])
    const [field, setField] = useState([])
    const [isEdit,setisEdit] = useState(false)
    useEffect(() => {
        if (!delqualitywithoutIDLoading && !delqualitywithoutIDError && delqualitywithoutIDData) {
         
            if (delqualitywithoutIDData.delete_neo_skeleton_quality_metrics.affected_rows >= 1) {
                getQuality(headPlant.id);
                setDeleteObject([])
                setSnackMessage(t("Quality Metrics Updated Successfully"));
                setSnackType("success");
                handleSnackOpen();
            } else {
                setSnackMessage(t("Quality Metrics Update Failed"));
                setSnackType("warning");
                handleSnackOpen();
             
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delqualitywithoutIDLoading, delqualitywithoutIDData, delqualitywithoutIDError])
    

    useEffect(() => {
        if (!editqualitywithoutIDLoading && !editqualitywithoutIDError && editqualitywithoutIDData) {
           
            if (editqualitywithoutIDData.update_neo_skeleton_quality_metrics.affected_rows >= 1) {
                getQuality(headPlant.id);
                setSnackMessage(t("Quality Metrics Updated Successfully"));
                setSnackType("success");
                handleSnackOpen();
            } else {
                setSnackMessage(t("Quality Metrics Update Failed"))
                setSnackType("warning");
                handleSnackOpen();
               
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editqualitywithoutIDLoading, editqualitywithoutIDError, editqualitywithoutIDData])
   

    useEffect(() => {
        if (!addqualitywithoutIDLoading && !addqualitywithoutIDError && addqualitywithoutIDData) {
           
            if (addqualitywithoutIDData.insert_neo_skeleton_quality_metrics.affected_rows >= 1) {
                getQuality(headPlant.id);
                setSnackMessage(t("Quality Metrics Updated Successfully"));
                setSnackType("success");
                handleSnackOpen();
            } else {
                setSnackMessage(t("Quality Metrics Update Failed"));
                setSnackType("warning");
                handleSnackOpen();
               
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addqualitywithoutIDLoading, addqualitywithoutIDError, addqualitywithoutIDData]) 
   

    useEffect(() => {
        getQuality(headPlant.id);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant])
    useEffect(() => {
        if(!outQTLoading && outQTData && !outQTError){
            setSavedQualityMetrics(outQTData)
            setQualityMetrics(outQTData)
            datarestructure(outQTData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outQTData])
    const handleSnackOpen = () => {
        setOpenSnack(true);
    };
    const datarestructure = (e) => {
        let result1 = {};
        let result2 = {};
        let obj = {};
        let arraylist = [];
        if (e) {
            for (var i = 0; i < e.length; i++) {
                result1[i] = e[i].parameter;
                obj = { field: i }
                arraylist.push(obj)
            }
            for (var j = 0; j < e.length; j++) {
                result2[j] = e[j].id;
              
            }
            setField(arraylist)
            setDataload([result1])
            setDataid([result2])
        }

    }
   

    const saveMetric = (e) => {
        let totalobjs = [...dataload, ...dataid];
        let arraylist = {}; // Change from array to object
        for (let i of totalobjs) {
            for (let key in i) {
                const parameter = totalobjs[0];
                const id = totalobjs[1];
                arraylist[key] = {
                    id: id[key],
                    parameter: parameter[key]
                };
            }
        }
    
        if (Object.values(arraylist).every((metric) => metric.parameter.replace(/\s/g, '').length > 0)) {
            const insertobject = [];
            const updateobject = [];
    
            Object.values(arraylist).forEach((param) =>
                param.id === ""
                    ? insertobject.push({ "parameter": param.parameter, "line_id": headPlant.id })
                    : updateobject.push({ "id": param.id, "parameter": param.parameter })
            );
    
            const disjoint = updateobject.filter((x) => !savedQualityMetrics.some((y) => y.id === x.id && y.parameter === x.parameter));
    
            if (insertobject.length === 0 && disjoint.length === 0 && deleteObject.length === 0) {
                setSnackMessage(t("Please Edit Or Add Title"));
                setSnackType("warning");
                handleSnackOpen();
            } else {
                if (insertobject.length > 0) {
                    getaddqualitywithoutID(insertobject);
                }
                if (disjoint.length > 0) {
                    disjoint.forEach((obj) => geteditqualitywithoutID({ "id": obj.id, "parameter": obj.parameter, "line_id": headPlant.id }));
                }
                if (deleteObject.length > 0) {
                    getdelqualitywithoutID(deleteObject);
                }
            }
        } else {
            setSnackMessage(t("Metric Name can not be empty"));
            setSnackType("info");
            handleSnackOpen();
        }
        setisEdit(false);
    };
    
    
    
    const createNewField = (e) => {
       
        let setelement = [...field];
        let qualityMet = [...qualityMetrics]; 
        
        const lastfield = setelement.length > 0 ? Number(setelement[setelement.length-1].field) + 1 : 0;
        setelement.push({ field: lastfield });
        qualityMet.push({id: lastfield,parameter:""})                          
        let Datload = dataload.map(val=>{
            return {...val,[lastfield]:''}
        })
      
        setDataload(Datload)
        setQualityMetrics(qualityMet)
        setField(setelement);
    }
    const deleteMetric = (fno,index) => {
        let setelement = [...field];
        let deleterow = [dataload[0]]
        let deleterowid = [dataid[0]]
        delete deleterow[0][fno];
        delete deleterowid[0][fno];
        let removed = setelement.filter(x => x.field!== fno);
        setField(removed);
        setDataload(deleterow);
        setDataid(deleterowid)
        let quality = qualityMetrics.filter((x,i) => (i !== index));
       
        setDeleteObject(deleteObject.concat(qualityMetrics[index].id))
        setQualityMetrics(quality)
        
        
    }
    const updateValue = (e, fields) => {
        let selecteddata = [dataload[0]]
        let selectedid = [dataid[0]]
        var Arr = [...selecteddata];
        var ids = [...selectedid]
        if(e.target.value!==0){
        if (Arr.length === 0) {
            let obj = {};
            obj[fields] = e.target.value;
            ids[0][fields] = ""
            Arr.push(obj);
            setDataload(Arr);

        } else {
            Arr[0][fields] = e.target.value;
            ids[0][fields] = dataid[0][fields] !== undefined ? dataid[0][fields] : '';
            setDataload(Arr);
            setDataid(ids);

        }
       
    } 
}
    return (

        <div className="p-4" > 
                <React.Fragment>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sm={12}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end',columnGap:3 }}>
                                {!isEdit ?
                            <Button type="ghost"  style={{width:"100px", marginRight: '10px' }} onClick={()=>setisEdit(true)} value={"Edit"} icon={EditIcon} />
:
<React.Fragment>
                                <Button type="secondary" style={{width:"100px",marginRight: "10px" }} onClick={() => {
              getQuality(headPlant.id);setisEdit(false);
             
            }} value={t('Cancel')} />
                                <Button type="primary" style={{ marginRight: '10px',width:"100px" }} onClick={saveMetric} value={t('Save')} />

            </React.Fragment>}
                            </div>
                        </Grid> 
                    </Grid>
                </React.Fragment> 
            <div>
                {/* Top section of divcontent starts */}
                {field && field.map((value, index) => {
                    return (
                        <React.Fragment>
                            <div key={index} style={{ display: "flex",padding:10,alignItems: 'center' }}>
                                <div style={{ width: "95%" }}>
                                    <InputFieldNDL
                                        placeholder={t('Title')}
                                        id={index}
                                        value={dataload[0] ? dataload[0][value.field] : ''}
                                        onChange={(e) => updateValue(e, value.field)}
                                        disabled={!isEdit ? true : false}
                                    />
                                </div>
                                <div style={{ width: "5%", paddingLeft: "10px" }}>
                                  {  isEdit &&
                                  <div id={'delete-metric-' + value} style={{ color: "#FF0D00" }} onClick={(e) => { deleteMetric(value.field,index) }} > 
                                        <CancelIcon className="fill-current text-white-500"/> 
                                    </div>}
                                </div>
                            </div>
                        </React.Fragment>
                    )
                })}
                { isEdit &&
                <div className="px-4 py-2.5" style={{ display: 'flex',justifyContent:'end',width:'100%' }}>
                    <Button type="ghost" onClick={createNewField} value={t('AddField')}  />
                </div> 
                }
            </div>
        </div>
    );
}
