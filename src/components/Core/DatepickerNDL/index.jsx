import React,{ forwardRef, useEffect,useState,useImperativeHandle } from 'react';
import Button from "components/Core/ButtonNDL";
import {useLocation,useNavigate} from "react-router-dom"
import Grid from "components/Core/GridNDL";
import moment from 'moment';
import DatePicker from "react-datepicker";
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { selectedPlant,dashBtnGrp,customdates,ProdBtnGrp,EnergyBtGroup,EnergySQMTBtGroup, exploreRange,faultRange,AlarmDaterange,TaskRange,productionDateRange,ErrorPage } from "recoilStore/atoms"; 
import { useRecoilState } from "recoil"
import configParam from 'config';
import "react-datepicker/dist/react-datepicker.css";
import { getDay,getYear,getMonth } from "date-fns";
import CaretLeft from 'assets/neo_icons/Arrows/single_line_left.svg?react';
import CaretRight from 'assets/neo_icons/Arrows/single_line_right.svg?react';
import RefreshLight from 'assets/neo_icons/Menu/refresh.svg?react';
import HorizontalLineNDL from '../HorizontalLine/HorizontalLineNDL';
import TypographyNDL from '../Typography/TypographyNDL';

const DatepickerNDL = forwardRef((props,ref)=>{
    const [headPlant] = useRecoilState(selectedPlant) 
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [Open,setOpen] = useState(false);
    const [ShowCustom,setShowCustom]= useState(false);
    const { t } = useTranslation();
    const [, setbtGroupValue] = useRecoilState(dashBtnGrp);
    const [, setAlarmRange] = useRecoilState(AlarmDaterange);
    const [,setProdGroupRange] = useRecoilState(ProdBtnGrp);
    const [,setenergybtGroupValue] = useRecoilState(EnergyBtGroup);
    const [,setenergysqmtbtGroupValue] = useRecoilState(EnergySQMTBtGroup);
    const [, setRangeSelected] = useRecoilState(exploreRange);
    const [, setFaultRange] = useRecoilState(faultRange);
    const [,setProductionSelected] = useRecoilState(productionDateRange);
    const [,setErrorPage] = useRecoilState(ErrorPage);
    const [, setTaskRange] = useRecoilState(TaskRange);
    const [previousRange,setpreviousRange] = useState( []); 
    const [CustomPickerArr,setCustomPickerArr]= useState( []); 
    const [, setCustomdatesval] = useRecoilState(customdates);
    const [rangeStartDate,setRangeStartDate]=useState(null);
    const [rangeEndDate,setRangeEndDate]=useState(null);
    const [showWarning, setShowWarning] = useState(false)
    const [rangeFlag,setRangeFlag] = useState(props.queryDate ? true : false)
    const [ScreenHeight,setScreenHeight] =React.useState(0)
    const [ScrollY,setScrollY]=React.useState(0)  
    const [TopR,setTopR] =React.useState(0)
    const startDateToUse=rangeStartDate ;
    let navigate = useNavigate()
    const endDateToUse=rangeEndDate 
    var helpertextcss = props.error ? "mt-2 text-sm text-error-text dark:text-error-text leading-[18px]  font-geist-sans" : "mt-2 text-sm text-primary-text dark:text-primary-text leading-[18px] font-geist-sans"
    let rangeParam = props.queryDate ? props.queryDate : '';
    useImperativeHandle((ref),()=>({
        refreshDate : (value)=>changeCurrentDate(value)
    }))
    const formatDate = dateStr => {
        const [day, month, year, time] = dateStr.split(/[- ]/);
        return new Date(`${month}/${day}/${year} ${time || ''}`.trim()).toString();
      };

      useEffect(() => { 
        
        window.addEventListener('scroll', handleScroll);

        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
    }, [Open]);

    const handleScroll = event => { 
        let posT 
        let posB 
        if(ScrollY === 0){
            posT = Number(TopR-window.pageYOffset)
            posB = Number(ScreenHeight+window.pageYOffset)
        }else{
            let prevScroll = window.pageYOffset - ScrollY
            posT = Number(TopR-prevScroll)
            posB = Number(ScreenHeight+prevScroll)
        } 
        // console.log(ScreenHeight,"ScreenHeight",posB,posT)
        if(document.getElementById("customPicker")){
            if(ScreenHeight> 200){
                if(posT > 55){
                    document.getElementById("customPicker").style.top = posT+'px';
                }else{
                    console.log(posT,"posTposT")
                    if(posT <0){
                        document.getElementById("customPicker").style.top = posT+'px';
                        document.getElementById("customPicker").style.visibility = 'hidden' 
                    }else{
                        document.getElementById("customPicker").style.top = '40px';
                        document.getElementById("customPicker").style.visibility = 'visible' 
                    }
                    
                }
                document.getElementById("customPicker").style.bottom = 'unset';
            }else{
                if(posB > 0){
                    document.getElementById("customPicker").style.bottom = posB+"px"
                }else{
                    document.getElementById("customPicker").style.bottom = '0px';
                }
                document.getElementById("customPicker").style.top = 'unset';
            }  
        } 
    };

    useEffect(()=>{
        // console.log(props.queryDate,rangeParam,"datepicker",rangeStartDate,rangeEndDate,rangeFlag)
        if(rangeParam && rangeFlag){
            // console.log('hi 1')
            if (/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2};\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(rangeParam)) {
                const [startDate, endDate] = rangeParam.split(";").map(formatDate);
                console.log('hi 2',startDate,endDate,props.maxDays)
                
                if(startDate !== "Invalid Date" && endDate !== 'Invalid Date'){
                    let Datediff = moment(endDate).diff(moment(startDate), 'days')
                    console.log(Datediff,"Datediff",props.maxDays)
                    let maxD= props.maxDays ? props.maxDays : Datediff
                    if(new Date(startDate).getTime() <= new Date(endDate).getTime() && Datediff <= maxD){
                        
                        setRangeStartDate(new Date(startDate))
                        setRangeEndDate(new Date(endDate))
                        setCustomdatesval({ StartDate: new Date(startDate), EndDate: new Date(endDate) })
                        onCustomChange({id:17})
                        setbtGroupValue(17)
                        setRangeFlag(false)
                        setProdGroupRange(17)
                        
                        setenergybtGroupValue(17)
                        setenergysqmtbtGroupValue(17) 
                        
                    }else{
                        setErrorPage(true)      
                    }
                }
                else{
                    console.log('error')
                  setErrorPage(true)
                }
            } else {
                console.log('error')
                  setErrorPage(true)
            }
            
           
        }
        else{
            setRangeStartDate(props.startDate)
            setRangeEndDate(props.endDate)
            setRangeFlag(false)
        }
       
         
    },[props.startDate,props.endDate])
    useEffect(()=>{
        setShowWarning(false)
        if(props.Dropdowndefine === 'Production' ){
            setCustomPickerArr([
                {id : 6 , value : t("Today")},
                {id : 19 , value : t("Shift - Today")}, 
                {id : 11 , value : t("ThisShift")},
                {id : 21 , value : t("Last Shift")},
                {id : 7 , value : t("Yesterday")},
                {id : 20 , value : t("Shift-Yesterday")},
                {id : 17 , value : t("Custom")},
              
            ])
        }else if(props.Dropdowndefine === 'Steel Production'){
            setCustomPickerArr([
                {id : 6 , value : t("Today")},
                {id : 19 , value : t("Shift - Today")}, 
                {id : 11 , value : t("ThisShift")},
                {id : 21 , value : t("Last Shift")},
                {id : 7 , value : t("Yesterday")},
                {id : 20 , value : t("Shift-Yesterday")},
                {id : 14 , value : t("Last 7 Days")},
                {id : 8 , value : t("ThisWeek")},
                {id : 15 , value : t("Last 30 Days")},
                {id : 9 , value : t("ThisMonth")},
                {id : 16 , value : t("LastMonth")},
                {id : 17 , value : t("Custom")},
              
            ])
        }
        else if(props.Dropdowndefine === 'Availability Report'){
            setCustomPickerArr([
                {id : 6 , value : t("Today")},
                {id : 19 , value : t("Shift - Today")}, 
                {id : 7 , value : t("Yesterday")},
                {id : 20 , value : t("Shift-Yesterday")},
                {id : 8 , value : t("ThisWeek")},
                {id : 14 , value : t("Last 7 Days")},
                {id : 9 , value : t("ThisMonth")},
                {id : 15 , value : t("Last 30 Days")},
                {id : 17 , value : t("Custom")}
            ])
        }
        else if(props.Dropdowndefine === 'Speed-Feed Performance'){
            setCustomPickerArr([
                {id : 6 , value : t("Today")},
                {id : 19 , value : t("Shift - Today")}, 
                {id : 7 , value : t("Yesterday")},
                {id : 20 , value : t("Shift-Yesterday")},
                {id : 8 , value : t("ThisWeek")},
                {id : 14 , value : t("Last 7 Days")},
                // {id : 9 , value : t("ThisMonth")},
                // {id : 15 , value : t("Last 30 Days")},
                {id : 17 , value : t("Custom")}
            ])
        }else if( props.Dropdowndefine === 'Route Card'){
            setCustomPickerArr([
                {id : 6 , value : t("Today")},
                {id : 11 , value : t("ThisShift")},
                {id : 21 , value : t("Last Shift")},
                {id : 7 , value : t("Yesterday")},
                {id : 13 , value : t("Last 24 Hrs")},
                {id : 17 , value : t("Custom")}
            ])

        }
        else if(props.Dropdowndefine === 'Downtime' || props.Dropdowndefine === 'AlarmsLine'){
            setCustomPickerArr([
                {id : 27 , value : t("Last 1 Min")},
                {id : 1 , value : t("Last 5 Min")},
                {id : 2 , value : t("Last 15 Min")},
                {id : 3 , value : t("Last 30 Min")},
                {id : 4 , value : t("LastHour")},
                {id : 12 , value : t("Last 3 Hrs")},
                {id : 5 , value : t("Last 6 Hrs")},
                {id : 6 , value : t("Today")},
                {id : 13 , value : t("Last 24 Hrs")},
                {id : 11 , value : t("ThisShift")},
            ])
        }  else if(props.Dropdowndefine === 'EditSettings'){
            setCustomPickerArr([
            {id : 27 , value : t("Last 1 Min")},
            {id : 1 , value : t("Last 5 Min")},
            {id : 2 , value : t("Last 15 Min")},
            {id : 3 , value : t("Last 30 Min")},
            {id : 4 , value : t("LastHour")},
            {id : 12 , value : t("Last 3 Hrs")},
            {id : 5 , value : t("Last 6 Hrs")},
            {id : 6 , value : t("Today")},
            {id : 19 , value : t("Shift - Today")},
            {id : 13 , value : t("Last 24 Hrs")},
            {id : 11 , value : t("ThisShift")},
            {id : 21 , value : t("Last Shift")},
            {id : 7 , value : t("Yesterday")},
            {id : 20 , value : t("Shift-Yesterday")},
            {id : 14 , value : t("Last 7 Days")},
            {id : 8 , value : t("ThisWeek")},
            {id : 15 , value : t("Last 30 Days")},
            {id : 9 , value : t("ThisMonth")},
            {id : 16 , value : t("LastMonth")},])
        }
        else if(props.Dropdowndefine === 'alarms'){
            setCustomPickerArr([
                {id : 6 , value : t("Today")},
                {id : 13 , value : t("Last 24 Hrs")},
                {id : 7 , value : t("Yesterday")},
                {id : 14 , value : t("Last 7 Days")},
                {id : 8 , value : t("ThisWeek")},
                {id : 15 , value : t("Last 30 Days")},
                {id : 9 , value : t("ThisMonth")},
                {id : 19 , value : t("Shift - Today")},
                {id : 16 , value : t("LastMonth")},
                {id : 17 , value : t("Custom")}
            ])
        }
        
            else if(props.Dropdowndefine === 'analytics'){
                let Last20 = (props.timerChange === 21) ? t("Last 20 Min") : t('Last4Hour')
                let Last60=(props.timerChange === 61 || props.timerChange === 60) ? t('LastHour') : Last20
                let TimerID = (props.timerChange === 21) ? 30 : 28

            setCustomPickerArr([
                {id : 25 , value : t('Live')},
                {id : (props.timerChange === 61 || props.timerChange === 60) ? 4 : TimerID, value : Last60}, 
                {id : 17 , value : t("Custom")}
            ])
        }else if(props.Dropdowndefine === 'FaultAnalysis'){
            setCustomPickerArr([
                {id : 6 , value : t("Today")},
                {id : 13 , value : t("Last 24 Hrs")},
                {id : 7 , value : t("Yesterday")},
                {id : 14 , value : t("Last 7 Days")},
                {id : 8 , value : t("ThisWeek")},
                // {id : 15 , value : t("Last 30 Days")},
                // {id : 9 , value : t("ThisMonth")},
                {id : 17 , value : t("Custom")}
            ])
        }
        else if(props.Dropdowndefine === 'ProductionDateRange'){
            setCustomPickerArr([
                {id : 6 , value : t("Today")},
                {id : 7 , value : t("Yesterday")},
                {id : 8 , value : t("ThisWeek")},
                {id : 15 , value : t("Last 30 Days")},
                {id : 17 , value : t("Custom")}
            ])
        }
        
        else if(props.Dropdowndefine === 'Time Slot Report'){
            setCustomPickerArr([
                {id : 7 , value : t("Yesterday")},
                {id : 14 , value : t("Last 7 Days")},
                {id : 8 , value : t("ThisWeek")},
                {id : 15 , value : t("Last 30 Days")},
                {id : 9 , value : t("ThisMonth")},
                {id : 16 , value : t("LastMonth")}
            ])
        } else if(props.Dropdowndefine === 'Task'){
            setCustomPickerArr([
                {id : 6 , value : t("Today")},
                {id : 13 , value : t("Last 24 Hrs")},
                {id : 7 , value : t("Yesterday")},
                {id : 8 , value : t("ThisWeek")},
                {id : 14 , value : t("Last 7 Days")},
                {id : 9 , value : t("ThisMonth")},
                {id : 15 , value : t("Last 30 Days")},
                {id : 18 , value : t("Last 3 Months")},
                {id : 26 , value : t("Last 6 Months")},
                {id : 17 , value : t("Custom")}
            ])
        } 
        else {
            setCustomPickerArr([
                {id : 27 , value : t("Last 1 Min")},
                {id : 1 , value : t("Last 5 Min")},
                {id : 2 , value : t("Last 15 Min")},
                {id : 3 , value : t("Last 30 Min")},
                {id : 4 , value : t("LastHour")},
                {id : 12 , value : t("Last 3 Hrs")},
                {id : 5 , value : t("Last 6 Hrs")},
                {id : 6 , value : t("Today")},
                {id : 19 , value : t("Shift - Today")},
                {id : 13 , value : t("Last 24 Hrs")},
                {id : 11 , value : t("ThisShift")},
                {id : 21 , value : t("Last Shift")},
                {id : 7 , value : t("Yesterday")},
                {id : 20 , value : t("Shift-Yesterday")},
                {id : 14 , value : t("Last 7 Days")},
                {id : 8 , value : t("ThisWeek")},
                {id : 15 , value : t("Last 30 Days")},
                {id : 9 , value : t("ThisMonth")},
                {id : 16 , value : t("LastMonth")},
                {id : 17 , value : t("Custom")}
            ])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.Dropdowndefine,props.timerChange])

    useEffect(()=>{
        if(props.defaultDate && !rangeFlag){
            if(!props.dynamic){
                changeCurrentDate(props.defaultDate)
            }
            setpreviousRange(props.defaultDate)
            // console.log(props.defaultDate,"props.defaultDateprops.defaultDate")
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.defaultDate])

    function OpenPicker(e){ 
        setOpen(true)
        let screenH = window.innerHeight - e.currentTarget.getBoundingClientRect().top
        setScreenHeight(screenH)
        setScrollY(window.scrollY)
        if(props.onlyRangePicker){
            setShowCustom(true)
        }
        let ScrollW = window.innerWidth - document.documentElement.clientWidth
        let MainW= document.getElementById(props.id).offsetWidth
            let Top
            let RigthPos = window.innerWidth - e.currentTarget.getBoundingClientRect().right
            let posLeft = e.currentTarget.getBoundingClientRect().left
            let ActualPos = e.currentTarget.getBoundingClientRect().left
            if(RigthPos < posLeft){
                ActualPos = RigthPos 
            }
            
            let WidthCur = e.currentTarget.offsetWidth
            //console.log(RigthPos, WidthCur)
            if(screenH > 200){
                Top =  e.currentTarget.getBoundingClientRect().top + e.currentTarget.offsetHeight
            }
            setTopR(Top)
            setTimeout(()=>{ // positioning picker dropdown
                    document.getElementById("customPicker").removeAttribute("style") 
                // console.log(props.options,"e.currentTarget.offsetTop",e.currentTarget.getBoundingClientRect().bottom ,window.scrollY,window.innerHeight -e.currentTarget.getBoundingClientRect().top,document.getElementById("customPicker").innerHeight) 
                if(screenH < 200){
                    // Top =  e.currentTarget.getBoundingClientRect().top - (screenH+e.currentTarget.offsetHeight) - (190-screenH) 
                    document.getElementById("customPicker").style.bottom = screenH+"px"


                }else{
                    document.getElementById("customPicker").style.top = Top+"px"


                }
                // document.getElementById("customPicker").style.top = Top+"px"
                let FinalLeft
                let PosSub = MainW-WidthCur
                if(ActualPos > PosSub){
                    FinalLeft = ActualPos - PosSub
                }else{
                    FinalLeft = PosSub - ActualPos
                }
                 if(RigthPos < posLeft){
                    document.getElementById("customPicker").style.right = (ActualPos - ScrollW)+"px"   

                }else{
                    document.getElementById("customPicker").style.left = (FinalLeft - ScrollW)+"px"
                }
                if(props.defaultDate === 17){
                    document.getElementById("customPicker").style.width = "674px"
                    setShowCustom(true)
                }else{
                    document.getElementById("customPicker").style.width = MainW+"px"
                }
                
                document.getElementById("customPicker").style.position = 'absolute'
                document.getElementById("customPicker").style.visibility = 'visible'
                document.getElementById("customPicker").style.boxShadow = "0px 2px 6px 0px rgba(32, 32, 32, 0.15);"

            },200)
      }
     
      function changeCurrentDate(e,onChange){
        console.log('showtextvalue',e)
        let startrange;
        let endrange;
        if (e === 25) {
            startrange =  moment().subtract(props.timerChange, 'minutes').format("YYYY-MM-DDTHH:mm:ssZ");
        }else{
            startrange = configParam.DATE_ARR(e, headPlant); 
        }
        
        if (e === 17) {
            CustomSubmit() 
        } else if(e === 7){
            endrange = moment(moment().subtract(1, 'day')).endOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
        }else if (e === 20) {
          endrange = configParam.DATE_ARR(22, headPlant)
        } else if (e === 21) {
          endrange = configParam.DATE_ARR(23, headPlant)
        } else if (e === 16) {
          endrange =  moment().subtract(1, 'month').endOf('month').endOf('day').format("YYYY-MM-DDTHH:mm:ssZ");
        } else { 
        //   endrange = props.Dropdowndefine === 'Speed-Feed Performance' ? moment().endOf('date').format("YYYY-MM-DDTHH:mm:ssZ") : moment().format("YYYY-MM-DDTHH:mm:ssZ")
        endrange = moment().format("YYYY-MM-DDTHH:mm:ssZ")
        }
    
        if(e !== 17){
          setOpen(false) 
          props.onChange([new Date(startrange),new Date(endrange)],e)
          if(!props.dynamic) {
            setCustomdatesval({ StartDate: new Date(startrange), EndDate: new Date(endrange) })
          }
          setShowCustom(false)
        }
        if(!onChange){
            setenergybtGroupValue(e)
        }
        console.log(startrange,endrange,"startrange,endrange")
      }
      function onCustomChange(e){ 
        console.log(props.Dropdowndefine,e,"props.Dropdowndefine")
        if(props.Dropdowndefine === 'Production' && e.id !== 17){
            setProdGroupRange(e.id)
           localStorage.setItem('Production',e.id)
        }else if(props.Dropdowndefine === 'OEEDashboard' && e.id !== 17){
            setProdGroupRange(e.id)
            localStorage.setItem('OEEDashboard',e.id)
        } else{
            if(!props.dynamic && e.id !== 17){
                console.log(props.Dropdowndefine,"props.Dropdowndefine")
                console.log(props.Dropdowndefine,e.id,"idddd")
                localStorage.setItem(props.Dropdowndefine,e.id)
                setbtGroupValue(e.id)
                setAlarmRange(e.id)
                setenergybtGroupValue(e.id)
                setenergysqmtbtGroupValue(e.id)
                setRangeSelected(e.id)
                setFaultRange(e.id)
                setProductionSelected(e.id)
                setTaskRange(e.id)
            }
        }
        if (e.id === 17) {
            setShowCustom(true)
            if(document.getElementById("customPicker")){
                document.getElementById("customPicker").style.width = "674px"
            }
            localStorage.setItem(props.Dropdowndefine,e.id)
           
        }else{
            
            setOpen(false)
            setShowCustom(false)
        }
        if(props.dynamic && e.id !== 17){
            changeCurrentDate(e.id,true)
        }
        
      }
    var years =[]
    years = range(1990);
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    function range(startYear) {
        var currentYear = new Date(new Date().setFullYear(new Date().getFullYear() + 2)).getFullYear()
        startYear = startYear || 1980;  
        while ( startYear <= currentYear ) {
            years.push(startYear++);
        }   
        return years;
    }

    function CustomHeader(date,changeYear,changeMonth,decreaseMonth,increaseMonth,prevMonthButtonDisabled,nextMonthButtonDisabled){
        const OptionArr = (arr)=>{
            return arr.map((option) => (
                <option key={option} value={option}>
                {option}
                </option>
            ))
        }
        return (
            <div
                style={{
                marginBottom: 5,
                display: "flex",
                justifyContent: "space-evenly",
                }}
                >
                
                <CaretLeft stroke={prevMonthButtonDisabled ? "#161616" : "#C6C6C6"} fill={"#ffff"} 
                    onClick={decreaseMonth} 
                    style={{padding: '4px'}}
                />
                <select
                    className={"customcalendar-month-select"}
                    value={months[getMonth(date)]}
                    onChange={({ target: { value } }) => {
                        changeMonth(months.indexOf(value))
                        if(props.customRange){
                            if(props.dynamic){
                                setRangeStartDate(null)
                                setRangeEndDate(null)
                            }else{
                                props.onChange([null, null], 17)
                            }
                            
                        }
                    }}
                >
                {OptionArr(months)}
                </select>
                <select
                className={"customcalendar-year-select"}
                value={getYear(date)}
                onChange={({ target: { value } }) => changeYear(value)}
                >
                {OptionArr(years)}
                </select>
                <CaretRight stroke={nextMonthButtonDisabled ? "#161616" : "#C6C6C6"} fill={"#ffff"} 
                    onClick={increaseMonth} 
                    style={{padding: '4px'}}
                /> 
            </div>
        )
    }

    function CustomSubmit(){ 
        let dateProp = props.startDate===undefined ? null : props.startDate 
        let endProp = props.endDate===undefined?null:props.endDate
        // console.log(props.startDate,rangeStartDate,"custom submit",endProp)
        if(!props.dynamic){
            setCustomdatesval({ StartDate: new Date(rangeStartDate ? rangeStartDate : dateProp), EndDate: new Date(rangeEndDate ? rangeEndDate : endProp) })
        }
        
        
        if(props.dynamic){
            props.onChange([new Date(rangeStartDate ? rangeStartDate : props.startDate), new Date(rangeEndDate ? rangeEndDate : props.endDate)],17)
        }else{
            if(props.Dropdowndefine === 'Production'){
                setProdGroupRange(17)
            } else{
                setbtGroupValue(17)
                setAlarmRange(17)
                setenergybtGroupValue(17)
                setenergysqmtbtGroupValue(17)
                setRangeSelected(17)
                setFaultRange(14)
                setProductionSelected(17)
                setTaskRange(17)
            } 
            props.onChange([new Date(rangeStartDate ? rangeStartDate : props.startDate), new Date(rangeEndDate ? rangeEndDate : props.endDate)],17)
        }
        setOpen(false)
        setShowCustom(false)
        
    }
    const handleInternalChange = (dates) => {
            setRangeStartDate(dates[0]); 
            let DateLimit = props.maxHours ? new Date(moment(dates[1]).add(Number(props.maxHours -1),"m").format("YYYY-MM-DD HH:mm:ss")) : new Date(moment(dates[1]).endOf('day').format("YYYY-MM-DD HH:mm:ss"))
            if(DateLimit > new Date().getTime() && (props.Dropdowndefine === 'Production' || props.Dropdowndefine === 'EnergyDashboard')){
                DateLimit = new Date()
            }
            setRangeEndDate(dates[1] ? DateLimit : dates[1]);
        
    };

    function popperClose(){
        setOpen(false);
        // console.log(previousRange,"previousRange",props.startDate)
        if(!rangeStartDate && !rangeEndDate){
            props.onChange([new Date(props.startDate),new Date(props.endDate)],previousRange)
        }
        if(props.defaultDate !== 17){
            setShowCustom(false)
        }
        
    }
      let MaxHours =props.maxHours ? Number(props.maxHours-1) : 0

      function MaxDatesFunc() {
        if(props.pdmdates){
        if (startDateToUse && props.maxDays) {
            let maxD = new Date(moment(new Date(startDateToUse))
                .add(Number(props.maxDays), "day")
                .add(MaxHours, 'm')
                .format("YYYY-MM-DD HH:mm:ss"));
    
            const currentDate = new Date();
            
            if (
                moment(maxD).isSame(moment(currentDate), 'day') &&
                props.Dropdowndefine === 'Production'
            ) {
                return currentDate; 
            } else if (maxD.getTime() > currentDate.getTime()) {
                return currentDate; 
            } else {
                return maxD;
            }
        } 
        else if (props.setMax) {
            return props.maxDate || new Date();
        } 
        else {
            return null;
        }
    } else {
        if(startDateToUse && props.maxDays){
            let maxD = new Date(moment(new Date(startDateToUse)).add(Number(props.maxDays),"day").add(MaxHours,'m').format("YYYY-MM-DD HH:mm:ss"))
            if(maxD.getTime() > new Date().getTime() && (props.Dropdowndefine === 'Production' || props.Dropdowndefine === 'Speed-Feed Performance')){
                return new Date()
            }else{
                return maxD
            }
        }
        else if(props.setMax){
            return props.maxDate
        }
        else{
            return null
        }
    }
    }    

      function MinDatesFunc() {
        if (startDateToUse && props.maxDays) {
            let minD = new Date(moment(new Date(startDateToUse))
                .subtract(Number(props.maxDays), "days") 
                .add(MaxHours, 'm')
                .format("YYYY-MM-DD HH:mm:ss"));
    
            if (minD.getTime() < moment().subtract(6, 'days').toDate().getTime()) {
                return moment().subtract(6, 'days').toDate(); 
            } else {
                return minD;
            }
        } 
        else if (props.setMin) {
            return props.minDate || moment().subtract(6, 'days').toDate(); 
        } 
        else {
            return null;
        }
    }    

    return (
        <React.Fragment>
            
            <div className="flex" id={props.id}  style={{width: props.width ? props.width : '100%',position: props.customRange ? 'relative' : 'unset'}}>
                {props.customRange &&
                <button className='border focus:border-Focus-focus-primary  dark:focus:border-Focus-focus-primary-dark  border-Border-border-50 rounded-md p-2  dark:border-Border-border-dark-50 absolute h-full w-full z-10' onClick={(e)=> props.customRange ? OpenPicker(e) : '' }></button>}
                <DatePicker 
                showIcon 
                selected={startDateToUse} 
                onChange={(dates) => {   
                    props.onChange(dates ? dates : new Date()); 
                }}
                startDate={startDateToUse} 
                endDate={endDateToUse} 
                selectsRange={props.selectsRange ? true :false}
                // inline={props.selectsRange ? true :false}
                closeOnScroll={true}
                disabled={props.disabled ? true : false}
                dateFormat={props.dateFormat ? props.dateFormat : "dd/MM/yyyy HH:mm:ss"} 
                calendarClassName="NDL-calendar"
                className={`NDL-calendar-input ${props.error ? "NDL-calendar-error" : "NDL-calendar-input"} font-geist-mono border  border-Border-border-50 rounded-md p-2  dark:border-Border-border-dark-50 text-Text-text-secondary bg-Field-field-default dark:bg-Field-field-default-dark dark:text-Text-text-secondary-dark focus:text-Text-text-primary dark:focus:text-Text-text-primary-dark text-[14px] leading-4`}
                dayClassName={(date) => getDay(date) > 31 ? "NDL-calendar-day1" : "NDL-calendar-day"}
                fixedHeight
                timeFormat={props.timeFormat ? props.timeFormat : "HH:mm:ss"}
                timeIntervals={1}
                showMonthYearPicker={props.showMonthYearPicker ? true : false}
                showYearPicker={props.showYearPicker ? true :false}
                showTimeSelectOnly={props.showTimeSelectOnly ? true : false}
                showTimeSelect={props.showTimeSelect ? true : false} 
                maxDate={props.maxDate ? props.maxDate : undefined}
                minDate={props.minDate ? props.minDate : undefined}
                minTime={props.minTime ? props.minTime : undefined}
                maxTime={props.maxTime ? props.maxTime : undefined}
                placeholderText={props.placeholder ? props.placeholder : ''}
                calendarStartDay={0}
                renderCustomHeader={(!props.showYearPicker && !props.showMonthYearPicker) ? ({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                  }) => CustomHeader(date,changeYear,changeMonth,decreaseMonth,increaseMonth,prevMonthButtonDisabled,nextMonthButtonDisabled)
                : undefined}
                >
                    {props.showTimeSelect && !props.showTimeSelectOnly &&
                    <div style={{display:'flex',padding: '0px 5px'}}> 
                            <div style={{paddingRight: '10px'}}>
                                <DatePicker  
                                selected={startDateToUse} 
                                startDate={startDateToUse} 
                                onChange={(date) => {   
                                    if(date){
                                        let DateF = moment(props.startDate).format("YYYY-MM-DD")
                                        let TimeF = moment(date).format("HH:mm:ss") 
                                        if(props.selectsRange){
                                            props.onChange([new Date(DateF+" "+TimeF),props.endDate])
                                        }else{
                                            props.onChange(new Date(DateF+" "+TimeF))
                                        }
                                    }else{
                                        props.onChange(null)
                                    }
                                     
                                }}   
                                closeOnScroll={true}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={1}
                                timeCaption="Time"
                                dateFormat="HH:mm:ss"
                                timeFormat={props.timeFormat ? props.timeFormat :"HH:mm:ss" }
                                calendarClassName="NDL-calendar"
                                className="NDL-calendar-input font-geist-mono text-[14px] leading-4  border-Border-border-50 rounded-md p-2  dark:border-Border-border-dark-50"
                                dayClassName={(date) => getDay(date) > 31 ? "NDL-calendar-day1" : "NDL-calendar-day"}
                                />  
                            </div>
                            {props.selectsRange &&
                            <div style={{paddingRight: '10px'}}>
                                <DatePicker  
                                selected={props.endDate} 
                                onChange={(date) => { 
                                    let DateF = moment(props.endDate).format("YYYY-MM-DD")
                                    let TimeF = moment(date).format("HH:mm:ss") 
                                    props.onChange([props.startDate,new Date(DateF+" "+TimeF)])
                                }} 
                                closeOnScroll={true}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={1}
                                timeCaption="Time"
                                dateFormat="HH:mm:ss"
                                timeFormat="HH:mm:ss"
                                calendarClassName="NDL-calendar"
                                className="NDL-calendar-input font-geist-mono text-[14px] leading-4  border-Border-border-50 rounded-md p-2  dark:border-Border-border-dark-50"
                                dayClassName={(date) => getDay(date) > 31 ? "NDL-calendar-day1" : "NDL-calendar-day"}
                                /> 
                            </div> } 
                    </div>}

                </DatePicker> 
               
                 
            </div>
            {props.error && props.helperText &&
                <p class={helpertextcss} >{props.helperText}</p>}
            {Open && createPortal(
                <div className={`fixed top-0 right-0 left-0 z-10000 overflow-y-auto  overflow-x-hidden md:inset-0 md:h-full}`}  
                onClick={(e)=>{popperClose()}}
                >
                <div id="customPicker" className={`z-20 bg-Surface-surface-default-50 shadow-custom dark:bg-Surface-surface-default-50-dark min-w-[300px] w-[674px]  rounded-2xl invisible`}
                style={{position: 'absolute'}}
                onClick={(e)=>e.stopPropagation()}
                >   
                    <Grid container spacing={1} style={{padding: '16px'}}>
                      {
                        !props.onlyRangePicker && 
                        <Grid item xs={ShowCustom ? 6 : 12} >
                            <Grid container spacing={0} > 
                            {CustomPickerArr.map(val=>{
                                return (
                                <Grid item xs={6}>
                                        <div class={`px-2 py-1   hover:bg-Surface-surface-active hover:rounded-md dark:hover:bg-Surface-surface-active-dark mx-0.5   ${val.id === props.defaultDate ? 'bg-Surface-surface-active rounded-md  dark:bg-Surface-surface-active-dark' : ''}`} 
                                        id={val.id}
                                        onClick={(e)=> onCustomChange(val)}
                                        > 
                                       
                                        <label class="w-full p-1   font-geist-sans text-[14px] leading-4 font-normal  text-Text-text-primary  dark:text-Text-text-primary-dark"> 
                                            {val.value}
                                        </label>
    
                                        </div>
                                </Grid>    
                                )
                            })}   
                            </Grid>
                            </Grid>

                      }
                            
                    {ShowCustom &&
                    <Grid item xs={props.onlyRangePicker ? 12 : 6}  >
                        <Grid container spacing={2} >
                            <Grid item xs={12} style={{display:"flex", justifyContent:"center"}}>
                                <DatePicker 
                                    showIcon 
                                    selected={startDateToUse} 
                                    onChange={(dates) => {
                                        if(ShowCustom){
                                           handleInternalChange(dates)
                                    }} }
                                    startDate={startDateToUse} 
                                    endDate={endDateToUse} 
                                    inline
                                    selectsRange
                                    dateFormat="dd/MM/yyyy"
                                    calendarClassName="NDL-calendar-inline"
                                    className="NDL-calendar-input font-geist-mono text-[14px] leading-4  border-Border-border-50 rounded-md p-2  dark:border-Border-border-dark-50"
                                    dayClassName={(date) => getDay(date) > 31 ? "NDL-calendar-day1" : "NDL-calendar-day"}
                                    // calendarStartDay={1} 
                                    fixedHeight 
                                    minDate={ props.pdmdates ? MinDatesFunc() : startDateToUse && props.maxDays ? new Date(moment(new Date(startDateToUse)).format("YYYY-MM-DD HH:mm:ss")) : null}
                                    maxDate={MaxDatesFunc()}
                                    showMonthYearPicker={props.showMonthYearPicker ? true : false}
                                    showYearPicker={props.showYearPicker ? true :false}
                                    renderCustomHeader={({
                                        date,
                                        changeYear,
                                        changeMonth,
                                        decreaseMonth,
                                        increaseMonth,
                                        prevMonthButtonDisabled,
                                        nextMonthButtonDisabled,
                                      }) => CustomHeader(date,changeYear,changeMonth,decreaseMonth,increaseMonth,prevMonthButtonDisabled,nextMonthButtonDisabled)
                                    }
                                />    
                            </Grid>
                            {
                                !props.showMonthYearPicker && !props.showYearPicker  ? <>
                                <Grid item xs={12} style={{display:'flex',gap:"8px"}}> 

                                    <React.Fragment>
                                        <div>
                                            <DatePicker  
                                                selected={startDateToUse}   
                                                onChange={(date) => { 
                                                    let DateF = startDateToUse !== null ? moment(startDateToUse).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD")
                                                    if(date){
                                                        let TimeF = moment(date).format("HH:mm:ss") 
                                                        if(props.dynamic){ 
                                                        console.log(DateF, TimeF)
                                                            setRangeStartDate(new Date(DateF+" "+TimeF))
                                                        }else{
                                                            props.onChange([new Date(DateF+" "+TimeF),endDateToUse])
                                                        }
                                                    }else{
                                                        props.onChange(null)
                                                    }
                                                    

                                                }}  
                                                onKeyDown={(e) => {
                                                    if(props.isNoEditTime && props.Dropdowndefine !== 'analytics')
                                                        e.preventDefault();
                                                }} 
                                                closeOnScroll={true}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={1}
                                                timeCaption="Time"
                                                dateFormat="HH:mm:ss"
                                                // disabled={ props.onlyRangePicker}
                                                timeFormat="HH:mm:ss"
                                                calendarClassName="NDL-calendar"
                                                className="NDL-calendar-input font-geist-mono text-[14px] leading-4   border-Border-border-50 rounded-md p-2  dark:border-Border-border-dark-50 "
                                                dayClassName={(date) => getDay(date) > 31 ? "NDL-calendar-day1" : "NDL-calendar-day"}
                                            />  
                                        </div>
                                        <div>
                                            <DatePicker  
                                            selected={endDateToUse} 
                                            onChange={(date) => { 
                                                let DateF = moment(endDateToUse).format("YYYY-MM-DD")
                                                let TimeF = moment(date).format("HH:mm:ss") 
                                                if(props.dynamic){ 
                                                    setRangeEndDate(new Date(DateF+" "+TimeF))
                                                }
                                                props.onChange([startDateToUse,new Date(DateF+" "+TimeF)])
                                            }} 
                                            onKeyDown={(e) => { 
                                                if(props.isNoEditTime && props.Dropdowndefine !== 'analytics'){
                                                    e.preventDefault();
                                                }
                                            }} 
                                            closeOnScroll={true}
                                            showTimeSelect
                                            disabled={endDateToUse ? false : true}
                                            // disabled={ props.onlyRangePicker}
                                                showTimeSelectOnly

                                            // onlyRangePicker={true}
                                            // customRange={true}

                                            timeIntervals={1}
                                            timeCaption="Time"
                                            dateFormat="HH:mm:ss"
                                            timeFormat="HH:mm:ss"
                                            minTime={props.maxHours ? new Date(moment(new Date(startDateToUse)).format("YYYY-MM-DD HH:mm:ss")) : null}
                                            maxTime={props.maxHours ? new Date(moment(new Date(startDateToUse)).add(Number(props.maxHours -1),"m").format("YYYY-MM-DD HH:mm:ss")) : null}
                                            calendarClassName="NDL-calendar"
                                            className="NDL-calendar-input font-geist-mono  text-[14px] leading-4  border-Border-border-50 rounded-md p-2  dark:border-Border-border-dark-50 "
                                            dayClassName={(date) => getDay(date) > 31 ? "NDL-calendar-day1" : "NDL-calendar-day"}
                                            /> 
                                        </div> 
                                    </React.Fragment>
                            
                                     
                                    <Button type={"ghost"} icon={RefreshLight}  style={{minWidth:"32px"}}
                                    onClick={(e) => {  
                                        // props.onChange([null, null], 17)
                                        setRangeStartDate(null);
                                        setRangeEndDate(null);
                                    }}/> 
                                    <Button type="primary"  value="Run" onClick={()=>{
                                        if(props.Dropdowndefine === 'analytics'){
                                            let limit = (props.timerChange === 61 || props.timerChange === 60) ? 60 : props.timerChange === 21 ? 20 : 120
                                             
                                            if(moment(endDateToUse).diff(moment(startDateToUse), 'minutes') > limit){
                                                setShowWarning(true)
                                            } else {
                                                setShowWarning(false)
                                                CustomSubmit()
                                            }
                                        } else {
                                            setShowWarning(false)
                                            CustomSubmit()
                                        }
                                    }}/> 
                                </Grid>
                                {
                                    showWarning && (
                                        <Grid item xs={12}>
                                            <TypographyNDL style={{color: '#E5484D' }} value={`Data will be display up to max of ${(props.timerChange === 61 || props.timerChange === 60) ? 60 : props.timerChange === 21 ? 20 : 120} min.`} variant="paragraph-xs" />
                                        </Grid>
                                    )
                                }
                                 
                                </>
                                    
                            :
                                                <React.Fragment>
                                                    <Grid item xs={3} >
                                                    </Grid>
                                                    <Grid item xs={6} >
                                                        <div  className='flex items-center gap-4'>
                                                        <Button type={"ghost"} icon={RefreshLight} style={{ minWidth: "32px" }}
                                                            onClick={(e) => {
                                                                // props.onChange([null, null], 17)
                                                                setRangeStartDate(null);
                                                                setRangeEndDate(null);
                                                            }} />
                                                        <Button type="primary" value="Run" onClick={() => CustomSubmit()} />
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={3} >
                                                    </Grid>
                                                </React.Fragment>
                           
                              
                            
                            }
                           

                            
                        </Grid>
                        

                    </Grid>}    
                    {
                                props.note &&
                                <Grid item xs={12}>
                                    <TypographyNDL value={props.note} variant="paragraph-xs" />
                                </Grid> 
                            }
                    </Grid> 
                    
                </div>
                </div>
            ,
            document.body
            )}
        </React.Fragment>
    )
});
export default DatepickerNDL;