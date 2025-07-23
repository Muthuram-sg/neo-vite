import React, { useState, useEffect } from 'react';
import Card from "components/Core/KPICards/KpiCardsNDL";
import Typography from "components/Core/Typography/TypographyNDL";
import moment from 'moment';
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import ThreeDotMenu from 'assets/neo_icons/FaultAnalysis/DotsThreeVertical.svg?react';
import Button from 'components/Core/ButtonNDL';
import commonfaultanalysis from './common';
import ComponentCardBottom from './ComponentCardBottom';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from "recoil";
import { instrumentsList,themeMode } from "recoilStore/atoms";
import StatusNDL from 'components/Core/Status/StatusNDL'
import Plus from 'assets/plus.svg?react';
import Trend from 'assets/trend.svg?react';
import FFT from 'assets/fft.svg?react';


function ComponentCard(props) {
    const [open, setOpen] = useState(false);
    const [AnchorPos, setAnchorPos] = useState(null);
    const [selectedinstrument, setselectedinstrument] = useState({});
    const { t } = useTranslation();
    const [instrumentList] = useRecoilState(instrumentsList);
    const [filtereddata, setfiltereddata] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [loadingTimeout, setLoadingTimeout] = useState(null);
    const [remarkValue, setremarkValue] = useState('');
    const [popperOption, setPopperOption] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
      const [currTheme] = useRecoilState(themeMode);
    

    useEffect(() => {
        setPopperOption([
            { id: 1, name: <div style={{ display: "flex", alignItems: "center" }}>
            <FFT stroke={currTheme ==='dark' ? "#FFFFFF" :"#202020"} style={{ width: 16, height: 16 , marginRight: "8px" }} />
            <Typography value={t("View FFT")} />
        </div> },
            { id: 3, name: <div style={{ display: "flex", alignItems: "center" }}>
            <Trend stroke={currTheme ==='dark' ? "#FFFFFF" :"#202020"}  style={{ width: 16, height: 16 , marginRight: "8px" }} />
            <Typography value={t("View Trend")} />
        </div> },
            {
                id: 4, name:
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Plus stroke={"#0090ff"} style={{ width: 16, height: 16, marginRight: "8px" }} />
                        <Typography style={{ color: "#0090ff" }} value={t("Create Task")} />
                    </div>
            }
        ]);
    }, [remarkValue, t,currTheme]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setInitialLoading(false);
        }, 6000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const remarksValue = getRemarks(props.type);
        setremarkValue(remarksValue);
    }, [props.type]);

    const handleClick = (e, type) => {
        e.stopPropagation();
        setOpen(!open);
        let fault = getFaultType(type, props.instrument.latest_fault_data, props.fault, props.axisfault); //NOSONAR
        setselectedinstrument(fault);
        setAnchorPos(e.currentTarget);
    };

    const getFaultType = (axis) => {
        let faultRes;
            faultRes = axis;
        return faultRes;
    };

    useEffect(() => {
        const hasData = filtereddata.some(item => item && item.data && item.data.length > 0);

        if (filtereddata && filtereddata.length > 0 && hasData) {
            setisLoading(false);
            props.disableTrendIcon(false)
        }
    }, [filtereddata]);

    useEffect(() => {
        if (isLoading) {
            const timeout = setTimeout(() => {
                setisLoading(false);
                props.disableTrendIcon(false)
                clearTimeout(timeout);
            }, 4000);
            setLoadingTimeout(timeout);
        } else {
            clearTimeout(loadingTimeout);
        }
    }, [isLoading]);


    useEffect(() => { //NOSONAR
        if (props.metricData && props.instrument && props.instrument.latest_fault_data) {
            props.disableTrendIcon(true)
            setisLoading(true);
            let instrument_metrics_array = [];
            let instrument_metrics_index = instrumentList.findIndex(i => i.id === props.instrument.latest_fault_data.iid);

            let temp_instrument_metrics_array = instrument_metrics_index !== -1 ? instrumentList[instrument_metrics_index]?.instruments_metrics?.map(m => m.metric) : [];
            if (props.type === 1) {
                let filtereddata = props.metricData.filter(m =>
                    new Date(new Date(props.instrument.latest_fault_data.time).getTime()- 30000) <= new Date(m.time) && 
                    new Date(m.time) <= new Date(new Date(props.instrument.latest_fault_data.time).getTime()+ 30000) &&
                    m.iid === props.instrument.latest_fault_data.iid &&
                    temp_instrument_metrics_array.some(tm =>
                        m.key === tm.name &&
                        tm.props && tm.props.axis.toLowerCase() === props.instrument.latest_fault_data.key.toLowerCase()
                    )
                );

                let titleArray = temp_instrument_metrics_array.filter(x => x.props && x.props.axis.toLowerCase() === props.instrument.latest_fault_data.key.toLowerCase());

                let title = "";
                if (titleArray.length === 1) {
                    title = titleArray[0].title;
                } else if (titleArray.length > 1) {
                    const velTitle = titleArray.find(x => x.title.toLowerCase().includes("vel"));
                    title = velTitle ? velTitle.title : titleArray[0].title;
                }

                instrument_metrics_array.push({
                    "title": title,
                    "data": filtereddata.map(item => ({
                        "time": item.time,
                        "iid": item.iid,
                        "value": item.value,
                        "key": item.key
                    }))
                });
                setfiltereddata(instrument_metrics_array);
            } else if (props.type === 2 && props.instrument.faults) {
                const selectTitle = (titles) => {
                    if (titles.length === 1) {
                        return titles[0].title;
                    } else if (titles.length > 1) {
                        const velTitle = titles.find(t => t.title.toLowerCase().includes("vel"));
                        return velTitle ? velTitle.title : titles[0].title;
                    }
                    return "";
                };
                props.instrument.faults.forEach(fault => {
                    let filtereddata = props.metricData.filter(m =>
                        new Date(new Date(fault.time).getTime()- 30000) <= new Date(m.time) && 
                        new Date(m.time) <= new Date(new Date(fault.time).getTime()+ 30000) &&
                        m.iid === fault.iid &&
                        temp_instrument_metrics_array.some(tm =>
                            m.key === tm.name &&
                            tm.props && tm.props.axis.toLowerCase() === fault.key.toLowerCase()
                        )
                    );

                    const titleCandidates = temp_instrument_metrics_array.filter(x => x.props && x.props.axis.toLowerCase() === fault.key.toLowerCase());
                    const selectedTitle = selectTitle(titleCandidates);

                    instrument_metrics_array.push({
                        "title": selectedTitle,
                        "data": filtereddata.map(item => ({
                            "time": item.time,
                            "iid": item.iid,
                            "value": item.value,
                            "key": item.key
                        }))
                    });
                });

                setfiltereddata(instrument_metrics_array);
            } else if (props.type === 3 && props.axisfault) {
                let filtereddata = props.metricData.filter(m =>
                    new Date(new Date(props.axisfault.time).getTime()- 30000) <= new Date(m.time) && 
                    new Date(m.time) <= new Date(new Date(props.axisfault.time).getTime()+ 30000) &&
                    m.iid === props.axisfault.iid &&
                    temp_instrument_metrics_array.some(tm =>
                        m.key === tm.name &&
                        tm.props && tm.props.axis.toLowerCase() === props.axisfault.key.toLowerCase()
                    )
                );

                const matchingTitles = temp_instrument_metrics_array.filter(x =>
                    x.props && x.props.axis.toLowerCase() === props.axisfault.key.toLowerCase()
                );
                  
                let titleToDisplay = "";

                if (matchingTitles.length === 1) {
                    titleToDisplay = matchingTitles[0].title;
                } else {
                    const velTitle = matchingTitles.find(title => title.title.toLowerCase().includes("vel"));
                    titleToDisplay = velTitle ? velTitle.title : matchingTitles && matchingTitles.length > 0 && matchingTitles[0].title;
                }

                instrument_metrics_array.push({
                    "title": titleToDisplay,
                    "data": filtereddata.map(item => ({
                        "time": item.time,
                        "iid": item.iid,
                        "value": item.value,
                        "key": item.key
                    }))
                });

                setfiltereddata(instrument_metrics_array);
            }
        }
    }, [props.metricData]);

    const onClose = () => {
        setOpen(false);
        setAnchorPos(null);
    };

    const menuItemClick = (value, selectedInstrument) => {
        props.menuItemClick(value, props.axisfault, props.instrument.instrument_name, getAsset(props.type), Array.isArray(props.bulkdata) && props.bulkdata.length > 0 ? props.bulkdata : [], props.axisfault && props.axisfault.severity_name ? props.axisfault.severity_name : '');
        onClose();
    };

    const getSeverity = (type) => {
        return getFaultType(props.axisfault && props.axisfault.severity);
    };

    const getDefectName = (type) => {
        return getFaultType(props.axisfault && props.axisfault.defect_name);
    };

    const getActionRecommended = (type) => {
        return getFaultType(props.axisfault && props.axisfault.action_recommended);
    };

    const getActionObservation = (type) => {
        return getFaultType(props.axisfault && props.axisfault.observation);
    };

    const getRemarks = (type) => {
        return getFaultType(props.axisfault && props.axisfault.remarks);
    };

    const getTime = (type) => {
        return getFaultType(props.axisfault && props.axisfault.time);
    };

   

    const getFault = (type) => {
        if (type === 1) {
            return "";
        } else if (type === 2) {
            return props.fault;
        } else {
            return props.axisfault;
        }
    };

    const getAsset = (type) => {
        return (type === 3 ? props.asset.entity_name : props.asset);
    };

    const actionRecommendedValue = getActionRecommended(props.type);
    const actionRecommendedDisplay = actionRecommendedValue ? actionRecommendedValue : "";
    const actionObservedValue = getActionObservation(props.type);
    const actionObservedDisplay = actionObservedValue ? actionObservedValue : "";

    return (
        <React.Fragment>
            <React.Fragment>
                <ListNDL
                    options={popperOption}
                    Open={open}
                    optionChange={(value) => menuItemClick(value, selectedinstrument)}
                    keyValue={"name"}
                    keyId={"id"}
                    id={"popper-fault-card"}
                    onclose={() => onClose()}
                    anchorEl={AnchorPos}
                    width="180px"
                />

                <Card
                    elevation={0}
                    style={{ cursor: 'pointer' }}
                    >
                    {props.instrument && props.instrument.faults && props.instrument.faults.length > 0 ?
                        <div className='pb-2'>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>


                                <div className='flex gap-2'>
                                    <svg width="6" height="42" viewBox="0 0 6 38" fill="none" xmlns="
                                     http://www.w3.org/2000/svg">
                                        <path d="M3.00012 3L3.00012 35" stroke={commonfaultanalysis.getTagprops(Number(getSeverity(props.type)))[3]} stroke-width="5" stroke-linecap="round" />
                                    </svg>
                                    <div className='flex flex-col gap-0.5 mt-1'>
                                        <Typography variant="label-02-s" color={"primary"} value={commonfaultanalysis.capitalizeFLetter(getDefectName(props.type))} />
                                        <Typography variant="paragraph-xs" mono color={"secondary"} value={moment(getTime(props.type)).format("DD/MM/YYYY hh:mm:ss A")} />
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                <StatusNDL lessHeight colorbg={commonfaultanalysis.getTagprops(Number(getSeverity(props.type)))[1]} name={commonfaultanalysis.getTagprops(Number(getSeverity(props.type)))[0] === "No Faults" ? "Normal" : commonfaultanalysis.getTagprops(Number(getSeverity(props.type)))[0]} />
                                    <Button icon={ThreeDotMenu} disabled={isLoading || initialLoading} type="ghost" onClick={(e) => handleClick(e, props.type)} />
                                </div>
                            </div>

                            <React.Fragment>
                                <div style={{ display: "block" }} >
                                    <div className="flex items-baseline  gap-1 mt-1" >
                                        <div className="flex-shrink-0 w-[150px]">
                                            <Typography variant="paragraph-xs" color={"secondary"} value={t("Observations ")} />
                                        </div>
                                        <div className="font-geist-sans text-[16px] font-normal text-Text-text-secondary dark:text-Text-text-secondary-dark">-</div>
                                        <Typography variant="paragraph-xs" color={"secondary"} value={actionObservedDisplay} style={{ marginRight: 10, marginLeft: 10 }} />
                                    </div>
                                    <div className="flex items-baseline  gap-1 mt-1">
                                        <div className="flex-shrink-0 w-[150px]">
                                            <Typography variant="paragraph-xs" color={"secondary"} value={t("Recommendations ")} />
                                        </div>
                                        <div className="font-geist-sans text-[16px] font-normal text-Text-text-secondary dark:text-Text-text-secondary-dark">-</div>
                                        <Typography variant="paragraph-xs" color={"secondary"} value={actionRecommendedDisplay} style={{ marginRight: 10, marginLeft: 10 }} />
                                    </div>

                                  
                                </div>

                            </React.Fragment>
                        </div>
                        :
                        <Typography variant="heading-02-s" value={props.instrument && props.instrument.datapresent ? "No Faults" : "No Data"} style={{ margin: 10 }} />
                    }
                    <ComponentCardBottom 
                    fault={getFault(props.type)} 
                    filtereddata={filtereddata} 
                    loading={isLoading} 
                    instrument={props.instrument} 
                    asset={getAsset(props.type)} 
                    type={props.type} 
                    />
                </Card >
            </React.Fragment>
        </React.Fragment>
    );
}

export default ComponentCard;
