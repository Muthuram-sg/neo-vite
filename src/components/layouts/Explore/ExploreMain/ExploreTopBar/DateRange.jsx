import React, { useState, useEffect } from "react"; 
import DatePickerNDL from 'components/Core/DatepickerNDL';  
import { useRecoilState } from 'recoil';
import CustomSwitch from 'components/Core/CustomSwitch/CustomSwitchNDL';
import ContentSwitcherNDL from "components/Core/ContentSwitcher/ContentSwitcherNDL";
import {
    exploreRange,
    selectedInterval,
    exploreTabValue,
    labelInterval,
    pinSelected,
    themeMode,
    customdates,
    selectedPlant,
    exploreOptions,
    TrendschartMode,
    trendsMarkerMode,
    GapMode,
    NormalizeMode,
    showExploreDate
} from "recoilStore/atoms";
import useTheme from "TailwindTheme";
import { useTranslation } from 'react-i18next';
import Select from "components/Core/DropdownList/DropdownListNDL"
import Grid from "components/Core/GridNDL"; 


function DateRange() {
    const [headPlant] = useRecoilState(selectedPlant)
    const [rangeSelected, setRangeSelected] = useRecoilState(exploreRange);
    const [customdatesval, setCustomdatesval] = useRecoilState(customdates);
    const [showDatePicker] = useRecoilState(showExploreDate)
    const [selectedDateStart, setSelectedDateStart] = useState(customdatesval.StartDate);
    const [selectedDateEnd, setSelectedDateEnd] = useState(customdatesval.EndDate);
    const { t } = useTranslation();
    const [curTheme]=useRecoilState(themeMode)
    const [ExploreOptions, setExploreOptions] = useRecoilState(exploreOptions)
    const [selectedIntervals, setSelectedInterval] = useRecoilState(selectedInterval);
    const [tabValue] = useRecoilState(exploreTabValue);
    const [intervalLabel] = useRecoilState(labelInterval)
    const [PinSelected]= useRecoilState(pinSelected)

    const [, setcharttype] = useRecoilState(TrendschartMode)
    const [markerMode, setMarkerMode] = useRecoilState(trendsMarkerMode)
    const [gapstatus, setgapstatus] = useRecoilState(GapMode);
    const [normalizeMode, setNormalizeMode] = useRecoilState(NormalizeMode);

    const [OverallSwitchIndex, setOverallSwitchIndex] = useState(0);
 
    const theme = useTheme(); 
    useEffect(() => {
        localStorage.setItem('intervalOnlineTrends', 60);
        localStorage.setItem("exploreRange", 13)
        setRangeSelected(13)
        let start = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
        let end = new Date()
        setCustomdatesval({
            StartDate: start, 
            EndDate: end
        })
        setSelectedDateStart(start);
        setSelectedDateEnd(end);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setcharttype(OverallSwitchIndex === 0 ? false : true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [OverallSwitchIndex])


    useEffect(() => {
        if(headPlant.id){
            let range = localStorage.getItem("exploreRange") || 13;
            range = Number(range);
            setRangeSelected(range);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headPlant]);
   
    const handleInterval = (e) => {
        setSelectedInterval(e.target.value)
        localStorage.setItem('intervalOnlineTrends', e.target.value);
    }

    const intervalOption = [
        { id: "0.0167", value: "1 sec" },
        { id: "0.083", value: "5 sec" },
        { id: "0.167", value: "10 sec" },
        { id: "0.5", value: "30 sec" },
        { id: "1", value: "1 min" },
        { id: "2", value: "2 min" },
        { id: "5", value: "5 min" },
        { id: "10", value: "10 min" },
        { id: "15", value: "15 min" },
        { id: "30", value: "30 min" },
        // { id: "45", value: "45 min" },
        { id: "60", value: "60 min" },
    ]
    let tabValues = tabValue === 5 ? "30" : selectedIntervals

    const OverAllList = [
        { id: "Line", value: "Line", disabled: false },
        { id: "Area", value: "Area", disabled: false },
    ]
    return (
        <React.Fragment>
                
                {
                    showDatePicker ?
                 <Grid container style={{ position: "relative",borderBottom: '1px solid' + theme.colorPalette.divider ,padding:"8px 16px 8px 16px" ,backgroundColor:curTheme==='dark' ? '#191919' :'#fCFCFC'}}>
                    <Grid item xs={5} sm={5} >
                    </Grid>
                   
                    <Grid item xs={5} sm={5} >
                             <DatePickerNDL
                                   id="custom-range-dashboard"
                                   onChange={(dates) => {
                                   const [start, end] = dates; 
                                   setSelectedDateStart(start);
                                   setSelectedDateEnd(end);
                                         }} 
                                   startDate={selectedDateStart}
                                   endDate={selectedDateEnd}
                                   maxDate={new Date()}
                                   setMax={true}
                                   disabled={true}
                                    dateFormat="dd/MM/yyyy HH:mm:ss"
                                   selectsRange={true}
                                   timeFormat="HH:mm:ss"
                                   customRange={true}
                                   defaultDate={rangeSelected}
                             />
                         
                         
                       </Grid>
                        
                            <Grid item xs={2} >
                          
                            {
                                intervalLabel && PinSelected ? <b style={{marginLeft:"10px",width:"40%",fontSize:"16px"}}>
                                    {intervalLabel}

                                </b> :
                                    <Select
                                        labelId=""
                                        id="explore-interval"
                                        auto={false}
                                        options={intervalOption}
                                        isMArray={true}
                                        checkbox={false}
                                        onChange={handleInterval}
                                        keyValue="value"
                                        keyId="id"
                                        error={false}
                                        value={tabValues}
                                        placeholder={t("Select Interval")}
                                        disabled={tabValue === 5}
                                        noSorting
                                    />
                            }


                        
                           
                            </Grid> 
                    </Grid>
                     : 
                    <div style={{ display: "flex", flexDirection: 'row',height:"48px", justifyContent: 'end',  gap: '8px', borderBottom: '1px solid' + theme.colorPalette.divider ,padding:"8px 16px 8px 16px" ,backgroundColor:curTheme==='dark' ? '#191919' :'#fCFCFC'}}>
                        { showDatePicker !== null ? <>
                        <CustomSwitch id={'normalize'} switch={false} size="small" checked={normalizeMode} onChange={(e) => {setNormalizeMode(e.target.checked)}} primaryLabel={'Normalize'} />
                        <CustomSwitch id={'show_markers'} switch={false} size="small" checked={markerMode} onChange={(e) => setMarkerMode(e.target.checked)} primaryLabel={'Show Markers'} />
                        <CustomSwitch id={'show_gap'} switch={false} size="small" checked={gapstatus} onChange={(e) => setgapstatus(e.target.checked)} primaryLabel={'Show Gap'} />
                        <ContentSwitcherNDL listArray={OverAllList} contentSwitcherClick={(e) => {setOverallSwitchIndex(e); setExploreOptions({ ...ExploreOptions, chart: e })}} switchIndex={OverallSwitchIndex} ></ContentSwitcherNDL>
                        </> : <>&nbsp;&nbsp;</>}
                    </div>
                }

        </React.Fragment>
    )
}

export default DateRange;