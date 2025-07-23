/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import SelectBox from "components/Core/DropdownList/DropdownListNDL"; 
import { useTranslation } from 'react-i18next';
import Grid from 'components/Core/GridNDL';
import { useRecoilState } from "recoil";
import { user, selectedPlant, snackToggle, snackMessage, snackType } from "recoilStore/atoms";
import "components/style/instrument.css";
import { trim } from "lodash";  
import AddLight from 'assets/neo_icons/Menu/add.svg?react';
import Delete from 'assets/neo_icons/Menu/ActionDelete.svg?react';
import configParam from "config";
import InputFieldNDL from "components/Core/InputFieldNDL";
import Button from "components/Core/ButtonNDL";  
//Hooks 
import useCheckInstrumentId from "./Hooks/useCheckInstrumentId";
import useCheckInstrumentName from "./Hooks/useCheckInstrumentName";
import useAddInstrumentwithID from "./Hooks/useAddInstrumentWithID";
import useAddInstrumentMetrics from "./Hooks/useAddInstrumentMetrics";
import useAddInstrumentwithoutID from "./Hooks/useAddInstrumentWithoutID";
import useUpdateInstrument from "./Hooks/useUpdateInstrument";
import useDeleteInstrumentFormula from "./Hooks/useDeleteInstrumentFormula";
import useAddInstrumentMetricsForecast from "./Hooks/useAddInstrumentMetricsForecast";
import useBuildYourModel from "./Hooks/useBuildYourModel";
import useBuildYourAnamolyModel from "./Hooks/useBuildYourAnamolyModel";
import useUpdateInstrumentMetricForecast from "./Hooks/useUpdateInstrumentMetricForecast";
import moment from "moment";
import AddMetric from "./AddMetric";
import useDeleteInstrument from "./Hooks/useDeleteInstrument";
import useUpdateFrequency from "./Hooks/useUpdateFrequency";
import useUpdateMetricScalingFactor from "./Hooks/useUpdateMetricScalingFactor";
import useInstrumentMetricFrequency from "./Hooks/useInstrumentMetricFrequency";
import useInstrumentType from "Hooks/useInstrumentType";
import CustomSwitch from "components/Core/CustomSwitch/CustomSwitchNDL";
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from 'components/Core/ModalNDL/ModalFooterNDL';
import TypographyNDL from "components/Core/Typography/TypographyNDL"; 
import useRefreshInstrument from "./Hooks/useRefreshInstrumentData";
import RadioNDL from 'components/Core/RadioButton/RadioButtonNDL'; 
const userWhoCanAddMetrics = ['d20da312-555f-4348-b18b-5b79ddaf8a16', '0a696f6f-aa86-47bc-a242-7b5877637f17', '1f7c38ad-c3e1-449a-b4d5-b8778edf41f2', '6e3388da-b962-45ee-a253-8a6676840fce', '9cae736a-ce84-4427-8896-7743d6589d6a', 'd91a9f8b-6fcf-4bb3-93b1-381dee918921', '9891bff6-792e-4d32-816e-6dca0a324c00', '3ad80462-7fff-4a02-af65-2565e1ab7134', '80e4e0c7-9da6-40da-a001-0bc207ea5707', '7aea64c5-3eb5-4338-874d-cccb560c1a60'];


