import React, { useState,useEffect} from "react";
import Grid from "components/Core/GridNDL";
import KpiCards from "components/Core/KPICards/KpiCardsNDL";
import Typography from "components/Core/Typography/TypographyNDL";
import Tag from "components/Core/Tags/TagNDL";
import { useTranslation } from "react-i18next";
import ComponentCardBottom from "./ComponentCardBottom";
import ThreeDotMenu from 'assets/neo_icons/FaultAnalysis/DotsThreeVertical.svg?react';
import Button from 'components/Core/ButtonNDL';
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx'; 
import moment from 'moment';
import useGetDefectDetails from "../hooks/useGetDefectDetails.jsx"
import useGetAlarmAggregation from "../hooks/useGetAlarmAggregation.jsx"
import Datacapsule from "components/Core/Data Capsule/DatacapsuleNDL";
import Tags from 'assets/neo_icons/Menu/Tag.svg?react';
import StatusNDL from 'components/Core/Status/StatusNDL' 
// NOSONAR
export default function MetricCard(props) {
     
    
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [AnchorPos, setAnchorPos] = useState(null);
    const [alarmAggregation,setAlarmAggregation] = useState(null);
    const { alarmDefectLoading, alarmDefectData, alarmDefectError, getAlarmDefects } = useGetDefectDetails();
    const { alarmAggregationLoading, alarmAggregationData, alarmAggregationError, getAlarmAggregation } = useGetAlarmAggregation();
    const [info, setInfo] = useState(props.info); 

    
    const handleClick = (event) => {
        setOpen(!open)
        setAnchorPos(event.currentTarget)
        event.stopPropagation()
    };

    useEffect(() => {
        setInfo(props.info);
    }, [props.info]);

    useEffect(()=>{
        getAlarmAggregation(props.info.alert_id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.info.alert_id])

    useEffect(()=>{
        if(!alarmAggregationLoading && alarmAggregationData && !alarmAggregationError){
            setAlarmAggregation(alarmAggregationData)
        }
    },[alarmAggregationLoading, alarmAggregationData, alarmAggregationError])

    useEffect(() => {
        if (!alarmDefectLoading && alarmDefectData && !alarmDefectError) {
            setInfo(prevInfo => ({
                ...prevInfo,
                defect_name: alarmDefectData.defect_name,
                recommendation: alarmDefectData.fault_action_recommendeds && alarmDefectData.fault_action_recommendeds.length > 0
                    ? alarmDefectData.fault_action_recommendeds[0].action_recommended
                    : ''
            }));
        }
    }, [alarmDefectLoading, alarmDefectData, alarmDefectError]);

    useEffect(() => {
        if (info && !info.defect_name) {
            if (info.alarmStatus === "warning" && info.metricName && info.metricName.toLowerCase().includes("acc")) {
                setInfo(prevInfo => ({
                    ...prevInfo,
                    defect_name: "Insufficient Lubrication",
                    recommendation: "Inspect bearing for improper lubrication."
                }));
            } else if (info.alarmStatus === "warning" && info.metricName && (info.metricName.toLowerCase().includes("temp"))) {
                setInfo(prevInfo => ({
                    ...prevInfo,
                    defect_name: "Insufficient Lubrication",
                    recommendation: "Keep a watch on the bearing temperature and inspect lubricant condition."
                }));
            } else if (info.alarmStatus === "critical" && info.metricName && info.metricName.toLowerCase().includes("acc")) {
                setInfo(prevInfo => ({
                    ...prevInfo,
                    defect_name: "Poor Lubrication",
                    recommendation: "Inspect Bearing for improper lubrication and monitor the bearing temperature."
                }));
            } else if(info.alarmStatus === "critical" && info.metricName && (info.metricName.toLowerCase().includes("temp"))) {
                setInfo(prevInfo => ({
                    ...prevInfo,
                    defect_name: "Poor Lubrication",
                    recommendation: "Inspect lubricant condition and top-up new grease."
                }));
            } else if(info.alarmStatus === "ok") {
                setInfo(prevInfo => ({
                    ...prevInfo,
                    defect_name: "NA"
                }));
            } else {
                setInfo(prevInfo => ({
                    ...prevInfo,
                    defect_name: "No Faults"
                }));
            }
        }
    }, [info]);   
// NOSONAR
    useEffect(() => {
        if (props.faultInfoData && info && info.instrument_id && info.metricKey) {
            const match = info.metricKey.match(/_([a-z]*)_lh/);
            const searchKey = match && match.length > 0 ? match[1].toUpperCase() : null;
            
            if (searchKey) {
                const faultInfoData = props.faultInfoData;
                const filteredFaultInfoData = faultInfoData
                    .filter(x => info.instrument_id === x.iid)
                    .filter(data => data.key.includes(searchKey));
                    
                if (filteredFaultInfoData.length > 0) {
                    const targetTime = moment(info.LastActiveAt, 'DD/MM/YYYY HH:mm:ss A').toDate().getTime();
                    let closestElement = filteredFaultInfoData[0];
                    let minTimeDiff = Math.abs(new Date(filteredFaultInfoData[0].time).getTime() - targetTime);
        
                    filteredFaultInfoData.forEach(element => {
                        const elementTime = new Date(element.time).getTime();
                        const timeDiff = Math.abs(elementTime - targetTime);
        
                        if (timeDiff < minTimeDiff) {
                            closestElement = element;
                            minTimeDiff = timeDiff;
                        }
                    });
        
                    if (closestElement.defect) {
                        setInfo(prevInfo => ({ ...prevInfo, defect: closestElement.defect }));
                        getAlarmDefects(closestElement.defect ? closestElement.defect : "");
                    }
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.info]);

    const handlebuttonclick = () => {
        props.menuItemClick(2, props.info);
      };    

    const handleThreeDotMenuClick = (value, data) => {
        console.log(value,data,"value,data")
        setOpen(false)
        setAnchorPos(null)
        props.menuItemClick(value, data)
    };

    const onClose = (event)=>{
        setOpen(false);
        setAnchorPos(null)
        event.stopPropagation();
    }
// NOSONAR
    const renderLimitValue =()=>{
        if( props.info.alarmType === 'inside_the_range' || props.info.alarmType === 'outside_the_range'){
    return `Min - ${props.info.alarmStatus === 'critical' ? props.info.config.critical_min_value : props.info.alarmStatus === 'warning' ? props.info.config.warn_min_value: props.info.minValue}` + ' | ' + `Max - ${props.info.alarmStatus === 'critical' ? props.info.config.critical_max_value : props.info.alarmStatus === 'warning' ? props.info.config.warn_max_value: props.info.maxValue}`
        }else if(props.info){
            if (props.info.alarmStatus === 'critical' && props.info.config && props.info.config.critical_value){
                return  props.info.config.critical_value
            }else if(props.info.alarmStatus === 'warning' && props.info.config && props.info.config.warn_value){
                return  props.info.config.warn_value
            }else if(props.info.alarmStatus === 'ok' && props.info.config){
                if(props && props.info && props.info.config && props.info.config.warn_type && props.info.config.warn_type === "above"){
                 return  props.info.config.warn_value
                }else{
                    return  props.info.config.critical_value
                }

            }else {
                return  props.info.alarmLimitValue ?  props.info.alarmLimitValue : "-"
            }

        }

    }
    return ( 
            <Grid item sm={12} lg={12} key={props.info.value_time}>

                <KpiCards>
                    <div>
                        {props.type !== 'downtime' &&
                        <div className="flex items-center justify-between">
                             <div className='flex gap-2'>
                             <svg width="6" height="42" viewBox="0 0 6 38" fill="none" xmlns="
                                     http://www.w3.org/2000/svg">
                                        <path d="M3.00012 3L3.00012 35" stroke={(props.info.alarmStatus === "critical" || props.info.alarmStatus === "inactive") ? "#ce2c31" : (props.info.alarmStatus === "warning" ? "#ef5f00" : ((props.info.alarmStatus === "ok" || props.info.alarmStatus === "active") ? "#30A46c" : ""))} stroke-width="5" stroke-linecap="round" />
                                    </svg>
                                    <div className='flex flex-col gap-0.5 mt-1'>
                            <Typography  variant="label-02-s" color={"primary"} value={ props.type === 'tool' ? "Tool Alarm": props.info.alarmName } />

                            <Typography  variant="paragraph-xs"  color={"secondary"} mono value={moment(props.type === 'connectivity' ?  props.info.alarmTriggeredTime:props && props.info && props.info.config && props.info.config.last_check_value_time).format('DD/MM/YYYY HH:mm:ss a')} />
                            </div>
                            </div>
                           
                            <div className="flex items-center gap-2">
                            <div className="whitespace-normal">
                                    <div className="flex items-center   gap-2">
                                        {props.threeDotMenuOption && props.threeDotMenuOption.length > 0 &&
                                        <React.Fragment>
                                         {((props.info.virtualInstrumentId === null || props.info.virtualInstrumentId === "") && props.info.alarmStatus !== "ok" && props.type !== 'tool') && (
                                        <div>
                                        {props.info.acknowledgeID !== null ?
                                       <Button type="ghost" disabled={true} value={t("Acknowledge")}  
                                     ></Button> :
                                        <Button type="ghost" disabled={false} value={t("Acknowledge")}  onClick={(e) => {
                                            e.stopPropagation();
                                            handlebuttonclick();
                                          }}></Button>
                                        }
                                          </div>
                                    )}
                                        </React.Fragment>
                                    }
                                    </div>
                                  
                                </div>
                                <StatusNDL lessHeight style={{ color: "#FFFFFF", backgroundColor: props.info.alarmStatus ? ((props.info.alarmStatus === "critical" || props.info.alarmStatus === "inactive") ? "#ce2c31" : (props.info.alarmStatus === "warning" ? "#ef5f00" : ((props.info.alarmStatus === "ok" || props.info.alarmStatus === "active") ? "#30A46c" : ""))) : "",    textAlign: "-webkit-center" }} name={props.info.alarmStatus} />
                            {
                                props.threeDotMenuOption && props.threeDotMenuOption.length > 0 &&
                                <React.Fragment>
                                    <Button icon={ThreeDotMenu} type="ghost" onClick={handleClick}></Button>
                                    <ListNDL
                                        options={props.threeDotMenuOption}
                                        Open={open}
                                        optionChange={(value) => handleThreeDotMenuClick(value, props.info)}
                                        keyValue={"name"}
                                        keyId={"id"}
                                        id={"popper-alert-card"}
                                        onclose={(e) => onClose(e)}
                                        anchorEl={AnchorPos}
                                        width="150px"
                                    />
                                </React.Fragment>

                            }
                            </div>
                        </div>}

                        {props.type === 'downtime' &&
                            <div className="flex items-center justify-between">
                             <div className='flex gap-2'>
                             <svg width="6" height="42" viewBox="0 0 6 38" fill="none" xmlns="
                                     http://www.w3.org/2000/svg">
                                        <path d="M3.00012 3L3.00012 35" stroke={(props.info.alarmStatus === "critical" || props.info.alarmStatus === "inactive") ? "#ce2c31" : (props.info.alarmStatus === "warning" ? "#ef5f00" : ((props.info.alarmStatus === "ok" || props.info.alarmStatus === "active") ? "#30A46c" : ""))} stroke-width="5" stroke-linecap="round" />
                                    </svg>
                                    <div className='flex flex-col gap-0.5 mt-1'>
                            <Typography  variant="label-02-s" color={"primary"} value={"Downtime Alarm"} />
                            <Typography  variant="paragraph-xs"  color={"secondary"} mono value={moment(props && props.info && props.info.config && props.info.config.last_check_value_time).format('DD/MM/YYYY HH:mm:ss a')} />
                            </div>
                            </div>
                            <div className="flex items-center  gap-2">
                                <Tag lessHeight style={{ color: "#FFFFFF", backgroundColor: props.info.alarmStatus ? ((props.info.alarmStatus === "critical" || props.info.alarmStatus === "inactive") ? "#ce2c31" : (props.info.alarmStatus === "warning" ? "#ef5f00" : ((props.info.alarmStatus === "ok" || props.info.alarmStatus === "active") ? "#30A46c" : ""))) : "", textAlign: "-webkit-center" }} name={props.info.alarmStatus} />
                            {
                                props.threeDotMenuOption && props.threeDotMenuOption.length > 0 &&
                                <React.Fragment>
                                    <Button icon={ThreeDotMenu} type="ghost" onClick={handleClick}></Button>
                                    <ListNDL
                                        options={props.threeDotMenuOption}
                                        Open={open}
                                        optionChange={(value) => handleThreeDotMenuClick(value, props.info)}
                                        keyValue={"name"}
                                        keyId={"id"}
                                        id={"popper-alert-card"}
                                        onclose={(e) => onClose(e)}
                                        anchorEl={AnchorPos}
                                        width="140px"
                                    />
                                </React.Fragment>

                            }
                            </div>
                            </div>
                            }
                      
                    {
                        (!props.info.connectivity_id && props.type !== 'downtime') &&
                        <React.Fragment>
                         
                            <div className="flex mt-2">
                            <Datacapsule icon={Tags} small name={"Event Value"} value={parseFloat(props.info.alarmValue).toFixed(2)} colorbg={(props.info.alarmStatus === "critical" || props.info.alarmStatus === "inactive") ? "red" : (props.info.alarmStatus === "warning" ? "orange" : ((props.info.alarmStatus === "ok" || props.info.alarmStatus === "active") ? "green" : ""))}/>
                            <div className="ml-5">
                            <Datacapsule icon={Tags} small name={"Limit value"} value={ renderLimitValue()} colorbg={"silver"}/>
                            </div>
                            <div className="ml-5">
                           <Datacapsule icon={Tags} small name={"Limit Rule"} value={ props.info.alarmType && props.info.alarmType.length > 0 
                                            ? props.info.alarmType 
                                            : props && props.info && props.info.config && props.info.config.warn_type && props.info.config.warn_type === "above" 
                                                ? "below" 
                                                : props && props.info && props.info.config && props.info.config.warn_type && props.info.config.warn_type === "below" && "above"} colorbg={"silver"}/>
                           </div>
                           

                            <div className="flex items-baseline  gap-2 py-2">
                         
                            </div>
                            </div>
                         
                        </React.Fragment>
                    }
                        {props.type !== 'tool' &&
                        <div className="flex items-center justify-between">
                            <div className="flex items-baseline  gap-2 mt-2" >
                              
                            </div>
                            
                        </div>}
                        {props.type !== 'downtime' && props.type !== 'tool' &&
                        <div className="flex items-baseline  gap-2 " >
                            <div className="flex-shrink-0 w-[150px]">
                                <Typography className="whitespace-nowrap" variant="paragraph-xs" color={'secondary'} value={t("Analyst Remark")} />
                            </div>
                            <div className="font-geist-sans text-[16px] font-normal text-Text-text-secondary dark:text-Text-text-secondary-dark">-</div>

                            <div className="whitespace-normal">
                                <Typography variant="paragraph-xs" color={"secondary"} value={props.info.acknowledgeName} />
                            </div>
                        </div>}
                        {props.type !== 'downtime' && !props.info.connectivity_id && 
                            props.faultInfoData.some(fault => fault.iid === props.info.instrument_id) &&
                            <div className="flex items-baseline gap-2 ">
                                <div className="flex-shrink-0 w-[150px]">
                                    <Typography className="whitespace-nowrap" variant="paragraph-xs" color={"secondary"}  value={t("Fault Mode")} />
                                </div>
                                <div className="font-geist-sans text-[16px] font-normal text-Text-text-secondary dark:text-Text-text-secondary-dark">:</div>
                                <div className="whitespace-normal">
                                    <Typography variant="paragraph-xs" color={"secondary"} value={info.defect_name ? info.defect_name : "-"} />
                                </div>
                            </div>
                        }
                        {props.type !== 'downtime' && !props.info.connectivity_id && 
                         props.faultInfoData.some(fault => fault.iid === props.info.instrument_id) &&
                        <div className="flex items-baseline  gap-2 " >
                            <div className="flex-shrink-0 w-[150px]">
                                <Typography className="whitespace-nowrap" variant="paragraph-xs" color={"secondary"} value={t("Recommendation")} />
                            </div>
                            <div className="font-geist-sans text-[16px] font-normal text-Text-text-secondary dark:text-Text-text-secondary-dark">:</div>

                            <div className="whitespace-normal">
                                <Typography variant="paragraph-xs" color={"secondary"} value={info.recommendation? info.recommendation : "-"} />
                            </div>
                        </div>}
                      
                        {alarmAggregation === "na" && (
                        <div className="flex items-baseline  gap-2 py-2">
                        <div className="flex-shrink-0 w-[150px]">
                                <Typography className="whitespace-nowrap" variant="paragraph-xs" color={"secondary"} value={t("Check time")} />
                            </div>
                            <div className="font-geist-sans text-[16px] font-normal text-Text-text-secondary dark:text-Text-text-secondary-dark" >:</div>
                            <div className="whitespace-normal">
                            <Typography variant="paragraph-xs" mono color={"secondary"} value={moment(props.info.alarmTriggeredTime).format('DD/MM/YYYY HH:mm:ss a')} />
                            </div>
                        </div>
                        )}
                    </div>
                    <div className="mt-2">
                    <ComponentCardBottom info={props.info} 
                    entityName={props.entityName} 
                    instrumentName={props.instrumentName}
                    type={props.type}
                    />
                    </div>
                   
                </KpiCards>

            </Grid>

    )



}




