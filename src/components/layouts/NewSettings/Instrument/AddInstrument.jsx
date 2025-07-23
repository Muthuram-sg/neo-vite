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
import UseAddOfflineAlerts from "components/layouts/Settings/Instrument/Hooks/useAddOfflineAlerts";
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
import HorizontalLineNDL from "components/Core/HorizontalLine/HorizontalLineNDL";
import Plus from 'assets/neo_icons/Menu/plus.svg?react';
import BredCrumbsNDL from "components/Core/Bredcrumbs/BredCrumbsNDL";
import ModalNDL from 'components/Core/ModalNDL';


import Toast from "components/Core/Toast/ToastNDL";
import UseUpdateOfflineAlerts from "./Hooks/useUpdateOfflineAlerts";
import useGetOfflineAlerts from "./Hooks/useGetOfflineAlerts";
import useDeleteOfflineAlerts from "./Hooks/useDeleteOfflineAlerts";
const userWhoCanAddMetrics = ['d20da312-555f-4348-b18b-5b79ddaf8a16', '0a696f6f-aa86-47bc-a242-7b5877637f17', '1f7c38ad-c3e1-449a-b4d5-b8778edf41f2', '6e3388da-b962-45ee-a253-8a6676840fce', '9cae736a-ce84-4427-8896-7743d6589d6a', 'd91a9f8b-6fcf-4bb3-93b1-381dee918921', '9891bff6-792e-4d32-816e-6dca0a324c00', '3ad80462-7fff-4a02-af65-2565e1ab7134', '80e4e0c7-9da6-40da-a001-0bc207ea5707', '7aea64c5-3eb5-4338-874d-cccb560c1a60'];

