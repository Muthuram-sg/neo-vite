import React, {useState, forwardRef } from 'react';
import DeleteIcon from 'assets/neo_icons/Menu/ActionDelete.svg?react';
import Close_Menu from 'assets/neo_icons/Menu/Close_Menu.svg?react';
import Download from 'assets/neo_icons/Explore/DownloadBlue.svg?react'; 
import { useRecoilState } from "recoil";
import {exploreRange, customdates, TrendschartMode,GapMode,trendsMarkerMode,alertchartenable, NormalizeMode, labelInterval, themeMode, selectedInterval } from "recoilStore/atoms"
import Checkboxs from 'components/Core/CustomSwitch/CustomSwitchNDL'
import TypographyNDL from 'components/Core/Typography/TypographyNDL'
import Button from 'components/Core/ButtonNDL';
import ListNDL from 'components/Core/DropdownList/ListNDL.jsx';
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";

import Grid from 'components/Core/GridNDL'
import DatePickerNDL from "components/Core/DatepickerNDL";
import moment from 'moment';
import InputFieldNDL from 'components/Core/InputFieldNDL';
import Select from "components/Core/DropdownList/DropdownListNDL"
import ModalNDL from 'components/Core/ModalNDL';
import ModalHeaderNDL from 'components/Core/ModalNDL/ModalHeaderNDL';
import ModalContentNDL from 'components/Core/ModalNDL/ModalContentNDL';
import ModalFooterNDL from "components/Core/ModalNDL/ModalFooterNDL";
import { useTranslation } from 'react-i18next';
import Timer1S from 'assets/neo_icons/TimerIcon/Timer_1s.svg?react';
import Timer5S from 'assets/neo_icons/TimerIcon/Timer_5s.svg?react';
import Timer10S from 'assets/neo_icons/TimerIcon/Timer_10s.svg?react';
import Timer1M from 'assets/neo_icons/TimerIcon/Timer_1m.svg?react';
import Timer2M from 'assets/neo_icons/TimerIcon/Timer_2m.svg?react';
import Timer5M from 'assets/neo_icons/TimerIcon/Timer_5m.svg?react';
import Timer10M from 'assets/neo_icons/TimerIcon/Timer_10m.svg?react';
import Timer15M from 'assets/neo_icons/TimerIcon/Timer_15m.svg?react';
import Timer30M from 'assets/neo_icons/TimerIcon/Timer_30m.svg?react';
import Timer30S from 'assets/neo_icons/TimerIcon/Timer_30s.svg?react';
import Timer60M from 'assets/neo_icons/TimerIcon/Timer_60m.svg?react';

