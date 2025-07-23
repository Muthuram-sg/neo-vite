import React, { useState, useEffect,useRef,forwardRef,useImperativeHandle } from 'react';
import DatePickerNDL from 'components/Core/DatepickerNDL'; 
// Recoil packages
import { useRecoilState } from 'recoil';

import { dashBtnGrp, defaultDashboard, ProdBtnGrp,  EnergyBtGroup, 
  EnergySQMTBtGroup, customdates
} from "recoilStore/atoms"; // Recoil variables   
const DateRange = forwardRef((props,ref)=> {
  
  const [RangeFlag,setRangeFlag] = useState(true)
  const [btGroupValue] = useRecoilState(dashBtnGrp);
  const [ProdGroupRange] = useRecoilState(ProdBtnGrp);
  const [dashboardDefaultID] = useRecoilState(defaultDashboard); 
  const [Customdatesval] = useRecoilState(customdates);
  const [selectedDateStart, setSelectedDateStart] = useState(Customdatesval.startDate);
  const [selectedDateEnd, setSelectedDateEnd] = useState(Customdatesval.endDate);
  const [showtextvalue, setShowtextvalue] = useState(6);
  const [specificSelect, setSpecificSelect] = useState('');
  const [energybtGroupValue] = useRecoilState(EnergyBtGroup);
  const [energysqmtbtGroupValue] = useRecoilState(EnergySQMTBtGroup);
 
  
  // const [DefaultDate,setDefaultDate] = useState('6')
  const datepickerRef = useRef();
  useImperativeHandle(ref,()=>({
    refreshDate: ()=>datepickerRef.current.refreshDate(showtextvalue)
  })) 
  
  useEffect(() => {
  

    if ((dashboardDefaultID === "cdf940e6-9445-4d3d-a175-22caa159d7a0") ) {
      // console.log('hello 1',props.range,dashboardDefaultID)
      if(props.range && RangeFlag){
        setShowtextvalue(17)
        setRangeFlag(false)
      }
      else{ 
          if (ProdGroupRange) {
            setShowtextvalue(Number(ProdGroupRange))
          } 
       
      }
     
    } else if (dashboardDefaultID === 'ab0cb71d-36b0-4ac2-9e3d-43e01f55714d' || (dashboardDefaultID === "0cb34336-2431-44fd-94b1-cc8d85dec537")) {
      // console.log('hello 2')
      setShowtextvalue(ProdGroupRange)
    } else { 
        
        if(props.range && RangeFlag){
          setShowtextvalue(17)
          // setRangeFlag(false)
        }
        else{
          if (ProdGroupRange ) {
            // console.log('sorry 2',props.range,ProdGroupRange)
            setShowtextvalue(Number(ProdGroupRange))
          }
          if (energybtGroupValue) {
            setShowtextvalue(Number(energybtGroupValue))
          }
          if (energysqmtbtGroupValue) {
            setShowtextvalue(Number(energysqmtbtGroupValue))
          }
        }
     
    }
    if (dashboardDefaultID === '0cb34336-2431-44fd-94b1-cc8d85dec537' || dashboardDefaultID === 'cdf940e6-9445-4d3d-a175-22caa159d7a0' ) {
      // console.log('hello 4')
      if(props.range && RangeFlag){
        setShowtextvalue(17)
        setRangeFlag(false)
      }
      setSpecificSelect("Production");
    }else if(dashboardDefaultID === '0cb34336-2431-44fd-94b1-cc8d85dec537' ){
      setSpecificSelect("OEEDashboard");
    }else if(dashboardDefaultID === 'ab0cb71d-36b0-4ac2-9e3d-43e01f55714d'){
      // console.log('hello 5')
      setSpecificSelect("Downtime");
    } else if(dashboardDefaultID === "cc5b58c2-7f8d-4183-9a8a-26ce1d7754cf"){
      setSpecificSelect("EnergyDashboard");
    } else {
      // console.log('hello 6')
      if(props.range && RangeFlag){
        setShowtextvalue(17)
        // setRangeFlag(false)
      }
      setSpecificSelect('');
    }

    // To Enable Live Button is Custom Dashboard 
    localStorage.setItem('customDashboard',btGroupValue)

    
    // console.log(btGroupValue , ProdGroupRange,dashboardDefaultID,"btGroupValuebtGroupValue",energybtGroupValue,props.queryDate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [btGroupValue, ProdGroupRange, dashboardDefaultID,energybtGroupValue,props.range]) 

  function MaxDayFnc(){ 
    if((dashboardDefaultID === 'cdf940e6-9445-4d3d-a175-22caa159d7a0' || props.moduleName === 'production')){
      return 2
    }else{
      return 29
    }
  }
  

  return (
      
      <DatePickerNDL
              id="custom-range-dashboard"
              ref={datepickerRef}
              onChange={(dates) => {
                const [start, end] = dates; 
                setSelectedDateStart(start);
                setSelectedDateEnd(end);
              }} 
              startDate={selectedDateStart}
              endDate={selectedDateEnd}
              disabled={true}
              dateFormat="dd/MM/yyyy HH:mm:ss"
              selectsRange={true}
              timeFormat="HH:mm:ss"
              customRange={true}
              width={dashboardDefaultID === 'cdf940e6-9445-4d3d-a175-22caa159d7a0' ? '' : '386px'}
              defaultDate={showtextvalue}
              Dropdowndefine={specificSelect}
              maxDays={MaxDayFnc()}
              queryDate={props.range}
              
      />
  )
})
export default DateRange;