// eslint-disable-next-line react-hooks/exhaustive-deps
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
    const [freqCountError, setFreqCountError] = useState('');
    const [instrumentTypeError, setTypeError] = useState('');
    const [instrumentIdErr, setInstrumentIdErr] = useState('');
    const [, setInstrumentErr] = useState(false);
    const [formulaName, setFormulaName] = useState('')
    const [InstID, setInstrumentID] = useState('')
    const [isOffline, setIsOffline] = useState(false);
    const [offlineFreq, setOfflineFreq] = useState(0)
    const [isForeCast, setIsForeCast] = useState(false);
    const [bredCrumbName, setbredCrumbName] = useState('New Instrument');
    const [isEnableContent, setIsEnableConetent] = useState(false);
    const [isReArrangeData, setReArrangeData] = useState([]);
    const [OpenModel, setOpenModel] = useState(false)
    const [addRows, setAddRows] = useState([{
        timeInterVal: "", UserList: []
    }]);
    const [freqValue, setFreqValue] = useState("");
    const [labelView, setLabelView] = useState("Day")
    const FreqCountref = useRef(0)
    const [openSnack, setOpenSnacks] = useState(false);
    const [timeOption, setTimeOption] = useState([]);
    const { checkInstrumentIdLoading, checkInstrumentIdData, checkInstrumentIdError, getCheckInstrumentId } = useCheckInstrumentId()
    const { checkInstrumentNameLoading, checkInstrumentNameData, checkInstrumentNameError, getCheckInstrumentName } = useCheckInstrumentName()
    const { AddInstrumentwithIDLoading, AddInstrumentwithIDData, AddInstrumentwithIDError, getAddInstrumentwithID } = useAddInstrumentwithID()
    const { AddInstrumentMetricsLoading, AddInstrumentMetricsData, AddInstrumentMetricsError, getAddInstrumentMetrics } = useAddInstrumentMetrics()
    const { AddInstrumentwithoutIDLoading, AddInstrumentwithoutIDData, AddInstrumentwithoutIDError, getAddInstrumentwithoutID } = useAddInstrumentwithoutID()
    const { UpdateInstrumentLoading, UpdateInstrumentData, UpdateInstrumentError, getUpdateInstrument } = useUpdateInstrument()
    const { DeleteInstrumentFormulaLoading, DeleteInstrumentFormulaData, DeleteInstrumentFormulaError, getDeleteInstrumentFormula } = useDeleteInstrumentFormula()
    const { DeleteInstrumentLoading, DeleteInstrumentData, DeleteInstrumentError, getDeleteInstrument } = useDeleteInstrument()
    const { UpdateFrequencyLoading, UpdateFrequencyData, UpdateFrequencyError, getUpdateFrequency } = useUpdateFrequency()
    const { UpdateMetricScalingFactorLoading, UpdateMetricScalingFactorData, UpdateMetricScalingFactorError, getUpdateMetricScalingFactor } = useUpdateMetricScalingFactor()
    const { InstrumentMetricFrequencyLoading, InstrumentMetricFrequencyData, InstrumentMetricFrequencyError, getInstrumentMetricFrequency } = useInstrumentMetricFrequency()
    const { InstrumentTypeListLoading, InstrumentTypeListData, InstrumentTypeListError, getInstrumentType } = useInstrumentType()
    //NOSONAR eslint-disable-next-line react-hooks/exhaustive-deps
    const { RefreshInstrumentlLoading, RefreshInstrumentlData, RefreshInstrumentlError, getRefreshInstrument } = useRefreshInstrument();//NOSONAR
    const { AddInstrumentMetricsForecastLoading, AddInstrumentMetricsForecastData, AddInstrumentMetricsForecastError, getAddInstrumentMetricsForecast } = useAddInstrumentMetricsForecast()//NOSONAR
        //NOSONAR eslint-disable-next-line react-hooks/exhaustive-deps
    const { ModelLoading, ModelData, ModelError, getBuildYourModel } = useBuildYourModel()//NOSONAR
    const { getBuildYourAnamolyModel } = useBuildYourAnamolyModel();
    const { UpdateInstrumentMetricForecastLoading, UpdateInstrumentMetricForecastData, UpdateInstrumentMetricForecastError, getUpdateInstrumentMetricForecast } = useUpdateInstrumentMetricForecast();//NOSONAR
    //  OffLine

    const { addOflineLoading, AddOfflineData, AddOfflineError, getAddOfflineAlerts } = UseAddOfflineAlerts();
    const { offlineAlertsLoading, updateOfflineData, offlineError, getUpdateOfflineAlerts } = UseUpdateOfflineAlerts()
    const { getOfflineLoading, getOfflineData, getOfflineError, getOfflineAlerts } = useGetOfflineAlerts()
    const { delOfflinewithoutIDLoading, delOfflinewithoutIDData, delOfflinewithoutIDError, getDeleteOfflineInstument } = useDeleteOfflineAlerts();
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
    const [namecheck, setnamecheck] = useState(false);
    const [, setModulClose] = useState(false);
    const [, setFCMetricsName] = useState([])
    const [, setMetricsText] = useState('');
    const [newMetric, SetNewMetric] = useState([]);
    const [extMetric, SetExeMetric] = useState([]);
    const [newFCMetric, SetFCNewMetric] = useState([]);
    const [extFCMetric, SetFCExeMetric] = useState([]);
    const [instrumentDialogMode, setInstrumentDialogMode] = useState('instrumentDetails');
    const [isScalingFactors, setIsScalingFactors] = useState(false);
    const [MetricFields, setMetricFields] = useState([{ field: 1, metric_id: '', mFactor: '', calibrationValue: '' }]);
    const [metricsList, setMetricsList] = useState([]);
    const [removedFactor, setRemovedFactor] = useState([]);
    const [updatedFactor, setUpdatedFactor] = useState([]);
    const [, setIname] = useState("");
    const [, setInstrument_Id] = useState("");
    const [, setDelID] = useState("");
    const [IID, setIID] = useState("");
    const FactorRef = useRef();
    const CalibrateRef = useRef();
    const [isoVisible, setIsoVisible] = useState(false);
    const [updateForeCastData, setupdateForeCastData] = useState([])

    const [message, setSnackMessage] = useState('');
    const [type, setSnackType] = useState('');
    const [fetchOfflineData, setFetchOfflineData] = useState([])
    const [isContinue, setIsConitune] = useState(false)

    useEffect(() => {
        const matchDayValue = selctedDaysList.find(x => x.secs === insFreq);
        setLabelView(matchDayValue ? matchDayValue.frequency : "Day");
    }, [insFreq]);

    useEffect(() => {
        if (insFreq) {
            handleFreq({ target: {   value:  insFreq } });
        }
    }, [insFreq]);

    useEffect(() => {
        getOfflineAlerts(headPlant.id,InstID )
    }, [headPlant.id, InstID])


    useEffect(() => {
        if (!getOfflineLoading && getOfflineData && !getOfflineError) {
            if (getOfflineData.length > 0) {
                setFetchOfflineData(getOfflineData)
            }
        }
    }, [getOfflineLoading, getOfflineData, getOfflineError])

    useEffect(() => {

        if (!delOfflinewithoutIDLoading && !delOfflinewithoutIDError && delOfflinewithoutIDData) {
            // SetMessage(t('The Instrument could not be deleted.Try again!'))
        }
        else if (delOfflinewithoutIDError) {
            SetMessage(t('The Instrument could not be deleted.Try again!'))
            SetType("error")
            setOpenSnack(true)

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delOfflinewithoutIDLoading, delOfflinewithoutIDData, delOfflinewithoutIDError]);


    const userjsonFormat = (addRows) => {
        let row = addRows.reduce((acc, x, index) => {
            const userIds = x.UserList.map(y => y.user_id);
            acc[`level${index + 1}`] = userIds;

            return acc;
        }, {});
        return row;
    }


    const frequencySecond = (rows) => {
        let data = rows.map(x => x.timeInterVal);
        let secondsData = data.map(x => {
            let duration;
            let lowerCaseX = x.toLowerCase();
            if (lowerCaseX.includes("mins")) {
                duration = moment.duration(parseInt(x), 'minutes');
            } else if (lowerCaseX.includes("hour")) {
                duration = moment.duration(parseInt(x), 'hours');
            } else if (lowerCaseX.includes("day")) {
                duration = moment.duration(parseInt(x), 'days');
            }
            return duration ? duration.asSeconds() : null;
        });

        let formattedEscalationTimes = `{${secondsData.filter(x => x !== null).join(",")}}`;
        return formattedEscalationTimes;
    }

    useEffect(() => {
        if (!props.formulaDialog) {
            handleFormulaDialogClose()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.formulaDialog])



    useEffect(() => {
        if (!addOflineLoading && !AddOfflineError && AddOfflineData) {
            SetMessage(t("AddInstrument"))
            SetType("success")
            setOpenSnack(true)

        }


    }, [addOflineLoading, AddOfflineData, AddOfflineError])



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
            handleFormulatDialogAdd: () => {
                setbredCrumbName("New Instrument")
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
            handleFormulaCrudDialogDuplicate: (id, data) => {
                setbredCrumbName("Duplicate Instrument")
                if (data && data.id) getInstrumentMetricFrequency(data.id)
                else setInsFreq(0)
                setFCMetricsName([])
                const metriclist = data && data.instruments_metrics ? data.instruments_metrics : [];
                let metricsid = [];
                let fcmetricsid = [];
                let fcmetricslist = [];
                if (metriclist.length > 0) {
                    metriclist.map(val => {
                        if (val.metric) {
                            metricsid.push(val.metric);
                            if (val.enable_forecast) {
                                fcmetricsid.push(val.metric);
                                fcmetricslist.push({ "title": val.metric.title });
                            }
                        }

                    })
                }
                let scalingFactor = metriclist.length > 0 ? calculateScalingFactor(metriclist) : [];

                if (scalingFactor.length === 0) {
                    scalingFactor.push({ field: 1, metric_id: '', mFactor: '', calibrationValue: '' })
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
                setInsFreq(data.frequncy)
                setCategoryID(data && data.instrument_category ? data.instrument_category.id : "");
                setisoID(data && data.instrument_class ? data.instrument_class : null);
                setTypeID(data && data.instrumentTypeByInstrumentType ? data.instrumentTypeByInstrumentType.id : "");
                setIsOffline(data && data.is_offline ? data.is_offline : false)
                setIsScalingFactors(data && data.is_scaling_factor ? data.is_scaling_factor : false)
                setFormulaDialogMode('duplicate');
                setFormulaDialog(true);

            }
            ,


            handleFormulaCrudDialogEdit: (id, data) => {
                console.log("dataEdit",data)
                setReArrangeData(data)
                setbredCrumbName("Edit Instrument")
                // getOfflineAlerts({ line_id: data && data.alerts_offline.line_id, iid: data.id })
                if (data && data.id) getInstrumentMetricFrequency(data.id)
                else setInsFreq('')

                setFCMetricsName([])

                const metriclist = data && data.instruments_metrics ? data.instruments_metrics : [];

          
                let metricsid = [];
                let fcmetricsid = [];
                let fcmetricslist = [];

                if (metriclist.length > 0) {
                    metriclist.map(val => {
                        if (val.metric) {
                            metricsid.push(val.metric);
                            if (val.enable_forecast) {
                                fcmetricsid.push(val.metric);
                                fcmetricslist.push({ "title": val.metric.title });
                            }
                        }
                    })
                }

                let scalingFactor = metriclist.length > 0 ? calculateScalingFactor(metriclist) : [];
                if (scalingFactor.length === 0) {
                    scalingFactor.push({ field: 1, metric_id: '', mFactor: '', calibrationValue: '' })
                }

                let optMetrics = [];
                if (props.metrics.length > 0 && metricsid.length > 0) {
                    optMetrics = metricsid.map(val => {
                        return props.metrics.filter((item) => item.id === val.id)[0]
                    })
                }
                setIsEnableConetent(
                    !!(data?.is_offline === true &&
                        data?.alerts_offline?.escalation_times?.length > 0 &&
                        Object.values(data?.alerts_offline?.escalation_users || {}).some(users => users.length > 0))
                );

                setTimeout(() => {
                    if (data?.is_offline && data?.alerts_offline?.frequency_count) {
                        if (FreqCountref.current) {
                            FreqCountref.current.value = data.alerts_offline.frequency_count;
                        }
                    }
                }, 500);

                if (data && data.is_offline && data.alerts_offline) {
                    const escalationLevels = data.alerts_offline.escalation_users;
                    const escalationTimes = data.alerts_offline.escalation_times;
                    const structuredData = Object.entries(escalationLevels).map(([level, userIds], index) => {
                        const timeKey = parseInt(escalationTimes[index]);
                        return {
                            level: level,
                            users: props.UserOption.filter(user => userIds.includes(user.user_id)),
                            timeInterVal: getTimeObject[timeKey] || ""
                        };
                    });
                    setAddRows(structuredData.map(data => ({ timeInterVal: data.timeInterVal, UserList: data.users })));
                }



                setMetricsList(optMetrics);
                setMetricsID(metricsid)
                SetExeMetric(metricsid)
               





                setFreqValue(data?.is_offline && data?.alerts_offline?.frequency_count)
                SetNewMetric(metricsid)//when edit opened both new and existing metrics would be same
                setIsForeCast(data && data.enable_forecast ? data.enable_forecast : false)
                setMetricFields(scalingFactor)
                setFCMetricsName(fcmetricslist)
                setFCMetricsID(fcmetricsid)
                SetFCExeMetric(fcmetricsid)
                SetFCNewMetric(fcmetricsid)
                setRemovedFactor([])
                setInstrumentID(data && data.id ? data.id : "")
                setInsFreq(data.frequncy)

                setFormulaName(data && data.name ? data.name : "")
                setCategoryID(data && data.instrument_category ? data.instrument_category.id : "");
                setisoID(data && data.instrument_class ? data.instrument_class : null);
                setTypeID(data && data.instrumentTypeByInstrumentType ? data.instrumentTypeByInstrumentType.id : "");
                setIsOffline(data && data.is_offline ? data.is_offline : false)

                setIsScalingFactors(data && data.is_scaling_factor ? data.is_scaling_factor : false)
                setFormulaDialogMode('edit');
                setFormulaDialog(true);



            }
        }
    )
    )



    useEffect(() => {
        if (categoryID) {
            getInstrumentType(categoryID);
        }
        if (categoryID === 3) {
            setIsoVisible(true)
        } else {
            setIsoVisible(false)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryID])
    useEffect(() => {

        if (!InstrumentMetricFrequencyLoading && !InstrumentMetricFrequencyError && InstrumentMetricFrequencyData) {
            const freqarr = InstrumentMetricFrequencyData.map((val) => val.frequency);

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
            if (AddInstrumentMetricsForecastData.affected_rows > 0) {
                AddInstrumentMetricsForecastData.returning.map(async val => {

                    SetMessage(t("AddInstrument" + '' + formulaName))
                    SetType("success")
                    setOpenSnack(true)
                    props.refreshTable();
                    props.getInstrumentFormulaList();
                    handleFormulaDialogClose();


                })
            }
        }




        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AddInstrumentMetricsForecastLoading, AddInstrumentMetricsForecastData, AddInstrumentMetricsForecastError])

    useEffect(() => {
        if (!UpdateInstrumentMetricForecastLoading && UpdateInstrumentMetricForecastData && !UpdateInstrumentMetricForecastError) {
            if (UpdateInstrumentMetricForecastData.length > 0) {
                // console.log('updateForcast',UpdateInstrumentMetricForecastData)
                setupdateForeCastData(UpdateInstrumentMetricForecastData)
                getUpdateFrequency(InstID, insFreq)

            }
          

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
        setMetricFields([{ field: 1, metric_id: '', mFactor: '', calibrationValue: '' }]);
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
            secs: 2,
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

    const selctedDaysList = [
        {
            secs: 1,
            frequency: "None",
            day: 0
        },
        {
            secs: 2,
            frequency: "Shift",
            day: 1
        },
        {
            secs: 3600,
            frequency: "Hour",
            day: 1
        },
        {
            secs: 86400,
            frequency: "Day",
            day: 1
        },
        {
            secs: 2628288,
            frequency: "Month",
            day: 1
        }

    ];


    const timeLineList = [
        {
            secs: 2,
            "15Mins": "15 Minutes",
            "30Mins": "30 Minutes",
            "45Mins": "45 Minutes"
        },
        {
            secs: 3600,
            "5Mins": "5 Minutes",
            "10Mins": "10 Minutes",
            "15Mins": "15 Minutes"
         
        },
        {
            secs: 86400,
            "1Hour": "1 Hour",
            "2Hour": "2 Hour",
            "3Hour": "3 Hour"
        },
        {
            secs: 2628288,
            "1Day": "1 Day",
            "2Day": "2 Day",
            "3Day": "3 Day"
        }
    ];
  
    const getTimeObject = {
        300: "5Mins",
        600: "10Mins",
        900: "15Mins",
        1800: "30Mins",
        2700: "45Mins",
        3600: "1Hour",
        7200: "2Hour",
        10800: "3Hour",
        86400: "1Day",
        172800: "2Day",
        259200: "3Day"
    };

    useEffect(() => {
        setTimeout(() => {

            if (InstrumentName.current) {
                InstrumentName.current.value = formulaName

            }

        }, 500)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formulaDialog])

    useEffect(() => {
        if (isOffline) {
            setOfflineFreq(insFreq);
        } else {
            if (Frequency && Frequency.current) {
                Frequency.current.value = insFreq
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [insFreq])

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
                    getCheckInstrumentName(formulaName, checkInstrumentIdData.type, headPlant.id, "")
                } else {
                    getCheckInstrumentName(formulaName, checkInstrumentIdData.type, headPlant.id, InstID)
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
                    let data = {
                        instrumentID: IID,
                        line_id: headPlant.id,
                        formulaName: formulaName,
                        categoryID: categoryID
                    }
                    let datas = {
                        data: data,
                        typeID: typeID,
                        isoID: isoID
                    }
                    getAddInstrumentwithID(datas, currUser.id, metricsID, currUser, insFreq, isOffline, isScalingFactors, isForeCast, fcMetricsID)
                }

            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkInstrumentNameLoading, checkInstrumentNameData, checkInstrumentNameError])


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
            if (isOffline) {
                getRefreshInstrument(headPlant.schema)
            }

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AddInstrumentwithoutIDLoading, AddInstrumentwithoutIDError, AddInstrumentwithoutIDData])


    useEffect(() => {

        if (!AddInstrumentwithIDLoading && AddInstrumentwithIDData === null && AddInstrumentwithIDError) {
            SetMessage(t("Instrument Id already exist "));
            SetType("error")
            setOpenSnack(true)

        }

        if (!AddInstrumentwithIDLoading && !AddInstrumentwithIDError && AddInstrumentwithIDData) {
            if (AddInstrumentwithIDData.length > 0 && isOffline) {
                let escalation_users = userjsonFormat(addRows);
                let frequencySeconds = frequencySecond(addRows);
                getAddOfflineAlerts(
                    InstID,
                    offlineFreq,
                    frequencySeconds,
                    escalation_users,
                    null,
                    currUser.id,
                    headPlant.id,
                    Number(FreqCountref.current?.value) 
                );

            }

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


        if (isOffline) {
            getRefreshInstrument(headPlant.schema)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AddInstrumentwithIDLoading, AddInstrumentwithIDError, AddInstrumentwithIDData])



    useEffect(() => {
        if (!AddInstrumentMetricsLoading && !AddInstrumentMetricsError && AddInstrumentMetricsData) {
            //In Edit New metric added the update scaling factor
            if (AddInstrumentMetricsData && AddInstrumentMetricsData.returning.length > 0) {
            
                let difference2 = newFCMetric.filter(x => !extFCMetric.includes(x));
                if (difference2.length > 0) {
                    // getAddInstrumentMetricsForecast(updateForeCastData)
                    difference2.forEach((mdata) => {
                        let data = {
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
                    SetMessage(t("AddInstrument" + '' + formulaName))
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
                } else {
                    getUpdateFrequency(InstID, insFreq)
                    SetMessage(t("AddInstrument" + '' + formulaName))
                    SetType("success")
                    setOpenSnack(true)
                    props.getInstrumentFormulaList();
                    // console.log('3')

                    handleFormulaDialogClose();
                }
            }
            if (isScalingFactors) {
                getUpdateMetricScalingFactor(InstID, updatedFactor)
            }
            else {
                getUpdateFrequency(InstID, insFreq)
                SetMessage(t("AddInstrument" + formulaName))
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
            getUpdateFrequency(InstID, insFreq)

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [UpdateMetricScalingFactorLoading, UpdateMetricScalingFactorData, UpdateMetricScalingFactorError])

    useEffect(() => {
        if (!UpdateFrequencyError && !UpdateFrequencyLoading && UpdateFrequencyData) {


            if (formulaDialogMode === "create" || formulaDialogMode === "duplicate") {
                SetMessage(t('AddInstrument') + ' ' + formulaName)
            }
            else {
                SetMessage(t('UpdateInstrument') + ' ' + formulaName)
            }
            let difference2 = newFCMetric.filter(x => !extFCMetric.includes(x));
            console.log(difference2)
            console.log(updateForeCastData)
            if (difference2.length > 0) {
                // getAddInstrumentMetricsForecast(updateForeCastData)
                difference2.forEach((mdata) => {
                    let data = {
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
            } else {
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
                getAddInstrumentMetrics(UpdateInstrumentData)
            }
            else {
                // If no metric change for the instrument
                // console.log('enter no metric change')

                // getUpdateInstrumentMetricForecast(InstID, headPlant.id, formulaName, categoryID, typeID, currUser.id, extMetric.map(x=>x.id), newMetric.map(x=>x.id), currUser, insFreq, metricsID, isOffline, isForeCast, extFCMetric.map(x=>x.id), newFCMetric.map(x=>x.id))

                getUpdateMetricScalingFactor(InstID, updatedFactor, formulaDialogMode, extFCMetric.map(x => x.id), fcMetricsID.map(x => x.id))
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
        if (!offlineAlertsLoading && !offlineError && updateOfflineData) {
            if (updateOfflineData && updateOfflineData.affected_rows > 0) {
                SetMessage(t('UpdatedInstrument'));
                SetType("success");
                setOpenSnack(true);
            }
        }
    }, [offlineAlertsLoading, offlineError, updateOfflineData]);




    useEffect(() => {
        if (!DeleteInstrumentFormulaLoading && !DeleteInstrumentFormulaError && DeleteInstrumentFormulaData) {

            if (DeleteInstrumentFormulaData.affected_rows >= 1) {
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
        if (!Frequency.current) return;

        const freqValue = Frequency.current.value;

        setInsFreq(freqValue);
        handleFreq({ target: { value: freqValue } });

      

        if (freqValue.length > 0) {
            setFreqInputError("");
        } else {
            setFreqInputError(t('Please Input the frequency value'));
        }
    };

    const checkInstrumentName = async (e) => {
        setnamecheck(true)
       
        if (e) {
            const instrumentName = trim(InstrumentName.current.value);
            if (instrumentName.length > 0) {
                setInstrumentNameErr('');
                if (formulaDialogMode === "create") {
                await getCheckInstrumentName(instrumentName, formulaDialogMode, headPlant.id, "")
                } else {
                    await getCheckInstrumentName(instrumentName, formulaDialogMode, headPlant.id, InstID)
                }
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
        let cDelID = InstrumentID.current ? InstrumentID.current.value : InstID;


        if (isOffline && isEnableContent && (formulaDialogMode === "create" || formulaDialogMode === "edit")) {
            const invalidIndex = lastIndexRow();
            if (invalidIndex !== -1 ) {
                setSnackMessage(`Row ${invalidIndex + 1} is missing required fields.`);
                setSnackType("warning");
                setOpenSnacks(true);
                return;
            }

        }

        


        if (instrumentDialogMode === "instrumentDetails") {
            setIname(cIname)
            setInstrument_Id(cinstrumentId)
            setDelID(cDelID)
            setIID(cIID)
            setFormulaName(cIname)
            setInstrumentID((formulaDialogMode === 'create' || formulaDialogMode === 'duplicate') ? cIID : InstID)
            if (
                formulaDialogMode !== "delete" &&
                (
                  cIID === "" || 
                  cIname === "" ||  
                  (isOffline && isEnableContent && !freqValue) || 
                  splCheck.length > 1 || 
                  categoryID === "" || 
                  typeID === "" || 
                  (typeID === 3 && isoID === "") || 
                  metricsID.length === 0 || 
                  insFreq === ""
                )
              ) {
               

                console.log(FreqCountref.current?.value,"freqValue",freqValue)
     
                if (cIID === "" || splCheck.length > 1) {
                  setTextInputError(
                    splCheck.length > 1 ? t("Invalid Instrument Id") : t("InstrumentIDErrMsg")
                  );
                  return false;
                }
              
                if (isOffline && isEnableContent && (!FreqCountref.current?.value || !freqValue)) {
                  setFreqCountError("Please select FreqCount");
                  return false;
                }
              
                if (insFreq === "") {
                  setFreqInputError(t("FreqErrMsg"));
                  return false;
                }
                if (cIname === "") {
                  setInstrumentNameErr(t("InstrumentNameErrMsg"));
                  return false;
                }
                if (categoryID === "") {
                  setInstrumentCategoryErr(t("InstrumentCategoryErrMsg"));
                  return false;
                }
                if (typeID === "") {
                  setTypeError(t("InstrumentTypeErrMsg"));
                  return false;
                }
                if (typeID === 3 && isoID === "") { 
                  setTypeError(t("InstrumentClassErrMsg"));
                  return false;
                }
                if (metricsID.length === 0) {
                  setMetricsError(t("InstrumentmetricErrMsg"));
                  return false;
                }
              
              
                props.setLoading(false);
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
            setFreqCountError("")
        }

           if(formulaDialogMode === 'edit' && isContinue && !isOffline){
            getDeleteOfflineInstument(InstID, headPlant.id);
           }
       

        if (formulaDialogMode === 'edit' && isOffline && isEnableContent) {
            let escalation_users = userjsonFormat(addRows);
            let frequencySeconds = frequencySecond(addRows);

            if (fetchOfflineData.length ) {
                console.log("fetchOfflineData",fetchOfflineData)
                getUpdateOfflineAlerts(InstID, offlineFreq, frequencySeconds, escalation_users, null, currUser.id, headPlant.id, Number(FreqCountref.current?.value) );


            } else {
                console.log("callingElseIns")
                getAddOfflineAlerts(InstID, offlineFreq, frequencySeconds, escalation_users, null, currUser.id, headPlant.id, Number(FreqCountref.current?.value) );

            }

        }
        if (formulaDialogMode === 'edit') {
            if (isOffline !== isReArrangeData.is_offline && fetchOfflineData.length) {
                getDeleteOfflineInstument(InstID, headPlant.id);
            }
        }

        if (formulaDialogMode === 'delete') {

            if (cIID !== '') {
                getDeleteInstrument(cDelID)

            }
        } else {

            if (instrumentDialogMode === "instrumentDetails" && formulaDialogMode === 'edit') {
                let updatedMetricsID = []

                MetricFields.forEach((val, i) => {
                    if (val.metric_id !== "") {
                        updatedMetricsID.push({ field: i + 1, metric_id: val.metric_id, mFactor: 1, calibrationValue: 0 });
                    }
                })

                setUpdatedFactor(updatedMetricsID)
            }


            if (isScalingFactors) {

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

                    if(namecheck){
                    if (cIID && cIname && categoryID && typeID && checkInstrumentNameData?.Data?.neo_skeleton_instruments_aggregate?.aggregate?.count === 0) {
                        let param = {
                            instrumentID: cIID,
                            line_id: headPlant.id,
                            formulaName: cIname,
                            categoryID,
                            typeID,
                            isoID: isoID || null,
                            user_id: currUser.id,
                            offline: isOffline,
                            extMetric: extMetric.map(x => x.id),
                            newMetric: newMetric.map(x => x.id),
                            currUser,
                            metricsID,
                            insFreq,
                            isScalingFactors,
                            isForeCast,
                            extFCMetric: extFCMetric.map(x => x.id), 
                            newFCMetric: newFCMetric.map(x => x.id)
                        };

                        props.enableButtonLoader(true);
                        getUpdateInstrument(param);
                    } else if(checkInstrumentNameData?.Data?.neo_skeleton_instruments_aggregate?.aggregate?.count > 0){
                        setInstrumentNameErr(t("Instrument Name already exist"));
                        setInstrumentErr(true);
                    }
                } else {
                    if (cIID && cIname && categoryID && typeID) {
                        let param = {
                            instrumentID: cIID,
                            line_id: headPlant.id,
                            formulaName: cIname,
                            categoryID,
                            typeID,
                            isoID: isoID || null,
                            user_id: currUser.id,
                            offline: isOffline,
                            extMetric: extMetric.map(x => x.id),
                            newMetric: newMetric.map(x => x.id),
                            currUser,
                            metricsID,
                            insFreq,
                            isScalingFactors,
                            isForeCast,
                            extFCMetric: extFCMetric.map(x => x.id), 
                            newFCMetric: newFCMetric.map(x => x.id)
                        };

                        props.enableButtonLoader(true);
                        getUpdateInstrument(param);
                    }
                }
                }
            } else {
                if (formulaName !== '' && categoryID !== '' && typeID !== '') {
                    props.enableButtonLoader(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps

                    AddInstrumentWithoutID(headPlant.id, cIname, categoryID, typeID, isoID ? isoID : null, "{" + metricsID.toString() + "}", currUser.id)

                }
            }


        }


    }

    function AddInstrumentWithoutID(line_id, formulaName, categoryID, typeID, metricsID, user_id) {

        getAddInstrumentwithoutID(line_id, formulaName, categoryID, typeID, metricsID, user_id, isOffline, isForeCast)
    }


    const handleFreq = (e) => {
        if (e.target.value === 1) {
            setIsEnableConetent(false);
        }

        const matchedTimeLine = timeLineList.find(x => x.secs === e.target.value);
        // console.log("matchedTimeLine",matchedTimeLine)
        const matchDayValue = selctedDaysList.find(x => x.secs === e.target.value);
        const newVal = matchDayValue ? matchDayValue.day : 0;
        let options = matchedTimeLine
        ? Object.entries(matchedTimeLine)
            .filter(([key]) => key !== "secs") 
            .map(([key, value]) => ({ id: key, value: value }))

        : [];

    

        if (FreqCountref.current) {
            FreqCountref.current.value = newVal;

        }
        setTimeOption(options);
        setInsFreq(e.target.value);
    };



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
        setFreqCountError("")
        setInstrumentValidation(true)
        setInstrumentDialogMode("instrumentDetails");
        setIsScalingFactors(false);
        setMetricFields([{ field: 1, metric_id: '', mFactor: '', calibrationValue: '' }]);
        setMetricsList([]);
        setRemovedFactor([])
        props.handlepageChange()

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (isOffline !== isReArrangeData.is_offline) {
            setCategoryID('');
            setTypeID('');
            setTypes([]);
            setMetricsList([]);
            setMetricsID("");
          
            setMetricFields([{ field: 1, metric_id: '', mFactor: '', calibrationValue: '' }]);
        } else {
            if (isReArrangeData && isReArrangeData.id) getInstrumentMetricFrequency(isReArrangeData.id)
            const metriclist = isReArrangeData && isReArrangeData.instruments_metrics ? isReArrangeData.instruments_metrics : [];
            let metricsid = [];
            


            if (metriclist.length > 0) {
                metriclist.map(val => {
                    if (val.metric) {
                        metricsid.push(val.metric);
                       
                    }
                })
            }
            let scalingFactor = metriclist.length > 0 ? calculateScalingFactor(metriclist) : [];

            if (scalingFactor.length === 0) {
                scalingFactor.push({ field: 1, metric_id: '', mFactor: '', calibrationValue: '' })
            }
            let optMetrics = [];
            if (props.metrics.length > 0 && metricsid.length > 0) {
                optMetrics = metricsid.map(val => {
                    return props.metrics.filter((item) => item.id === val.id)[0]
                })
            }

            setIsEnableConetent(
                !!(isReArrangeData?.is_offline === true &&
                    isReArrangeData?.alerts_offline?.escalation_times?.length > 0 &&
                    Object.values(isReArrangeData?.alerts_offline?.escalation_users || {}).some(users => users.length > 0))
            );

         
            
            setTimeout(() => {
                if (isReArrangeData?.is_offline && isReArrangeData?.alerts_offline?.frequency_count) {
                    if (FreqCountref.current) {
                        FreqCountref.current.value = isReArrangeData.alerts_offline.frequency_count;
                    }
                }
            }, 500);

            if (isReArrangeData && isReArrangeData.is_offline && isReArrangeData.alerts_offline) {
                const escalationLevels = isReArrangeData.alerts_offline.escalation_users;
                const escalationTimes = isReArrangeData.alerts_offline.escalation_times;
                const structuredData = Object.entries(escalationLevels).map(([level, userIds], index) => {
                    const timeKey = parseInt(escalationTimes[index]);
                    return {
                        level: level,
                        users: props.UserOption.filter(user => userIds.includes(user.user_id)),
                        timeInterVal: getTimeObject[timeKey] || ""
                    };
                });
                setAddRows(structuredData.map(data => ({ timeInterVal: data.timeInterVal, UserList: data.users })));
            }


            setMetricsList(optMetrics);
            setMetricsID(metricsid)
            SetExeMetric(metricsid);
            SetNewMetric(metricsid)
            setMetricFields(scalingFactor);
            setRemovedFactor([])
            setInstrumentID(isReArrangeData && isReArrangeData.id ? isReArrangeData.id : "")
            setisoID(isReArrangeData && isReArrangeData.instrument_class ? isReArrangeData.instrument_class : null);
            setTypeID(isReArrangeData && isReArrangeData.instrumentTypeByInstrumentType ? isReArrangeData.instrumentTypeByInstrumentType.id : "");
            setIsOffline(isReArrangeData && isReArrangeData.is_offline ? isReArrangeData.is_offline : false)
            setIsScalingFactors(isReArrangeData && isReArrangeData.is_scaling_factor ? isReArrangeData.is_scaling_factor : false)
            setCategoryID(isReArrangeData?.instrument_category?.id || "");
            setTypeID(isReArrangeData?.instrumentTypeByInstrumentType?.id || "");


        }
    }, [isOffline]);



    useEffect(() => {
        if (
            isReArrangeData?.alerts_offline &&
            Number(insFreq) !== Number(isReArrangeData.alerts_offline.frequency_seconds)
        ) {
            setAddRows([{ timeInterVal: "", UserList: [] }]);
            if (FreqCountref.current) {
                FreqCountref.current.value = "";
            }
            // setFreqValue("")
        }

        else {
            if (isReArrangeData && isReArrangeData.is_offline && isReArrangeData.alerts_offline) {
                const escalationLevels = isReArrangeData.alerts_offline.escalation_users;
                const escalationTimes = isReArrangeData.alerts_offline.escalation_times;
                const structuredData = Object.entries(escalationLevels).map(([level, userIds], index) => {
                    const timeKey = parseInt(escalationTimes[index]); // Ensure number type
                    return {
                        level: level,
                        users: props.UserOption.filter(user => userIds.includes(user.user_id)),
                        timeInterVal: getTimeObject[timeKey] || "" // Assign mapped value
                    };
                });


                setAddRows(structuredData.map(data => ({ timeInterVal: data.timeInterVal, UserList: data.users })));
            }
            setTimeout(() => {
                if (isReArrangeData?.is_offline && isReArrangeData?.alerts_offline?.frequency_count) {
                    if (FreqCountref.current) {
                        FreqCountref.current.value = isReArrangeData.alerts_offline.frequency_count;
                    }
                }
            }, 500);
            
        }
    }, [insFreq, isReArrangeData]);

   


    const handleOffline = (type) => {
        if (type === false) {
            setIsEnableConetent(false);
       
        }
  
        
        setIsOffline(type);
    };
  


    const handleScalingFactors = () => {
        setIsScalingFactors(!isScalingFactors)
    }


    function handleScalingFactorMetricChange(e, field) {

        let exist = MetricFields.filter(v => v.metric_id === e.target.value)
        if (exist.length > 0) {
            SetMessage(t('Metric Already Selected'))
            SetType("warning")
            setOpenSnack(true)
        } else {
            let setelement = [...MetricFields];
            const fieldIndex = setelement.findIndex(x => x.field === field);
            let fieldObj = { ...setelement[fieldIndex] };

            fieldObj['metric_id'] = e.target.value;
            setelement[fieldIndex] = fieldObj;

            setMetricFields(setelement);

        }

    }

    function handleFactor(e, field) {

        let setelement = [...MetricFields];
        const fieldIndex = setelement.findIndex(x => x.field === field);
        let fieldObj = { ...setelement[fieldIndex] };

        fieldObj['mFactor'] = Number(e.target.value)
        setelement[fieldIndex] = fieldObj;

        setMetricFields(setelement);
    }

    function handleCalibrate(e, field) {

        let setelement = [...MetricFields];
        const fieldIndex = setelement.findIndex(x => x.field === field);
        let fieldObj = { ...setelement[fieldIndex] };

        fieldObj['calibrationValue'] = Number(e.target.value)
        setelement[fieldIndex] = fieldObj;

        setMetricFields(setelement);
    }

    function AddScalingFactorMetric() {
        if (metricsList.length !== MetricFields.length) {
            let setelement = [...MetricFields];
            const lastfield = setelement.length > 0 ? Number(setelement[setelement.length - 1].field) + 1 : 1;
            setelement.push({ field: lastfield, metric_id: '', mFactor: '', calibrationValue: '' });
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

    const labelChanges=()=>{
        if(insFreq===3600){
return "Data must be entered in hourly frequency"
        }
        else if(insFreq===1){
       return "Data can be entered at any time as needed"
        }
        else if(insFreq===2){
       return "Data should be updated at the end of the shift"
        }
        else if(insFreq===86400){
      return "Data must be entered once in daily frequency"
        }
        else if(insFreq===2628288){
return "Data needs to be entered once in monthwise"
        }
    }

    function removeDuplicates(array, property) {
        const uniqueMap = new Map();
        array && array.forEach(item => {
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
                 
                    info={labelChanges()}
                />
            </div>


        );
    }

    let buttonValue;

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

    let errMessage = errormsg ? ({ errormsg }) : null
    let disabledOp = formulaDialogMode === "create" && instrumentValidation ? instrumentValidation : false
    let helperTextMes = instrumentNameErr ? instrumentNameErr : undefined
    let errDel = instrumentNameErr ? true : false
    let isDisabled = formulaDialogMode === "create" && instrumentValidation ? instrumentValidation : false;
    const breadcrump = [{ id: 0, name: 'Instrument' }, { id: 1, name: bredCrumbName }]
    const handleActiveIndex = (index) => {
        if (index === 0) {
            props.handlepageChange()
        }

    }

    const handleEnableContentChange = () => {
        if (isEnableContent) {
            setOpenModel(true);
          
        } else {
            setIsEnableConetent(true);
            setAddRows([{ timeInterVal: "", UserList: [] }]);
            setIsConitune(false)

            
        }
    };
  
    const lastIndexRow = () => {
        const invalidIndex = addRows.findLastIndex(row => !row.timeInterVal || row.UserList.length === 0);
        return invalidIndex;
    };


    const validateRows = (addRows) => {

        const invalidIndexes = addRows
            .map((row, index) => (!row.timeInterVal || !row.UserList || row.UserList.length === 0) ? index : null)
            .filter(index => index !== null);
        return invalidIndexes.length > 0 ? invalidIndexes : false;
    };

    const handleAddRow = () => {
        const hasError = validateRows(addRows);
        if (hasError && (formulaDialogMode === "edit" || formulaDialogMode === "create")) {
            setSnackMessage("One or more rows are missing required fields.");
            setSnackType("warning");
            setOpenSnacks(true);
            return;
        }

        // Add a new valid row
        setAddRows([...addRows, { timeInterVal: "", UserList: [] }]);
    };
    const handleRowDelete = (index) => {
        const filterRow = addRows.filter((_, i) => i !== index);
        setAddRows(filterRow)
    }

    const handlOfflineChange = (val, key, index) => {

        setAddRows((prevRows) => {
            return prevRows.map((row, i) =>
                i === index ? { ...row, [key]: key === "UserList" ? [...val] : val } : row
            );
        });
    };
    const handleDialogClose = () => {
        setIsEnableConetent(true);
        setOpenModel(false)
    }

    const handleModalConfirm = () => {
        if (formulaDialogMode === 'edit') {
            if (isOffline && fetchOfflineData.length) {
                console.log("enterDel")
                setIsConitune(true)
               
            }
        }
        setFreqValue("");
        setIsEnableConetent(false);
        setAddRows([{ timeInterVal: "", UserList: [] }]);
        setOpenModel(false);
        
    };
  
    const handleInputChange = () => {
        if (FreqCountref.current) {
            setFreqValue(FreqCountref.current.value);

        }
    };


    return (
        <React.Fragment>
            <Toast type={type} message={message} toastBar={openSnack} handleSnackClose={() => setOpenSnacks(false)} ></Toast>
            <div className="h-[48px] py-3.5 px-4 border-b flex items-center justify-between bg-Background-bg-primary dark:bg-Background-bg-primary-dark border-Border-border-50 dark:border-Border-border-dark-50">

                <BredCrumbsNDL breadcrump={breadcrump} onActive={handleActiveIndex} />

                <div className="flex gap-2 items-center">
                    <Button id='reason-update' type={"secondary"} value={t('Cancel')} onClick={onClose}>
                    </Button>
                    

                    <Button id='reason-update' type="primary" danger={formulaDialogMode === "delete" ? true : false} value={buttonValue} loading={props.buttonLoader} onClick={() => { clickFormulaButton() }}>
                    </Button>
                </div>
            </div>
            <div className="p-4 max-h-[93vh] overflow-y-auto">
                <Grid container style={{ padding: "16px" }} >
                    <Grid item xs={2}>

                    </Grid>
                    <Grid item xs={8}>
                        
                        <div className="flex flex-col items-start mb-3">
                            <TypographyNDL id="entity-dialog-title" variant="heading-02-xs" value={dialogTitle} />
                            <TypographyNDL variant="lable-01-s" color="secondary" value={'Add and configure new Instrument within the Neo'} />
                        </div>
                     
                        <div>
                            {errMessage}
                            {formulaDialogMode === "delete" &&
                                <div className="flex flex-col gap-3">
                                    <TypographyNDL variant="paragraph-s" color="secondary" value={t('DeleteLineFormula') + props.formulaName + t('TheLine') + headPlant.name + t('NotReversible')} />
                                    <TypographyNDL variant="paragraph-s" color="danger">{'Note :' + t("All the associated comments, oee configuration and alerts will be deleted permanently.")}</TypographyNDL>
                                </div>

                            }
                            {
                                (formulaDialogMode === "create" || formulaDialogMode === "duplicate") &&
                                <div className="mb-3 w-[50%]">

                                    <InputFieldNDL
                                        id="instrument-id"
                                        label={t('Instrumentid')}
                                        inputRef={InstrumentID}
                                        onBlur={checkInstrumentId}
                                        onChange={checkInstrumentIdvalue}
                                       
                                        required={true}
                                        placeholder={t('Instrumentid')}
                                        error={textInputError || instrumentIdErr}
                                        helperText={textInputError || instrumentIdErr}
                                    />

                                </div>


                            }
                            {formulaDialogMode !== "delete" &&
                                <React.Fragment>
                                    <div className="mb-3 w-[50%]">
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
                                    <div className="my-3">
                                        <div className="flex items-center gap-4">
                                            <RadioNDL labelText={t('Online Instrument')} description={"Automatically transmits data from the instrument in real-time"} id="online" checked={!isOffline} onChange={() => handleOffline(false)} />
                                            <RadioNDL labelText={t('Offline Instrument')} description={"Requires manual entry of sensor data into the system."} id="offline" checked={isOffline} onChange={() => handleOffline(true)} />
                                        </div>
                                    </div>

                                    <div className="mb-3 w-[50%]">
                                        <SelectBox
                                            id='select-metric-category'
                                            value={categoryID}
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
                                        <div className="mb-3 w-[50%]">
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

                                    <div className="mb-3 w-[50%]">
                                        <SelectBox
                                            required={true}
                                            id='select-instrument-type'
                                            value={typeID}
                                            onChange={handleInstrumentType}
                                            label={t('Instrument Type')}
                                            disabled={disabledOp}
                                            auto={false}
                                            isMArray={true}
                                            keyId={"id"}
                                            keyValue={"name"}
                                            options={types}
                                            error={instrumentTypeError}
                                            msg={instrumentTypeError}
                                            defaultDisableOption={true}

                                        >
                                        </SelectBox>
                                    </div>

                                    <div className='w-[50%]' style={{ marginBottom: 12, display: 'flex', alignItems: "end" }} >
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
                                            error={instrumentMetricsError}
                                            msg={instrumentMetricsError}
                                            isBtnActive={userWhoCanAddMetrics.includes(currUser.id)}
                                            btnProps={<Button onClick={(e) => { e.stopPropagation(); handleMetricDialog() }} icon={AddLight} type={"ghost"} />}
                                        />
                                        {userWhoCanAddMetrics.includes(currUser.id) &&
                                            <Button onClick={(e) => { e.stopPropagation(); handleMetricDialog() }} icon={AddLight} type={"ghost"} />
                                        }
                                    </div>


                                    {formulaDialogMode === "edit" &&

                                        <div className="my-3">
                                            <TypographyNDL variant="paragraph-s" color="danger" value={"Note: If metric removed alarm might be deleted"} />

                                        </div>
                                    }
                                    <Grid item xs={12}>
                                        <Grid container spacing={4} style={{ marginBottom: "12px", marginTop: 10 }}>
                                            <Grid item xs={6}>
                                                {frequencyInput}
                                            </Grid>
                                            
                                            <Grid item xs={6}>
                                                {
                                                    isEnableContent &&
                                                    <InputFieldNDL
                                                        id="line-location"
                                                        label={labelView}
                                                        inputRef={FreqCountref}
                                                        onChange={handleInputChange} 
                                                        onKeyDown={(e) => {
                                                            if (e.key === '.' || e.key === ',' || e.key === 'e') {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        error={freqCountError ? true : false}
                                                       
                                                        helperText={ `Data must be entered every ${ freqValue ? freqValue : ''} ${labelView}`}
                                                    />
                                                }

                                            </Grid>

                                        </Grid>
                                    </Grid>
                                    <div>
                                        <CustomSwitch
                                            checked={isEnableContent}
                                            disabled={!isOffline || offlineFreq === 1}
                                            primaryLabel="Enable Notifications and Escalations"
                                            description="Enable notifications and escalation levels to ensure timely data updates for offline instruments."
                                            onChange={handleEnableContentChange}
                                        />
                                    </div>
                                    {
                                        isEnableContent && (
                                            <Grid item xs={12}>
                                                {addRows.map((x, index) => (
    // eslint-disable-next-line react-hooks/exhaustive-deps

                                                    <Grid container spacing={4} style={{ marginBottom: "12px", marginTop: 10 }}>
                                                        <Grid item xs={5} >
                                                            <SelectBox
                                                                id="Time Interval"
                                                                auto={false}
                                                                options={timeOption ?  timeOption: []} 
                                                                isMArray={true}
                                                                keyValue="value"
                                                                keyId="id"
                                                                value={x.timeInterVal}
                                                                multiple={false}
                                                                label="Time Interval"
                                                                onChange={(e) => handlOfflineChange(e.target.value, 'timeInterVal', index,)}
                                                                noSorting

                                                            />
                                                        </Grid>
                                                        <Grid item xs={5} >
                                                            <SelectBox
                                                                labelId="lblAlertOtherUsers"
                                                                id="AlertOtherUsers"
                                                                edit={true}
                                                                auto={true}
                                                                multiple={true}
                                                                placeholder={t('Select Users')}
                                                                isMArray={true}
                                                                checkbox={true}
                                                                selectall={false}
                                                                keyValue="value"
                                                                // selectAllText={t('All Users')}
                                                                options={props.UserOption ? props.UserOption : []}
                                                                keyId="id"
                                                                label="Recipients"
                                                                value={x.UserList || []}
                                                                onChange={(selectedValues) => {

                                                                    handlOfflineChange(selectedValues, 'UserList', index);
                                                                }}
                                                            />
                                                        </Grid>

                                                        {addRows.length > 1 &&
                                                            <Grid item xs={2} style={{ marginTop: "16px", marginLeft: "auto" }}>
                                                                <Button type="ghost" icon={Delete} danger onClick={() => handleRowDelete(index)} />
                                                            </Grid>
                                                        }

                                                    </Grid>
                                                ))}

                                                <div style={{ width: "100%", display: "flex", justifyContent: "end", marginTop: 10 }}>
                                                    <Button type="tertiary" icon={Plus} value="Add Escalation" disabled={addRows.length >= 3} onClick={handleAddRow} />
                                                </div>
                                            </Grid>
                                        )
                                    }



                                    {!isOffline && (

                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                                            <div className="flex flex-col gap-0.5">
                                                <TypographyNDL variant="lable-02-s">{"Data Forecast"}</TypographyNDL>
                                                <TypographyNDL color='tertiary' variant="paragraph-xs">{'Enabling this will allow you to configure forecasting for instrument metric data'}</TypographyNDL>
                                            </div>
                                            <CustomSwitch
                                                id={"switch"}
                                                onChange={handleForecastAnalytics}
                                                checked={isForeCast}
                                                switch={true}
                                                size="small"
                                            />


                                        </div>
                                    )}
                                    {!isOffline && isForeCast && (

                                        <div className="w-[50%]" style={{ marginBottom: 12, marginTop: '12px' }}>
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
                                    <div className='mt-4' />
                                    <HorizontalLineNDL variant='divider1' />
                                    <div className='mt-4' />
                                    {
                                        categoryID !== 6 &&
                                        <div className="my-3 flex justify-between items-center">
                                            <div className="flex flex-col gap-0.5">
                                                <TypographyNDL value='Multiplication Factor' variant='label-02-s' />
                                                <TypographyNDL value='Enabling this will measure grinding analytics of your machine' color='tertiary' variant="paragraph-xs" />
                                            </div>
                                            <CustomSwitch
                                                switch={true}
                                                checked={isScalingFactors}
                                                onChange={handleScalingFactors}
                                                size="small"

                                            />
                                        </div>
                                    }
                                    {
                                        isScalingFactors && (
                                            <div>
                                                <Grid item xs={12}>
                                                    {MetricFields.map((val, i) => {
                                                            // eslint-disable-next-line react-hooks/exhaustive-deps

                                                        return (
                                                            <Grid container spacing={4} style={{ marginBottom: "12px" }}>
                                                                <Grid item xs={5} >
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
                                                                <Grid item xs={3} >
                                                                    <InputFieldNDL
                                                                        id="MultiplicationValueId"
                                                                        label={t("MultiplicationValue")}
                                                                        placeholder={t("Type value")}
                                                                        type="number"
                                                                     
                                                                        inputRef={FactorRef}
                                                                        value={val.mFactor}
                                                                        arrow
                                                                        NoMinus
                                                                        dynamic={MetricFields}
                                                                        onChange={(e) => handleFactor(e, val.field)}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={3}>
                                                                    <InputFieldNDL
                                                                        id="CalibrationValueId"
                                                                        label={t("CalibrationValue")}
                                                                        placeholder={t('Type value')}
                                                                        type="number"
                                                                        arrow
                                                                        NoMinus
                                                                        
                                                                        inputRef={CalibrateRef}
                                                                        value={val.calibrationValue}
                                                                        dynamic={MetricFields}
                                                                        onChange={(e) => handleCalibrate(e, val.field)}
                                                                    />
                                                                </Grid>
                                                                {
                                                                    MetricFields.length !== 1 &&
                                                                    <Grid item xs={1} style={{ marginTop: "16px" }}>

                                                                        <Button type="ghost" icon={Delete} danger onClick={() => removeMetric(val.field)} />

                                                                    </Grid>
                                                                }




                                                            </Grid>)
                                                    }
                                                    )}

                                                    <TypographyNDL color='danger' variant='paragraph-s' >{t("Note: Metrics that have been configured here will keep the assigned scaling factors, remaining metrics will be set to 1 and 0 for multiplication and calibration, respectively.")} </TypographyNDL>
                                                    <Grid container>

                                                        <Grid item xs={12} align={'right'}>
                                                            <div className="flex justify-end">
                                                                <Button type="tertiary" value={t('Add Metric')} icon={Plus} onClick={() => AddScalingFactorMetric()} />
                                                            </div>
                                                        </Grid>
                                                    </Grid>

                                                </Grid>
                                                <div className='mt-4' />
                                                <HorizontalLineNDL variant='divider1' />
                                                <div className='mt-4' />
                                            </div>
                                        )
                                    }


                                </React.Fragment>
                            }
                        </div>

                    </Grid>
                    <Grid item xs={2}>

                    </Grid>
                </Grid>
            </div>


            <AddMetric
                typeID={typeID}
                getMetricList={props.getMetricList}
                MetricDialog={MetricDialog}
                setMetricDialog={(val) => setMetricDialog(val)}
                setInstrumentIdErr={(val) => setInstrumentIdErr(val)}

            />

            <ModalNDL onClose={handleDialogClose} maxWidth={"md"} aria-labelledby="entity-dialog-title" open={OpenModel}>
                <ModalHeaderNDL>
                    <TypographyNDL id="entity-dialog-title" variant="heading-02-xs" model value={t("Confirmation Required")} />
                </ModalHeaderNDL>
                <ModalContentNDL>
                    <TypographyNDL variant='paragraph-s' color='secondary' value={"Do you really want to disable the notifications and escalations for this instrument? This action cannot be undone."} />
                </ModalContentNDL>
                <ModalFooterNDL>
                    <Button value={t('Cancel')} type="secondary" onClick={() => { handleDialogClose() }} />
                    <Button value={t('Continue')} type="primary" onClick={handleModalConfirm} />

                </ModalFooterNDL>
            </ModalNDL>

        </React.Fragment>
    )
});
export default AddInstrument;