const LegendsTopBar = forwardRef((props, ref) => {
    const [, setcharttype] = useRecoilState(TrendschartMode)
    const [, setMarkerMode] = useRecoilState(trendsMarkerMode)
    const [, setgapstatus] = useRecoilState(GapMode);
    const [, setNormalizeMode] = useRecoilState(NormalizeMode);
    const [, setSelectedInterval] = useRecoilState(selectedInterval);
    const [rangeSelected] = useRecoilState(exploreRange);
    const [alertconfig]= useRecoilState(alertchartenable);
    const [customdatesval, setCustomdatesval] = useRecoilState(customdates);
    const [ frmDate, setfrmDate]  = useState(customdatesval.StartDate);
    const [ toDate, settoDate]  = useState(customdatesval.EndDate);
    const [, setintervalLabel] = useRecoilState(labelInterval)
    const { t } = useTranslation();

    let menuOption=[]
  
    const [openmenu,setopenmenu] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuOptions,setmenuOptions]=useState(menuOption)
    const [modalOpen, setModalOpen] = useState(false);
    const [allmetric, setAllMetric] = useState(false)
    const [CurTheme]=useRecoilState(themeMode)
    const handleClose = () => {
        setopenmenu(false)
        setAnchorEl(null);
    };
   
    function optionChange(e){
        if(e === "Download"){
            props.handleDownloadTrendData()
            handleClose()
        }
      }

      const handleInterval = (e, metric) => {
        props.handleInterval(e, metric)
        setSelectedInterval(e.target.value)
        localStorage.setItem('intervalOnlineTrends', e.target.value);
    }

      const intervalOption = [
        { id: "0.0167", value: "1 sec", icon: Timer1S, stroke: "#262626" },
        { id: "0.083", value: "5 sec", icon: Timer5S, stroke: "#262626" },
        { id: "0.167", value: "10 sec", icon: Timer10S, stroke: "#262626" },
        { id: "0.5", value: "30 sec", icon: Timer30S, stroke: "#262626" },
        { id: "1", value: "1 min", icon: Timer1M, stroke: "#262626" },
        { id: "2", value: "2 min", icon: Timer2M, stroke: "#262626" },
        { id: "5", value: "5 min", icon: Timer5M, stroke: "#262626" },
        { id: "10", value: "10 min", icon: Timer10M, stroke: "#262626" },
        { id: "15", value: "15 min", icon: Timer15M, stroke: "#262626" },
        { id: "30", value: "30 min", icon: Timer30M, stroke: "#262626" },
        { id: "60", value: "60 min", icon: Timer60M, stroke: "#262626" },
    ]

      function convertMinutesToTime(minutes) {

        let Intminutes = Number(minutes)

        if (Intminutes >= 60) {
            const hours = Intminutes / 60
            setintervalLabel(hours.toFixed(2) + " " + "hr(s)")
            return hours.toFixed(2) + " " + "hr(s)"


        } else if (Intminutes < 60) {
            setintervalLabel(Intminutes + " " + "Minutes")
            return Intminutes.toFixed(2) + " " + "Minutes"


        }

    }


      function toggleChange(e,opt){
        let menu = opt.map(f=> {
            if(f.id === e.id){
                if(e.id === 'chart'){
                    setcharttype(!e.checked)
                    return {...f,checked: !e.checked}
                }
                else if(e.id ==='gap'){
                    setgapstatus(!e.checked)
                    return {...f,checked: !e.checked}
                }else if(e.id === 'marker'){
                    setMarkerMode(!e.checked)
                    return {...f,checked: !e.checked}
                }
                else if(e.id === 'normalize'){
                    setNormalizeMode(!e.checked)
                    return {...f,checked: !e.checked}
                }
                
            }else{
                return f;
            }
        })
        setmenuOptions(menu)
        
      }

    return (
        <div>
                    <React.Fragment>
                        <div className='flex justify-between p-2'>
                            <div className='flex gap-1 items-center'>
                            { !props.selectedMetric[0].hierarchy.includes("All Metrics Group")  &&  <Checkboxs checked={props.allChecked} disabled={alertconfig} onChange={(e) => props.handleCheckAll(e)} />}
                            <TypographyNDL variant={!props.selectedMetric[0].hierarchy.includes("All Metrics Group") ? props.selectedMetric.filter(x=>x.checked === true).length > 0 ? "label-01-s" : "heading-02-xs" : "heading-02-xs"} color="primary" value={!props.selectedMetric[0].hierarchy.includes("All Metrics Group") ? props.selectedMetric.filter(x=>x.checked === true).length > 0 ? props.selectedMetric.filter(x=>x.checked === true).length + " " + "Items Selected" : 'Legends' : 'Legends'}  />
                            </div>
                            <div className='flex'>
                                
                                
                                { props.selectedMetric && props?.selectedMetric?.filter(x=>x.checked === true).length > 0  && <Button
                                value={'Remove'}
                                  type={"ghost"}
                                  danger
                                  onClick={() => {
                                    setAllMetric(false)
                                    setModalOpen(true)
                                  }}
                                />}
                                <Button icon={Download} type='ghost' onClick={() => props.handleDownloadTrendData()} />
                                <Button icon={Close_Menu} type='ghost' style={{color: CurTheme === 'dark' ? '#b4b4b4' : '#202020'}} onClick={() => props.CloseLegend(true)} />
                                   
                            </div>
               </div>
               <ListNDL 
                    options={menuOptions}  
                    Open={openmenu}  
                    optionChange={optionChange}
                    keyValue={"name"}
                    keyId={"id"}
                    id={"popper-Menu"}
                    onclose={handleClose}
                    anchorEl={anchorEl}
                    width="220px"
                    IconButton
                    isIconRight
                    toggleChange={toggleChange}
                />
                </React.Fragment>
                {props &&
                    props.selectedMetric &&
                    props.selectedMetric?.[0]?.hierarchy.includes("All Metrics Group") && (
                        <React.Fragment>
                        <HorizontalLine variant={"divider1"} />
                        <div className="flex justify-between items-center p-2">
                            {/* Left Section: Title */}
                            <>
                            <TypographyNDL variant="label-02-xs" style={{ color :CurTheme === 'dark' && '#eeeeee'}}>
                            {props.selectedMetric.length > 0 &&
                                props.selectedMetric[0] &&
                                props.selectedMetric[0].instrument_name}
                            </TypographyNDL>
                            </>

                            {/* Right Section: DatePicker and Select */}
                            <div className="flex items-center gap-4">
                            <Grid container spacing={2}>
                                <Grid item xs={9} sm={9}>
                                {!alertconfig ? (
                                    <DatePickerNDL
                                    id={`custom-range-Legends`}
                                    onChange={(dates, btnvalue) => {
                                        const [start, end] = dates;
                                        setCustomdatesval({
                                            StartDate: start, 
                                            EndDate: end
                                        })
                                        setfrmDate(start);
                                        settoDate(end);
                                        
                                    }}
                                    startDate={frmDate}
                                    endDate={toDate}

                                    maxDate={new Date()}
                                   setMax={true}
                                   disabled={true}
                                    dateFormat="dd/MM/yyyy HH:mm:ss"
                                   selectsRange={true}
                                   timeFormat="HH:mm:ss"
                                   customRange={true}
                                   defaultDate={rangeSelected}
                                    />
                                ) : (
                                    <InputFieldNDL
                                    id={`date-explore-legend`}
                                    value={
                                        moment(props.selectedMetric[0].frmDate).format(
                                        "DD-MM-YYYY HH:mm:ss"
                                        ) +
                                        "-" +
                                        moment(props.selectedMetric[0].toDate).format(
                                        "DD-MM-YYYY HH:mm:ss"
                                        )
                                    }
                                    disabled={true}
                                    />
                                )}
                                </Grid>
                                <Grid item xs={2} sm={2}>
                                {Number(props.selectedMetric[0].frequency) > 60 ? (
                                    <b
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        marginLeft: "10px",
                                    }}
                                    >
                                    {convertMinutesToTime(props.selectedMetric[0].frequency)}
                                    </b>
                                ) : (
                                    <Select
                                    id={`explore-interval`}
                                    options={intervalOption}
                                    isMArray={true}
                                    checkbox={false}
                                    onChange={(e) => handleInterval(e, props.selectedMetric[0])}
                                    keyValue="value"
                                    keyId="id"
                                    value={props.selectedMetric[0].interval}
                                    placeholder={t("Interval")}
                                    disabled={alertconfig}
                                    noSorting
                                    />
                                )}
                                </Grid>
                                <Grid item xs={1} sm={1}>
                                    <Button
                                      icon={DeleteIcon}
                                      type={"ghost"}
                                      danger
                                      onClick={() => {
                                        setAllMetric(true)
                                        setModalOpen(true)
                                      }}
                                    />
                                </Grid>
                            </Grid>
                            </div>
                        </div>
                        </React.Fragment>
                    )}
                    <ModalNDL open={modalOpen} width="30%" >
                        <ModalHeaderNDL >
                            <div className="flex flex-col items-start">
                                <TypographyNDL variant="heading-02-xs" value="Confirmation" />
                              
                            </div>
                        </ModalHeaderNDL>
        
                        <ModalContentNDL height >
                            <TypographyNDL variant="paragraph-s" value="Are you sure to remove this items ?" />
                        </ModalContentNDL>
        
                        <ModalFooterNDL>
                            <Button type='secondary' value={t("Cancel")} onClick={() => setModalOpen(false)} />
                            <Button type='primary' danger value={'Remove'} onClick={() => {props.removeAllLegend(allmetric ? 'all' : '');setModalOpen(false)}} />
                        </ModalFooterNDL>
                    </ModalNDL>
            </div>
    )
})
export default LegendsTopBar;