const AddInstrument = React.forwardRef((props, ref) => {
    const { t } = useTranslation();
    const [currUser] = useRecoilState(user);
    const [headPlant] = useRecoilState(selectedPlant);
    const [, setOpenSnack] = useRecoilState(snackToggle);
    const [, SetMessage] = useRecoilState(snackMessage);
    const [, SetType] = useRecoilState(snackType);
    const [metricsID, setMetricsID] = useState([]);
    const [fcMetricsID, setFCMetricsID] = useState([]);
    const [MetricDialog, setMetricDialog] = useState(false);
    const [instrumentValidation, setInstrumentValidation] = useState(true);
    const [errormsg, setErrorMsg] = useState('');
    const [freqInputError, setFreqInputError] = useState('');
    const [textInputError, setTextInputError] = useState('');
    const [instrumentNameErr, setInstrumentNameErr] = useState('');
    const [instrumentCategoryErr, setInstrumentCategoryErr] = useState('');
    const [instrumentMetricsError, setMetricsError] = useState('');
    const [instrumentTypeError, setTypeError] = useState('');
    const [instrumentIdErr, setInstrumentIdErr] = useState('');
    const [, setInstrumentErr] = useState(false);
    const [formulaName, setFormulaName] = useState('')
    const [InstID, setInstrumentID] = useState('')
    const [isOffline, setIsOffline] = useState(false);
    const [offlineFreq, setOfflineFreq] = useState(0)
    const [isForeCast, setIsForeCast] = useState(false);

    const { checkInstrumentIdLoading, checkInstrumentIdData, checkInstrumentIdError, getCheckInstrumentId } = useCheckInstrumentId()
    const { checkInstrumentNameLoading, checkInstrumentNameData, checkInstrumentNameError, getCheckInstrumentName } = useCheckInstrumentName()
    const { AddInstrumentwithIDLoading, AddInstrumentwithIDData, AddInstrumentwithIDError, getAddInstrumentwithID } = useAddInstrumentwithID()
    const { AddInstrumentMetricsLoading, AddInstrumentMetricsData, AddInstrumentMetricsError, getAddInstrumentMetrics } = useAddInstrumentMetrics()
    const { AddInstrumentwithoutIDLoading, AddInstrumentwithoutIDData, AddInstrumentwithoutIDError,getAddInstrumentwithoutID  } = useAddInstrumentwithoutID()
    const { UpdateInstrumentLoading, UpdateInstrumentData, UpdateInstrumentError ,getUpdateInstrument } = useUpdateInstrument()
    const { DeleteInstrumentFormulaLoading, DeleteInstrumentFormulaData, DeleteInstrumentFormulaError, getDeleteInstrumentFormula } = useDeleteInstrumentFormula()
    const { DeleteInstrumentLoading, DeleteInstrumentData, DeleteInstrumentError,getDeleteInstrument  } = useDeleteInstrument()
    const { UpdateFrequencyLoading, UpdateFrequencyData, UpdateFrequencyError, getUpdateFrequency } = useUpdateFrequency()
    const { UpdateMetricScalingFactorLoading, UpdateMetricScalingFactorData, UpdateMetricScalingFactorError, getUpdateMetricScalingFactor } = useUpdateMetricScalingFactor()
    const { InstrumentMetricFrequencyLoading, InstrumentMetricFrequencyData, InstrumentMetricFrequencyError, getInstrumentMetricFrequency } = useInstrumentMetricFrequency()
    const { InstrumentTypeListLoading, InstrumentTypeListData, InstrumentTypeListError, getInstrumentType } = useInstrumentType()
    const { RefreshInstrumentlLoading, RefreshInstrumentlData, RefreshInstrumentlError, getRefreshInstrument } = useRefreshInstrument();
    const { AddInstrumentMetricsForecastLoading, AddInstrumentMetricsForecastData, AddInstrumentMetricsForecastError, getAddInstrumentMetricsForecast } = useAddInstrumentMetricsForecast()
    const { ModelLoading, ModelData, ModelError, getBuildYourModel } = useBuildYourModel()
    const { getBuildYourAnamolyModel } = useBuildYourAnamolyModel();
    const { UpdateInstrumentMetricForecastLoading, UpdateInstrumentMetricForecastData, UpdateInstrumentMetricForecastError, getUpdateInstrumentMetricForecast } = useUpdateInstrumentMetricForecast();


    const InstrumentName = useRef()
    const InstrumentID = useRef()
    const Frequency = useRef()
    
    const [formulaDialog, setFormulaDialog] = useState(false);
    const [formulaDialogMode, setFormulaDialogMode] = useState('create');
    const [categoryID, setCategoryID] = useState('');
    const [isoID, setisoID] = useState(2);
    const [typeID, setTypeID] = useState('');
    const [types, setTypes] = useState([]);
    const [insFreq, setInsFreq] = useState('');
    const [, setModulClose] = useState(false);
    const [, setFCMetricsName] = useState([])
    const [, setMetricsText] = useState('');
    const [newMetric, SetNewMetric] = useState([]);
    const [extMetric, SetExeMetric] = useState([]);
    const [newFCMetric, SetFCNewMetric] = useState([]);
    const [extFCMetric, SetFCExeMetric] = useState([]);
    const [instrumentDialogMode, setInstrumentDialogMode] = useState('instrumentDetails');
    const [isScalingFactors, setIsScalingFactors] = useState(false);
    const [MetricFields,setMetricFields] = useState([{field : 1,metric_id: '',mFactor:'',calibrationValue:''}]);
    const [metricsList, setMetricsList] = useState([]);
    const [removedFactor, setRemovedFactor] = useState([]);
    const [updatedFactor, setUpdatedFactor] = useState([]);
    const [, setIname] = useState("");
    const [, setInstrument_Id] = useState("");
    const [, setDelID] = useState("");
    const [IID, setIID] = useState("");
    const FactorRef = useRef();
    const CalibrateRef = useRef();
    const [isoVisible,setIsoVisible ] = useState(false);
    const [updateForeCastData,setupdateForeCastData] = useState([])
    useEffect(()=>{
        if(!props.formulaDialog){
            handleFormulaDialogClose()
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[props.formulaDialog])

    useImperativeHandle(ref, () =>
    (
        {
            handleFormulaCrudDialogDelete: (id, data) => {
                setInstrumentID(data && data.id ? data.id : "")
                setInsFreq(data.frequncy)
                setFormulaName(data && data.name ? data.name : "")
                setCategoryID(data && data.instrument_category ? data.instrument_category.id : "");
                setTypeID(data && data.instrumentTypeByInstrumentType ? data.instrumentTypeByInstrumentType.id : "");
                setFormulaDialogMode('delete');
                setFormulaDialog(true);
            },
            handleFormulatDialogAdd : () => {
                setFormulaDialogMode('create');
                setFormulaDialog(true);
                setModulClose(false);
                setErrorMsg("");
                setMetricsID([])
                setFCMetricsName([])
                setFCMetricsID([])
                setMetricsText([])
                setInstrumentValidation(true)
            },

            handleFormulaCrudDialogDuplicate : (id, data) => {
              
            
                if (data && data.id) getInstrumentMetricFrequency(data.id)
                else setInsFreq(0)
        
                setFCMetricsName([])
        
                const metriclist = data && data.instruments_metrics ? data.instruments_metrics : [];
                let metricsid = [];
                let metricslist = [];
                let fcmetricsid = [];
                let fcmetricslist = [];
                if (metriclist.length > 0) {
                    metriclist.map(val => {
                        console.log('val',val)
                        if (val.metric) {
                            metricsid.push(val.metric);
                            metricslist.push({ "title": val.metric.title });
                            if(val.enable_forecast){// if (val.instruments_metrics_forecasting) {
                                // console.log('hi5665',val)
                                fcmetricsid.push(val.metric);
                                fcmetricslist.push({ "title": val.metric.title });
                            }
                        }
                        
                    })
                }
                let scalingFactor = metriclist.length > 0 ? calculateScalingFactor(metriclist) : [];

               if(scalingFactor.length === 0){
                scalingFactor.push({field : 1,metric_id: '',mFactor:'',calibrationValue:''})
               }
               let optMetrics = [];
               if (props.metrics.length > 0 && metricsid.length > 0) {
                   optMetrics = metricsid.map(val => {
                       return props.metrics.filter((item) => item.id === val.id)[0]
                   })
               }
                setMetricsList(optMetrics);
                setMetricsID(metricsid)
                SetExeMetric(metricsid)
            //  console.log(metricsid,'metricsid')
                SetNewMetric(metricsid)//when edit opened both new and existing metrics would be same
                setIsForeCast(data && data.enable_forecast ? data.enable_forecast : false)
              
                setMetricFields(scalingFactor)
                setFCMetricsName(fcmetricslist)
                setFCMetricsID(fcmetricsid)
                SetFCExeMetric(fcmetricsid)
                SetFCNewMetric(fcmetricsid)
                setRemovedFactor([])
        
               
                setInsFreq( data.frequncy)
              
                setCategoryID(data && data.instrument_category ? data.instrument_category.id : "");
                setisoID(data && data.instrument_class ? data.instrument_class : null);
                setTypeID(data && data.instrumentTypeByInstrumentType ? data.instrumentTypeByInstrumentType.id : "");
                setIsOffline(data && data.is_offline ? data.is_offline : false)
                setIsScalingFactors(data && data.is_scaling_factor? data.is_scaling_factor:false)
                setFormulaDialogMode('duplicate');
                setFormulaDialog(true);
                
            }
,

           
           handleFormulaCrudDialogEdit : (id, data) => {
            //   console.log(data,"data")
                if (data && data.id) getInstrumentMetricFrequency(data.id)
                else setInsFreq(0)
        
                setFCMetricsName([])
        
                const metriclist = data && data.instruments_metrics ? data.instruments_metrics : [];
                let metricsid = [];
                let metricslist = [];
                let fcmetricsid = [];
                let fcmetricslist = [];

                if (metriclist.length > 0) {
                    metriclist.map(val => {
                        if (val.metric) {
                            metricsid.push(val.metric);
                            metricslist.push({ "title": val.metric.title });
                            if(val.enable_forecast){//if (val.instruments_metrics_forecasting) {
                                // console.log('hi5665',val)
                                fcmetricsid.push(val.metric);
                                fcmetricslist.push({ "title": val.metric.title });
                            }
                        }
                    })
                }
                // processMetrics(metriclist, metricsid, metricslist)
        
                let scalingFactor = metriclist.length > 0 ? calculateScalingFactor(metriclist) : [];

               if(scalingFactor.length === 0){
                scalingFactor.push({field : 1,metric_id: '',mFactor:'',calibrationValue:''})
               }

               let optMetrics = [];
               if (props.metrics.length > 0 && metricsid.length > 0) {
                   optMetrics = metricsid.map(val => {
                       return props.metrics.filter((item) => item.id === val.id)[0]
                   })
               }

                setMetricsList(optMetrics);
                setMetricsID(metricsid)
                SetExeMetric(metricsid)
              
                SetNewMetric(metricsid)//when edit opened both new and existing metrics would be same
                setIsForeCast(data && data.enable_forecast ? data.enable_forecast : false)
                setMetricFields(scalingFactor)
                setFCMetricsName(fcmetricslist)
                setFCMetricsID(fcmetricsid)
                SetFCExeMetric(fcmetricsid)
                SetFCNewMetric(fcmetricsid)
                setRemovedFactor([])
        
                setInstrumentID(data && data.id ? data.id : "")
                setInsFreq( data.frequncy)
                setFormulaName(data && data.name ? data.name : "")
                setCategoryID(data && data.instrument_category ? data.instrument_category.id : "");
                setisoID(data && data.instrument_class ? data.instrument_class : null);
                setTypeID(data && data.instrumentTypeByInstrumentType ? data.instrumentTypeByInstrumentType.id : "");
                setIsOffline(data && data.is_offline ? data.is_offline : false)
                setIsScalingFactors(data && data.is_scaling_factor? data.is_scaling_factor:false)
                setFormulaDialogMode('edit');
                setFormulaDialog(true);
                
            }
        }
    )
    )

    useEffect(() => {
        if(categoryID){
            getInstrumentType(categoryID);
        }
        if(categoryID === 3 ){
            setIsoVisible(true)
        }else{
            setIsoVisible(false)
        }
     
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryID])
    useEffect(() => {

        if (!InstrumentMetricFrequencyLoading && !InstrumentMetricFrequencyError && InstrumentMetricFrequencyData) {
            const freqarr = InstrumentMetricFrequencyData.map((val) => val.frequency)
            setInsFreq(configParam.MODE(freqarr))
        }

    }, [InstrumentMetricFrequencyLoading, InstrumentMetricFrequencyData, InstrumentMetricFrequencyError])

    useEffect(() => {

        if (!InstrumentTypeListLoading && !InstrumentTypeListError && InstrumentTypeListData) {
            setTypes(InstrumentTypeListData)
        }

    }, [InstrumentTypeListLoading, InstrumentTypeListData, InstrumentTypeListError])

    useEffect(() => {
        // console.log(AddInstrumentMetricsForecastData,"AddInstrumentMetricsForecastData1",!AddInstrumentMetricsForecastLoading , AddInstrumentMetricsForecastData , !AddInstrumentMetricsForecastError)

        if (!AddInstrumentMetricsForecastLoading && AddInstrumentMetricsForecastData && !AddInstrumentMetricsForecastError) {
            console.log(AddInstrumentMetricsForecastData,"AddInstrumentMetricsForecastData")
            if (AddInstrumentMetricsForecastData.affected_rows > 0) {
                AddInstrumentMetricsForecastData.returning.map(async val => {
                    var data = {
                        "schema": headPlant.schema,
                        "instrument_id": val.instruments_metric.instruments_id,//"8003",
                        "metric_name": val.instruments_metric.metric.name,//"temp",
                        "end_date": moment().startOf('day').format("YYYY-MM-DDTHH:mm:ssZ"),//"2023-06-23T01:00:00+05:30",
                        "start_date": moment().startOf('day').subtract(30, 'days').format("YYYY-MM-DDTHH:mm:ssZ"),//"2023-06-30T01:00:00+05:30",
                    }
                    // getBuildYourModel(data)
                    // getBuildYourAnamolyModel(data)
                    SetMessage(t("AddInstrument"+ '' +formulaName))
                    SetType("success")
                    setOpenSnack(true)
                    props.refreshTable();
                    props.getInstrumentFormulaList();
                    handleFormulaDialogClose();
        
                
                })
            }
        }




        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ AddInstrumentMetricsForecastLoading , AddInstrumentMetricsForecastData ,AddInstrumentMetricsForecastError])

    useEffect(() => {
        if (!UpdateInstrumentMetricForecastLoading && UpdateInstrumentMetricForecastData && !UpdateInstrumentMetricForecastError) {
            if (UpdateInstrumentMetricForecastData.length > 0) {
                // console.log('updateForcast',UpdateInstrumentMetricForecastData)
                setupdateForeCastData(UpdateInstrumentMetricForecastData)
                getUpdateFrequency(InstID, insFreq)

            }
            // else{
            //     let fcmetricsArr = []
            //     fcMetricsID.filter(x => !extFCMetric.map(y=>y.id).includes(x.id)).map(fcm => {
                    
            //             let obj = {
            //                 ins_met_is: fcm.id,
            //                 parameters: null,
            //                 model: null,
            //                 status: 0
            //             }
            //             fcmetricsArr.push(obj)
                    
            //     })
            //     console.log(fcmetricsArr,"fcmetricsArr")
            //     if (fcmetricsArr.length > 0) {
            //         getAddInstrumentMetricsForecast(fcmetricsArr)
            //     }

            // }
            // console.log(UpdateInstrumentMetricForecastData," asdaf")

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [UpdateInstrumentMetricForecastLoading, UpdateInstrumentMetricForecastData, UpdateInstrumentMetricForecastError])


    const handleFormulaDialogClose = () => {
        setFormulaDialog(false);
        setInstrumentID('');
        setInsFreq('')
        setFormulaName('');
        setCategoryID('');
        setTypeID('');
        setMetricsID([]);
        setFCMetricsName([])
        setFCMetricsID([])
        setTypes([])
        setModulClose(false);
        setErrorMsg("");
        setMetricsError("");
        setTypeError("");
        setInstrumentCategoryErr("");
        setInstrumentNameErr("");
        setInstrumentIdErr("");
        setTextInputError("");
        setFreqInputError("");
        setMetricsText("")
        setIsOffline(false);
        setInstrumentDialogMode("instrumentDetails");
        setIsScalingFactors(false);
        setMetricFields([{field : 1,metric_id: '',mFactor:'',calibrationValue:''}]);
        setMetricsList([]);
        setRemovedFactor([])
        props.handleFormulaDialogClose()

    }
    const frequencyList = [
        {
            secs: 1,
            frequency: "None"
        },
        {
            secs: 2 ,
            frequency: "Shift"
        },
        {
            secs: 3600,
            frequency: "Hourly"
        },
        {
            secs: 86400,
            frequency: "Daily"
        },
        {
            secs: 2628288,
            frequency: "Monthly"
        }
    ]
    useEffect(() => {

        setTimeout(() => {

            if (InstrumentName.current) {
                InstrumentName.current.value =  formulaName

            }

        }, 500)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formulaDialog])

    useEffect(() => {
        if (isOffline) {
            setOfflineFreq( insFreq);
        } else {
            if (Frequency && Frequency.current) {
                Frequency.current.value =  insFreq
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ insFreq])

    useEffect(() => {
        if (isOffline) {
          setOfflineFreq(insFreq ? insFreq : 0);
        } else {
          setTimeout(() => {
            if (Frequency.current) {
              const updatedFreq = insFreq ? insFreq : "";
              Frequency.current.value = updatedFreq;
            }
          }, 200);
        }
      
        setIsOffline(prevIsOffline => isOffline); // Using functional update to avoid using matching state variable
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isOffline]);
      
 
 



    useEffect(() => {

        if (!checkInstrumentIdLoading && !checkInstrumentIdError && checkInstrumentIdData) {
            if (checkInstrumentIdData.Data.neo_skeleton_instruments_aggregate.aggregate.count > 0) {
                setInstrumentIdErr(t("Instrument Id already exist"));
                setInstrumentValidation(true);
                 //props.setLoading(false)
            } else {
                setInstrumentIdErr('');
                setInstrumentValidation(false);
                if (checkInstrumentIdData.type === 'Create') {
                    getCheckInstrumentName(formulaName, "Create")
                }
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkInstrumentIdLoading, checkInstrumentIdData, checkInstrumentIdError])

    useEffect(() => {

        if (!checkInstrumentNameLoading && !checkInstrumentNameError && checkInstrumentNameData) {
            if (checkInstrumentNameData.Data.neo_skeleton_instruments_aggregate.aggregate.count > 0) {
                setInstrumentNameErr(t("Instrument Name already exist"));
                setInstrumentErr(true);
                 //props.setLoading(false)
            } else {
                setInstrumentNameErr('');
                setInstrumentErr(true);
                if (checkInstrumentNameData.type === 'Create') {
                    let data={
                        instrumentID:IID,
                        line_id: headPlant.id,
                        formulaName:formulaName,
                        categoryID:categoryID
                    }
                    let datas={
                        data:data,
                        typeID:typeID,
                        isoID: isoID
                    }
                    getAddInstrumentwithID(datas, currUser.id, metricsID, currUser,  insFreq,   isOffline, isScalingFactors,isForeCast, fcMetricsID)
                }

            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkInstrumentNameLoading, checkInstrumentNameData, checkInstrumentNameError])


    function processMetrics(metriclist, metricsid, metricslist) {
        if (metriclist.length > 0) {
            metriclist.forEach(val => {
                if (val.metric) {
                    metricsid.push(val.metric);
                    metricslist.push({ "title": val.metric.title });
                  
                }
            });
        }
    }

    

    useEffect(() => {

        if (!AddInstrumentwithoutIDLoading && !AddInstrumentwithoutIDError && AddInstrumentwithoutIDData) {
            if (metricsID.length > 0) {
                const lastInsertID = AddInstrumentwithIDData.id;
                let instrumentMetricsArr = [];
                metricsID.forEach((val) => {
                    if (val.id) {
                        let obj = {
                            instruments_id: lastInsertID,
                            metrics_id: val.id,
                            updated_by: currUser.id,
                            created_by: currUser.id,
                            frequency: insFreq,
                            factor: val.factor,
                            calibrate: val.calibrate
                        };
                        instrumentMetricsArr.push(obj);
                    }
                });
                
                getAddInstrumentMetrics(instrumentMetricsArr)

            } else {
                props.refreshTable();
                props.getInstrumentFormulaList();
                // console.log('1')
                handleFormulaDialogClose();
                SetMessage(t('AddInstrument') + ' ' + formulaName)
                SetType("success")
                setOpenSnack(true)
              

            } 
            if(isOffline){
                getRefreshInstrument(headPlant.schema)
            }

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AddInstrumentwithoutIDLoading, AddInstrumentwithoutIDError, AddInstrumentwithoutIDData])


    useEffect(() => {

        if (!AddInstrumentwithIDLoading && AddInstrumentwithIDData === null && AddInstrumentwithIDError)
        {
          
           
            SetMessage(t("Instrument Id already exist "));
            SetType("error")
            setOpenSnack(true)
           
        }
        if (!AddInstrumentwithIDLoading && !AddInstrumentwithIDError && AddInstrumentwithIDData) {
            if (AddInstrumentwithIDData.length > 0) //id not null
            {
                getAddInstrumentMetrics(AddInstrumentwithIDData);
                
            }
            else {
                 
                SetMessage(t('DuplicatedInstrument') + ' ' + formulaName)
                SetType("error")
                setOpenSnack(true)
                props.refreshTable();
                props.getInstrumentFormulaList();
                // console.log('2')

                handleFormulaDialogClose();

            }
        }
        if(isOffline){
            getRefreshInstrument(headPlant.schema)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AddInstrumentwithIDLoading, AddInstrumentwithIDError, AddInstrumentwithIDData])



    useEffect(() => {
        if (!AddInstrumentMetricsLoading && !AddInstrumentMetricsError && AddInstrumentMetricsData) {
            //In Edit New metric added the update scaling factor
            if (AddInstrumentMetricsData && AddInstrumentMetricsData.returning.length > 0) {
                // let fcmetricsArr = []
                // console.log(AddInstrumentMetricsData.returning,"AddInstrumentMetricsData.returning")
                // AddInstrumentMetricsData.returning.map(fcm => {
                //     if (fcm.enable_forecast) {
                //         let obj = {
                //             ins_met_is: fcm.id,
                //             parameters: null,
                //             model: null,
                //             status: 0
                //         }
                //         fcmetricsArr.push(obj)
                //     }
                // })
                // console.log(fcmetricsArr,"fcmetricsArr")
                let difference2 = newFCMetric.filter(x => !extFCMetric.includes(x));
                console.log(difference2)
                if(difference2.length > 0){
                    // getAddInstrumentMetricsForecast(updateForeCastData)
                    difference2.forEach((mdata) => {
                        var data = {
                            "schema": headPlant.schema,
                            "instrument_id": InstID,//"8003",
                            "metric_name": mdata.name,//"temp",
                            "end_date": moment().startOf('day').format("YYYY-MM-DDTHH:mm:ssZ"),//"2023-06-23T01:00:00+05:30",
                            "start_date": moment().startOf('day').subtract(30, 'days').format("YYYY-MM-DDTHH:mm:ssZ"),//"2023-06-30T01:00:00+05:30",
                        }
                        console.log(data)
                        getBuildYourModel(data)
                        getBuildYourAnamolyModel(data)
                    })
                    SetMessage(t("AddInstrument"+ '' +formulaName))
                    SetType("success")
                    setOpenSnack(true)
                    setTimeout(() => {
                        props.refreshTable();
                        props.getInstrumentFormulaList();
                        handleFormulaDialogClose();
                        // eslint-disable-next-line react-hooks/exhaustive-deps
                    }, 500)
                
                    // getAddInstrumentMetricsForecast(fcmetricsArr)
                    return
                }else{
                    getUpdateFrequency(InstID, insFreq) 
                    SetMessage(t("AddInstrument"+ '' +formulaName))
                    SetType("success")
                    setOpenSnack(true)
                    props.getInstrumentFormulaList();
                    // console.log('3')

                    handleFormulaDialogClose();
                }
            }
            if(isScalingFactors){
                getUpdateMetricScalingFactor(InstID, updatedFactor)
            }
            else {
                getUpdateFrequency(InstID, insFreq) 
                SetMessage(t("AddInstrument"+  formulaName))
                SetType("success")
                setOpenSnack(true)
                props.refreshTable();
                props.getInstrumentFormulaList();
                // console.log('4')
                

                handleFormulaDialogClose();
            } 
             
        }
        else if (AddInstrumentMetricsError && !AddInstrumentMetricsLoading && AddInstrumentMetricsData === null) {
            
            SetMessage(t("Failed to update the metrics"))
            SetType("error")
            setOpenSnack(true)
            props.refreshTable();
            props.getInstrumentFormulaList();
            // console.log('5')

            handleFormulaDialogClose();

        } 

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AddInstrumentMetricsLoading, AddInstrumentMetricsData, AddInstrumentMetricsError])

    useEffect(() => {
        if (!UpdateMetricScalingFactorError && !UpdateMetricScalingFactorLoading && UpdateMetricScalingFactorData) {
            getUpdateFrequency( InstID,  insFreq)

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [UpdateMetricScalingFactorLoading, UpdateMetricScalingFactorData, UpdateMetricScalingFactorError])

    useEffect(() => {
        if (!UpdateFrequencyError && !UpdateFrequencyLoading && UpdateFrequencyData) {
            
             
            if ( formulaDialogMode === "create" || formulaDialogMode === "duplicate") {
                SetMessage(t('AddInstrument') + ' ' + formulaName) 
            }
            else {
                SetMessage(t('UpdateInstrument') + ' ' + formulaName) 
            }
            let difference2 = newFCMetric.filter(x => !extFCMetric.includes(x));
            console.log(difference2)
           console.log(updateForeCastData)
            if(difference2.length > 0){
                // getAddInstrumentMetricsForecast(updateForeCastData)
                difference2.forEach((mdata) => {
                    var data = {
                        "schema": headPlant.schema,
                        "instrument_id": InstID,//"8003",
                        "metric_name": mdata.name,//"temp",
                        "end_date": moment().startOf('day').format("YYYY-MM-DDTHH:mm:ssZ"),//"2023-06-23T01:00:00+05:30",
                        "start_date": moment().startOf('day').subtract(30, 'days').format("YYYY-MM-DDTHH:mm:ssZ"),//"2023-06-30T01:00:00+05:30",
                    }
                    console.log(data)
                    getBuildYourModel(data)
                    getBuildYourAnamolyModel(data)
                })
                SetType("success")
                setOpenSnack(true) 
                setTimeout(() => {
                    props.refreshTable();
                    props.getInstrumentFormulaList()
                    handleFormulaDialogClose()
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }, 500)
            }else{
                SetType("success")
                setOpenSnack(true) 
                // console.log('6')
                props.refreshTable();
                props.getInstrumentFormulaList()
                // console.log('6')
                handleFormulaDialogClose()
            }
          
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [UpdateFrequencyLoading, UpdateFrequencyData, UpdateFrequencyError])

    useEffect(() => {
        if (!UpdateInstrumentLoading && !UpdateInstrumentError && UpdateInstrumentData) {
            // In edit any metric add for the instrument
            if (UpdateInstrumentData.length > 0) {
                console.log(UpdateInstrumentData,'enterupdateInstrument')
                getAddInstrumentMetrics(UpdateInstrumentData)
            }
            else {
                // If no metric change for the instrument
                // console.log('enter no metric change')

                // getUpdateInstrumentMetricForecast(InstID, headPlant.id, formulaName, categoryID, typeID, currUser.id, extMetric.map(x=>x.id), newMetric.map(x=>x.id), currUser, insFreq, metricsID, isOffline, isForeCast, extFCMetric.map(x=>x.id), newFCMetric.map(x=>x.id))

                getUpdateMetricScalingFactor(InstID, updatedFactor,formulaDialogMode,extFCMetric.map(x=>x.id), fcMetricsID.map(x=>x.id))
                getUpdateFrequency(InstID, insFreq)
            }
            
            getRefreshInstrument(headPlant.schema)
        }
        else if (UpdateInstrumentError && !UpdateInstrumentLoading && UpdateInstrumentData === null) {
            
            SetMessage(t("Failed to update the instrument.Try Again!"))
            SetType("warning")
            setOpenSnack(true)
            // console.log('7')

            handleFormulaDialogClose();

        }



        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [UpdateInstrumentLoading, UpdateInstrumentData, UpdateInstrumentError])


    useEffect(() => {
        if (!DeleteInstrumentFormulaLoading && !DeleteInstrumentFormulaError && DeleteInstrumentFormulaData) {
             
            if (DeleteInstrumentFormulaData.affected_rows >= 1) {
                // SetMessage(t('DeleteInstrument') + ' ' + formulaName)
                SetMessage(formulaName + ' ' +t('DeleteInstrument'))
                SetType("success")
                setOpenSnack(true)       
            }
            else {
                SetMessage(t('The Instrument could not be deleted.Try again!'))
                SetType("warning")
                setOpenSnack(true)
            }
            props.refreshTable();
            props.getInstrumentFormulaList();
            handleFormulaDialogClose();

        }
        else if (!DeleteInstrumentFormulaLoading && DeleteInstrumentFormulaError && DeleteInstrumentFormulaData === null) {
            
            SetMessage(t('The Instrument could not be deleted.Try again!'))
            SetType("error")
            setOpenSnack(true)
            handleFormulaDialogClose();


        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DeleteInstrumentFormulaLoading, DeleteInstrumentFormulaData, DeleteInstrumentFormulaError])

    useEffect(() => {

        if (!DeleteInstrumentLoading && !DeleteInstrumentError && DeleteInstrumentData) {
            getDeleteInstrumentFormula(InstID, headPlant.id)
            getRefreshInstrument(headPlant.schema)
        }
        else if (DeleteInstrumentError) {
            
            SetMessage(t('The Instrument could not be deleted.Try again!'))
            SetType("error")
            setOpenSnack(true)
            props.refreshTable();
            props.getInstrumentFormulaList()
            handleFormulaDialogClose();


        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DeleteInstrumentLoading, DeleteInstrumentData, DeleteInstrumentError])


    function calculateScalingFactor(metriclist) {
        const scalingFactor = [];
      
        metriclist.forEach((val, index) => {
          if (val.metric && (val.factor !== 1 || val.calibrate !== 0)) {
            scalingFactor.push({
              field: index + 1,
              metric_id: val.metric.id,
              mFactor: val.factor,
              calibrationValue: val.calibrate,
            });
          }
        });
      
        return scalingFactor;
      }
   
    const handleInsFreqID = (e) => {
         setInsFreq(Frequency.current.value)
        if (Frequency.current.value.length > 0) {
            setFreqInputError("");
        } else {
            setFreqInputError(t('Please Input the frequency value'));
        }
    }
    const checkInstrumentName = async (e) => {
        if ( formulaDialogMode !== "create") {
            return true;
        }
        if (e) {
            const instrumentName = trim(InstrumentName.current.value);
            if (instrumentName.length > 0) {
                setInstrumentNameErr('');
                await getCheckInstrumentName(instrumentName, "")
            } else {
                setInstrumentNameErr(t("Please Enter Valid Instrument Name"));
            }
        }

    }
    const checkInstrumentIdvalue = (e) => {
        const id = e.target.value;
        if (id.match(/^[a-zA-Z0-9@#$^&_]+$/)) {
            setTextInputError('');
            setInstrumentValidation(false);
        } else {
            setTextInputError(t('InstrumentIDSplError'));
            setInstrumentValidation(false);

        }

    }
    const checkInstrumentId = async (e) => {
        const id = InstrumentID.current.value
        if (trim(id).length > 0) {
            if (!textInputError) {
                setTextInputError("");
                await getCheckInstrumentId(id, "")
            }

        } else {
            setTextInputError(t('InstrumentIDErrMsg'));
            setInstrumentValidation(true);
        }

    }



    const handleInstrumentCategory = (e) => {
      
        if (e.target.value !== '') {
            setInstrumentCategoryErr('');
        }
         setCategoryID(e.target.value);
         setTypeID('');

    }

    const handleInstrumentIso = (e) => {
      
        if (e.target.value !== '') {
            setInstrumentCategoryErr('');
        }
        setisoID(e.target.value);
         setTypeID('');
    }

    const handleInstrumentType = (e) => {

        if (e.target.value !== '') {
            setTypeError('');

        }

         setTypeID(e.target.value);

    }

    const handleMetrics = (event) => {
         
      

         SetNewMetric(event); 
        setMetricsID(event);
        setMetricsList(event);  

    let setelement = [...MetricFields]; 
    // eslint-disable-next-line array-callback-return
    let removed = []
    // eslint-disable-next-line array-callback-return
    event.forEach(val => {
        let Copy = setelement.filter(x => x.metric_id === val.id);
        if (Copy.length > 0) {
            removed.push(Copy[0]);
        }
    });
    

    if (removed.length === 0) {
        removed.push({ field: 1, metric_id: '', mFactor: '', calibrationValue: '' })
    }

    setMetricFields(removed);

}
const clickFormulaButton = async () => {
    let cIname = InstrumentName.current ? InstrumentName.current.value : formulaName
    let cinstrumentId = InstrumentID.current ? InstrumentID.current.value.toLowerCase() : InstID.toLowerCase()
    let removeSpecalChar = cinstrumentId.replace(/[-+=(),.?!*&/]/g, '_')
    let removeSpeace = removeSpecalChar.replace(" ", "_")
    let cIID = removeSpeace.split(" ").join("");
    let splCheck = cIID.split("~")
    let cDelID = InstrumentID.current ? InstrumentID.current.value : InstID  
    if (instrumentDialogMode === "instrumentDetails") {
      
        setIname(cIname)
        setInstrument_Id(cinstrumentId)
        setDelID(cDelID)
        setIID(cIID)
        setFormulaName(cIname)
        setInstrumentID((formulaDialogMode === 'create' || formulaDialogMode === 'duplicate') ? cIID : InstID)
        if (formulaDialogMode !== 'delete' && (cIID === '' || cIname === '' || splCheck.length > 1 || categoryID === '' || typeID === '' || (typeID === 3 && isoID === '') || metricsID.length === 0 || (insFreq === ''))) {

            if (cIID === '' || splCheck.length > 1) {
                if(splCheck.length > 1){
                setTextInputError(t('Invalid Instrument Id'));

                }else{
                    setTextInputError(t('InstrumentIDErrMsg'));

                }
                return false
            }
            if (insFreq === '') {
                setFreqInputError(t('FreqErrMsg'));
            }
            if (cIname === '') {
                setInstrumentNameErr(t('InstrumentNameErrMsg'));
            }
            if (categoryID === '') {
                setInstrumentCategoryErr(t('InstrumentCategoryErrMsg'));
            }
            if (typeID === '') {
                setTypeError(t('InstrumentTypeErrMsg'));
            }
            if (isoID === '') {
                setTypeError(t('InstrumentClassErrMsg'));
            }
            if (metricsID.length === 0) {
                setMetricsError(t('InstrumentmetricErrMsg'));
            }
            props.setLoading(false)
            return false;
        }

        if (formulaDialogMode !== 'delete' && instrumentIdErr) {
            props.setLoading(false)
            return false;
        }

        setMetricsError("");
        setTypeError("");
        setInstrumentCategoryErr("");
        setInstrumentNameErr("");
        setTextInputError("");
        setFreqInputError("");
        setInstrumentIdErr("");       
    } 
    if (formulaDialogMode === 'delete') {

        if (cIID !== '') {
            getDeleteInstrument(cDelID)

        }
    } else {
        if (instrumentDialogMode === "instrumentDetails" && isScalingFactors) {
            setInstrumentDialogMode("scalingFactors");
        }
        else {
            if (instrumentDialogMode === "instrumentDetails" && !isScalingFactors && formulaDialogMode === 'edit') {
                let updatedMetricsID = []

                MetricFields.forEach((val,i) => {
                    if(val.metric_id !== ""){
                        updatedMetricsID.push({ field: i+1, metric_id: val.metric_id, mFactor: 1, calibrationValue: 0 });
                    }
                })
             
                setUpdatedFactor(updatedMetricsID)
            }
            

            if (instrumentDialogMode === "scalingFactors" && isScalingFactors) {

                let updatedMetricsID = []
              

                let MetValid = false
                let mFactorError = false
                // eslint-disable-next-line array-callback-return
                MetricFields.forEach(val => {
                    if (!val.metric_id) {
                        MetValid = true
                    }
                    if (val.mFactor <= 0) {
                        mFactorError = true
                    }
                })
                if (MetValid) {
                    SetMessage(t('Please Fill Scaling Factor Configuration'))
                    SetType("warning")
                    setOpenSnack(true)
                    return false
                }

                if (mFactorError) {
                    SetMessage(t('Multiplication value should not less than or equal to zero'))
                    SetType("warning")
                    setOpenSnack(true)
                    return false
                }


                // Metric Factor and calibrate array for insert
                if (formulaDialogMode === 'create' || formulaDialogMode === 'duplicate') {
                    updatedMetricsID = metricsID.map(val => {
                        let index = MetricFields.filter((item) => item.metric_id === val.id)
                        if (index.length > 0) {
                            return { ...val, "factor": index[0].mFactor, "calibrate": index[0].calibrationValue }
                        } else {
                            return { ...val, "factor": 1, "calibrate": 0 }
                        }
                    })
                    setMetricsID(updatedMetricsID)
                    setUpdatedFactor(updatedMetricsID)
                }

                if (formulaDialogMode === 'edit') {
                    let setelement = [...MetricFields];
                    if (removedFactor.length > 0) {
                        removedFactor.forEach(val => {
                            setelement.push({ field: "", metric_id: val, mFactor: 1, calibrationValue: 0 })
                        })
                    }
                    setUpdatedFactor(setelement)
                }


            }
           
            if (cIID !== '' && cIname !== '') {
                if (formulaDialogMode === 'create' || formulaDialogMode === 'duplicate') {
                    if (cIID !== '' && cIname !== '' && categoryID !== '' && typeID !== '' && metricsID.length > 0) {
                        getCheckInstrumentId(cIID, "Create")
                    }
                } else {
                    if (cIID !== '' && cIname !== '' && categoryID !== '' && typeID !== '') {
                        let param = { instrumentID: cIID, line_id: headPlant.id, formulaName: cIname, categoryID: categoryID, typeID: typeID, isoID: isoID ? isoID : null, user_id: currUser.id,offline:isOffline,extMetric:extMetric.map(x=>x.id),newMetric:newMetric.map(x=>x.id), currUser:currUser, metricsID:metricsID,insFreq:insFreq,isScalingFactors:isScalingFactors,isForeCast:isForeCast, extFCMetric :extFCMetric.map(x=>x.id), newFCMetric :newFCMetric.map(x=>x.id) }
                        getUpdateInstrument(param)
                      
                    }
                }
            } else {
                if (formulaName !== '' && categoryID !== '' && typeID !== '') {
                    AddInstrumentWithoutID(headPlant.id, cIname, categoryID, typeID, isoID ? isoID : null, "{" + metricsID.toString() + "}", currUser.id)

                }
            }
        }
    }
}

function AddInstrumentWithoutID(line_id, formulaName, categoryID, typeID, metricsID, user_id) {

    getAddInstrumentwithoutID(line_id, formulaName, categoryID, typeID, metricsID, user_id,   isOffline,isForeCast)
}


    const handleFreq = (e) => {
         setInsFreq(e.target.value)
    }
    const handleMetricDialog = () => {

        setMetricDialog(true);
    }

    const onClose = () => {
        handleFormulaDialogClose()
        setErrorMsg("");
        setMetricsError("");
        setTypeError("");
        setInstrumentCategoryErr("");
        setInstrumentNameErr("");
        setInstrumentIdErr("");
        setTextInputError("");
        setFreqInputError("");
        setInstrumentValidation(true)
        setInstrumentDialogMode("instrumentDetails");
        setIsScalingFactors(false);
        setMetricFields([{field : 1,metric_id: '',mFactor:'',calibrationValue:''}]);
        setMetricsList([]);
        setRemovedFactor([])

    }


    const handleOffline = (type) => {
        setIsOffline(type); 
    };

    const handleScalingFactors = () =>{
        setIsScalingFactors(!isScalingFactors)
    }

    const handleScalingFactorDialogBack = () =>{
        setInstrumentDialogMode("instrumentDetails")

        setTimeout(() => {
            InstrumentName.current.value = formulaName
            if ((formulaDialogMode === 'create' || formulaDialogMode === 'duplicate' )) {
            InstrumentID.current.value = InstID
            }
            if(isOffline){
                setOfflineFreq(insFreq);
            }else{
                Frequency.current.value = insFreq 
            } 
            // eslint-disable-next-line react-hooks/exhaustive-deps
          }, 500)

    }

    function handleScalingFactorMetricChange(e,field){
    
        let exist = MetricFields.filter(v=> v.metric_id === e.target.value)
        if(exist.length>0){
            SetMessage(t('Metric Already Selected'))
            SetType("warning")
            setOpenSnack(true)
        }else{
          let setelement = [...MetricFields];
          const fieldIndex = setelement.findIndex(x=>x.field === field);
          let fieldObj = {...setelement[fieldIndex]};
                  
          fieldObj['metric_id'] = e.target.value;
          setelement[fieldIndex] = fieldObj;
          
          setMetricFields(setelement);
         
        }
        
      }

      function handleFactor(e,field){
         
            let setelement = [...MetricFields];
            const fieldIndex = setelement.findIndex(x => x.field === field);
            let fieldObj = { ...setelement[fieldIndex] };

            fieldObj['mFactor'] = Number(e.target.value)
            setelement[fieldIndex] = fieldObj;

            setMetricFields(setelement);
      }
    
      function handleCalibrate(e,field){
       
        let setelement = [...MetricFields];
        const fieldIndex = setelement.findIndex(x=>x.field === field);
        let fieldObj = {...setelement[fieldIndex]};
                
        fieldObj['calibrationValue'] = Number(e.target.value)
        setelement[fieldIndex] = fieldObj;
        
        setMetricFields(setelement);
      }

      function AddScalingFactorMetric(){
        if(metricsList.length !== MetricFields.length){
          let setelement = [...MetricFields];
          const lastfield = setelement.length > 0 ? Number(setelement[setelement.length - 1].field) + 1 : 1;
          setelement.push({ field: lastfield,metric_id: '',mFactor:'',calibrationValue:''});
          setMetricFields(setelement);
        }
        
      }

      const handleForecastAnalytics = () => {
        setIsForeCast(!isForeCast)
    }

      const removeMetric = (field) => {
        let setelement = [...MetricFields];
        let removed = setelement.filter(x => x.field !== field);
        let deleted = setelement.filter(x => x.field === field);
       
        setMetricFields(removed);

        let removedMetric = [...removedFactor]
          if (deleted[0].metric_id !== "") {
            removedMetric.push(deleted[0].metric_id)
          }
          setRemovedFactor(removedMetric)
         
      }

      const handleFCMetrics = (event) => {
        // console.log(props.metrics.filter(val => metricsID.includes(val.id)),metricsID,"valvalval")
        
         SetFCNewMetric(event);
         setFCMetricsID(event);
         let setelement = [...MetricFields];
         // eslint-disable-next-line array-callback-return
         let removed = []
         // eslint-disable-next-line array-callback-return
         event.map(val => {
             let Copy = setelement.filter(x => x.metric_id === val.id)
             if (Copy.length > 0) {
                 removed.push(Copy[0])
             }
 
         })
 
         if (removed.length === 0) {
             removed.push({ field: 1, metric_id: '', mFactor: '', calibrationValue: '' })
         }
 
         setMetricFields(removed);
 
     }

      function removeDuplicates(array, property) {
        const uniqueMap = new Map();
        array.forEach(item => {
          uniqueMap.set(item[property], item);
        });
        return Array.from(uniqueMap.values());
      }


      let dialogTitle;

      if (instrumentDialogMode === "instrumentDetails") {
        if (formulaDialogMode === "create") {
          dialogTitle = t('Instrument Details ');
        } else if (formulaDialogMode === "duplicate") {
          dialogTitle = "Duplicate Instrument";
        } else if (formulaDialogMode === "edit") {
          dialogTitle = t('EditInstrument');
        } else {
          dialogTitle = t('DeleteInstrument');
        }
      } else {
        dialogTitle = t('Scaling Factors');
      }
      

      let frequencyInput;

if (!isOffline) {
    frequencyInput = (
        <React.Fragment>
            {(formulaDialogMode === "create" || formulaDialogMode === "duplicate") &&
                <div className="mb-3">
                    <InputFieldNDL
                        id="ins-freq-val"
                        label={t('Frequency')}
                        type={'number'}
                        onBlur={handleInsFreqID}
                        inputRef={Frequency}
                        required={true}
                        placeholder={t('Frequency')}
                        error={freqInputError}
                        helperText={freqInputError}
                    />
                </div>
            }
            {formulaDialogMode === "edit" &&
                <div className="mb-3">
                    <InputFieldNDL
                        id="ins-freq-val"
                        label={t('Frequency')}
                        type={'number'}
                        onBlur={handleInsFreqID}
                        inputRef={Frequency}
                        required={true}
                        placeholder={"Enter Frequency"}
                        error={freqInputError}
                        helperText={freqInputError}
                    />
                </div>
            }
        </React.Fragment>
    );
} else {
    frequencyInput = (
        <div className="mb-3">
            <SelectBox
                id="frequency"
                auto={false}
                options={frequencyList}
                isMArray={true}
                keyValue={"frequency"}
                keyId={"secs"}
                value={offlineFreq}
                multiple={false}
                onChange={(e, option) => handleFreq(e)}
                error={freqInputError}
                msg={freqInputError}
                label={t("Frequency")}
            />
        </div>
    );
}

let buttonValue;

if (!isScalingFactors) {
    if (instrumentDialogMode === "instrumentDetails") {
        if (formulaDialogMode === "create" || formulaDialogMode === "duplicate") {
            buttonValue = t('Add');
        } else if (formulaDialogMode === "edit") {
            buttonValue = t('Update');
        } else {
            buttonValue = t('YesDelete');
        }
    } else {
        buttonValue = "";
    }
} else {
    buttonValue = instrumentDialogMode === "scalingFactors" ? t('Add') : t('Next');
}

      let errMessage=errormsg ? ({errormsg}) : null
      let disabledOp=formulaDialogMode === "create"  && instrumentValidation ? instrumentValidation : false
      let helperTextMes=instrumentNameErr ? instrumentNameErr : undefined
      let errDel=instrumentNameErr ? true : false
      let disableOpSelect=formulaDialogMode === "create" || instrumentValidation ? typeID === '' : false
      let isDisabled = formulaDialogMode === "create" && instrumentValidation ? instrumentValidation : false;
   
    return (
        <React.Fragment>
    {dialogTitle === "New instrument" ? (
        <ModalHeaderNDL className="flex flex-col items-start">
            <TypographyNDL id="entity-dialog-title" variant="heading-02-xs" value={dialogTitle}  />
            <TypographyNDL variant="lable-01-s" color="secondary" value={t('Input and save information for a new instrument into the application')}  />
        </ModalHeaderNDL>
    ) : (
        <ModalHeaderNDL className="flex flex-col items-start">
            <TypographyNDL id="entity-dialog-title" variant="heading-02-xs" value={dialogTitle}  />
            </ModalHeaderNDL>
    )}
                <ModalContentNDL>
                {instrumentDialogMode === "instrumentDetails" ?
                        (<div>
                    {errMessage}
                    { formulaDialogMode === "delete" &&
                    <div className="flex flex-col gap-3">
 <TypographyNDL variant="paragraph-s" color="secondary" value={t('Do you really want to delete the ') + formulaName + ( ' ? All configurations and alarms associated with this instrument will be permanently deleted. This action cannot be undone.')} />
 {/* <TypographyNDL variant="paragraph-s" color="secondary">{ ("Do you really want to delete the 'instrument name'? All configurations and alarms associated with this instrument will be permanently deleted. This action cannot be undone,")}</TypographyNDL>  */}
                    </div>
                   
                    }
                    {
                        ( formulaDialogMode === "create" || formulaDialogMode === "duplicate" ) &&
                        <div className="mb-3">
                           
                            <InputFieldNDL
                                id="instrument-id"
                                label={t('Instrumentid')}
                                inputRef={InstrumentID}
                                onBlur={checkInstrumentId}
                                onChange={checkInstrumentIdvalue}
                                // value={intruID}
                                // onChange={(e)=>setintruID(e.target.value)}
                                required={true}
                                placeholder={t('Instrumentid')}
                                error={textInputError || instrumentIdErr}
                                helperText={textInputError || instrumentIdErr}
                            />
                            
                        </div>


                    }
                    { formulaDialogMode !== "delete" &&
                        <React.Fragment>
                            <div className="mb-3">
                                <InputFieldNDL
                                    id="instrument-name"
                                    label={t('Instrumentname')}
                                    onBlur={checkInstrumentName}
                                    placeholder={t('Instrumentname')}
                                    inputRef={InstrumentName}
                                    required={true}
                                    disabled={disabledOp}
                                    helperText={helperTextMes}
                                    error={errDel}
                                />
                            </div>
                            <div className="mb-3">
                            <div className="flex items-center gap-4">
                                <RadioNDL labelText={t('Online Instrument')} id="online" checked={!isOffline} onChange={() => handleOffline(false)} />
                                <RadioNDL labelText={t('Offline Instrument')} id="offline" checked={isOffline} onChange={() => handleOffline(true)} />
                            </div>
                            </div>

                            <div className="mb-3">
                                <SelectBox
                                    id='select-metric-category'
                                    value={ categoryID}
                                    //inputRef={category}
                                    onChange={handleInstrumentCategory}
                                    label={t('Instrument Category')}
                                    required={true}
                                    disabled={isDisabled}
                                    auto={false}
                                    options={props.categories}
                                    error={instrumentCategoryErr}
                                    msg={instrumentCategoryErr}
                                    isMArray={true}
                                    keyId={"id"}
                                    keyValue={"name"}
                                    defaultDisableOption={true}
                                >

                                </SelectBox>
                            </div>
                            {isoVisible &&
                             <div className="mb-3">
                                    <SelectBox
                                        id='select-metric-iso'
                                        value={isoID}
                                        onChange={handleInstrumentIso}
                                        label={t('ISO Standard')}
                                        required={true}
                                        disabled={isDisabled}
                                        auto={false}
                                        options={props.isostandard}
                                        error={instrumentCategoryErr}
                                        msg={instrumentCategoryErr}
                                        isMArray={true}
                                        keyId={"id"}
                                        keyValue={"class"}
                                        defaultDisableOption={true}
                                    />
                                </div>
                                }

                            <div className="mb-3">
                                <SelectBox
                                    required={true}
                                    id='select-instrument-type'
                                    value={ typeID}
                                    onChange={handleInstrumentType}
                                    label={t('Instrument Type')}
                                    disabled={disabledOp}
                                    auto={false}
                                    isMArray={true}
                                    keyId={"id"}
                                    keyValue={"name"}
                                    options={ types}
                                    error={instrumentTypeError}
                                    msg={instrumentTypeError}
                                    defaultDisableOption={true}

                                >
                                </SelectBox>
                            </div>

                                <div style={{ marginBottom: 12, display: 'flex',alignItems:"end" }} >
                                    <SelectBox
                                        id="combo-box-demo"
                                        label={t("Metrics")}
                                        edit={true}
                                        auto={true}
                                        options={props.metrics}
                                        isMArray={true}
                                        keyValue={"title"}
                                        keyId={"id"}
                                        value={metricsID}
                                        multiple={true}
                                        selectAll={true}
                                        selectAllText={"Select All"}
                                        onChange={(option) => handleMetrics(option)}
                                        disabled={disableOpSelect}
                                        error={instrumentMetricsError}
                                        msg={instrumentMetricsError}
                                        isBtnActive={userWhoCanAddMetrics.includes(currUser.id)}
                                        btnProps={<Button onClick={(e) => { e.stopPropagation(); handleMetricDialog() }} icon={AddLight} type={"ghost"} />}
                                    />
                                    {userWhoCanAddMetrics.includes(currUser.id) &&
                                        <Button onClick={(e) => { e.stopPropagation(); handleMetricDialog() }} icon={AddLight} type={"ghost"} />
                                    }
                                </div>






                            { formulaDialogMode === "edit" &&

                                <div className="mt-3">
                                    <TypographyNDL variant="paragraph-xs" color="danger" value={"Note: If metric removed alarm might be deleted"} />
                                  
                                </div>
                            }
                            {
                                categoryID !== 6 && 
                                   <div className="my-3">
                                        <CustomSwitch
                                            switch={false}
                                            checked={isScalingFactors}
                                            onChange={handleScalingFactors}
                                            primaryLabel={t("Set Multiplication Factors")}
                                        />
                                    </div>
}
                            {frequencyInput}
                            <div style={{ display: 'flex', justifyContent: 'space-between',marginTop:'12px'}}>
                                        <div>
                                        <TypographyNDL variant="lable-02-s">{t("ForecastAnalytics")}</TypographyNDL>
                                            <TypographyNDL color='tertiary' variant="paragraph-xs">{t('ForecastAnalyticsContent')}</TypographyNDL>
                                        </div>
                                        <CustomSwitch
                                            id={"switch"}
                                            onChange={handleForecastAnalytics}
                                            checked={isForeCast}
                                            switch={true}
                                            size="small"
                                        />
                                        

                                    </div>
                                {isForeCast && (

                                    <div style={{ marginBottom: 12, marginTop: '12px' }}>
                                        <SelectBox
                                            id="create-forecast"
                                            auto={true}
                                            edit={true}
                                            label={t("FCMetrics")}
                                            placeholder={t("SelectFCMetrics")}
                                            options={removeDuplicates(metricsID, 'id')}
                                            isMArray={true}
                                            keyValue={"title"}
                                            keyId={"id"}
                                            value={fcMetricsID}
                                            multiple={true}
                                            onChange={(option) => handleFCMetrics(option)}
                                            error={instrumentMetricsError}
                                            msg={instrumentMetricsError}
                                            disabled={
                                                formulaDialogMode === "create" || instrumentValidation ? typeID === '' : false
                                            }
                                            disableCloseOnSelect={true}
                                            selectAll={true}
                                            selectAllText={"Select All"}
                                        />

                                    </div>

                                )}
                            
                        </React.Fragment>
                    }
     </div>) : (<div>
                            <Grid item xs={12}>
                                {MetricFields.map((val) => {
                                    return (
                                        <Grid container spacing={1}>
                                            <Grid item xs={ Number(val.field) === 1 ?4 : 3} style={{ paddingRight: '5px' }}>
                                                <SelectBox
                                                    labelId="Met"
                                                    label={t("Metric")}
                                                    id={"instrument-scaling-factor" + (val.field)}
                                                    auto={false}
                                                    multiple={false}
                                                    options={metricsList}
                                                    isMArray={true}
                                                    checkbox={false}
                                                    value={val.metric_id}
                                                    onChange={(e) => handleScalingFactorMetricChange(e, val.field)}
                                                    dynamic={MetricFields}
                                                    keyValue="title"
                                                    keyId="id"
                                                // error={!partSignal.isValid ? true : false}
                                                // msg={"Please select metric"}
                                                />
                                            </Grid>
                                            <Grid item xs={4} style={{ paddingRight: '5px' }}>
                                                <InputFieldNDL
                                                    id="MultiplicationValueId"
                                                    label={t("MultiplicationValue")}
                                                    placeholder={t("Type value")}
                                                    type="number"
                                                    inputRef={FactorRef}
                                                    value={val.mFactor}
                                                    dynamic={MetricFields}
                                                    onChange={(e) => handleFactor(e, val.field)}
                                                />
                                            </Grid>
                                            <Grid item xs={ Number(val.field) === 1 ?4 : 3}>
                                                <InputFieldNDL
                                                    id="CalibrationValueId"
                                                    label={t("CalibrationValue")}
                                                    placeholder={t('Type value')}
                                                    type="number"
                                                    inputRef={CalibrateRef}
                                                    value={val.calibrationValue}
                                                    dynamic={MetricFields}
                                                    onChange={(e) => handleCalibrate(e, val.field)}
                                                />
                                            </Grid>
                                            {
                                              Number(val.field) !== 1 && 
                                                <Grid item xs={2} style={{ marginTop: "20px" }}>
                                               
                                                        <Button type="ghost" icon={Delete} stroke={"#FF0D00"} onClick={() => removeMetric(val.field)} />

                                                        </Grid>
                                                }
                                            
                                            
                                           
                                       
                                  </Grid>  )
                                }
                                )}

                                    <TypographyNDL color='danger' variant='pargraph-xs' >{t("Note: Metrics that have been configured here will keep the assigned scaling factors, remaining metrics will be set to 1 and 0 for multiplication and calibration, respectively.")} </TypographyNDL>
                                <Grid container>
                                    
                                    <Grid item xs={12} align={'right'}>
                                    <div className="flex justify-end">
                                        <Button type="ghost" value={t('Add Metric')}  onClick={() => AddScalingFactorMetric()} />
                                   </div>
                                    </Grid>
                                </Grid>

                            </Grid>
                        </div>)
                    }
                </ModalContentNDL>

                <ModalFooterNDL>
                    <Button id='reason-update'  type={instrumentDialogMode === "scalingFactors" ? "ghost" :"secondary"} value={ formulaDialogMode ===
                        "Delete" ? t('NoCancel') : t('Cancel')} onClick={onClose}>
                    </Button>
                    {instrumentDialogMode === "scalingFactors" ? <Button type="secondary"   value={t('Back')} onClick={() => handleScalingFactorDialogBack()} /> : ''}

                    <Button id='reason-update' type="primary"   danger={ formulaDialogMode === "delete" ? true : false} value={ buttonValue} onClick={() => { clickFormulaButton() }}>
                    </Button>
                    
                </ModalFooterNDL>

            {/*ADD METRIC*/}
         
            <AddMetric
                typeID={ typeID}
                getMetricList={props.getMetricList}
                MetricDialog={MetricDialog}
                setMetricDialog={(val) => setMetricDialog(val)}
                setInstrumentIdErr={(val) => setInstrumentIdErr(val)}

            />

        </React.Fragment>
    )
});
export default AddInstrument;
