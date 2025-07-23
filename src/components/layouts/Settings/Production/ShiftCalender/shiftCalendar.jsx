import React, { useState, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { useTranslation } from 'react-i18next';
import Edit from 'assets/neo_icons/Menu/EditMenu.svg?react';
import EnhancedTable from "components/Table/Table";
import moment from "moment";

import { themeMode, selectedPlant } from "recoilStore/atoms";
import LoadingScreen from "LoadingScreenNDL"
import Button from 'components/Core/ButtonNDL';
import Toast from "components/Core/Toast/ToastNDL";
import useShift from "./hooks/useShifts";
import useUpdateShift from "./hooks/useUpdateShift";
import ShiftCalendarModal from "./components/ShiftCalendarModal";

export default function ShiftCalender() {
  const { t } = useTranslation();
  
  const [openSnack, setOpenSnack] = useState(false);
  const [message, setSnackMessage] = useState('');
  const [type, setSnackType] = useState('');
  const AddShiftCalendarRef = useRef();
  const [curTheme] = useRecoilState(themeMode);
  const [tabledata, setTableData] = useState([])
  const [headPlant,] = useRecoilState(selectedPlant);
  const [shiftData, setShiftData] = useState({})
  const [isLoading] = useState(false)
  const [contractLoader,setcontractLoader] = useState(false)
  const { outshiftLoading, outshiftData, outshiftError, getshifts } = useShift();
  const [ShiftType,setShiftType] =useState('')
  const { updateshiftwithoutIDLoading, updateshiftwithoutIDData, updateshiftwithoutIDError, getupdateshiftwithoutID } = useUpdateShift()

  

  const headCells = [
    {
      id: 'Shift Name',
      numeric: false,
      disablePadding: true,
      label: t('Shift Name'),
    },
    {
      id: 'Day',
      numeric: false,
      disablePadding: true,
      label: t('Day'),
    },
    {
      id: 'Starts At',
      numeric: false,
      disablePadding: false,
      label: t('Starts At'),
    },
    {
      id: 'Ends At',
      numeric: false,
      disablePadding: false,
      label: t('Ends At'),
    }
  ];

  
  
  useEffect(() => {
    getshifts(headPlant.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant])

  useEffect(() => {
    // callseries()
    processedrows()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outshiftData])

  
  useEffect(() => {
    if (!updateshiftwithoutIDLoading && !updateshiftwithoutIDError && updateshiftwithoutIDData) {

      if (updateshiftwithoutIDData.update_neo_skeleton_lines.affected_rows >= 1) {
        
        getshifts(headPlant.id);
        setcontractLoader(true)
        setTimeout(()=>{
          setcontractLoader(false)
          setSnackMessage(t("Shift Updated"));
          setSnackType("success");
          setOpenSnack(true);
        },5000)
        //setAddFields([{ field: 1 }])

      }
    }
    else {

      // console.log("error")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateshiftwithoutIDLoading, updateshiftwithoutIDError, updateshiftwithoutIDData])

  const processedrows = () => {
    var temptabledata = []
    setShiftData(outshiftData)
    if (outshiftData && !outshiftError && !outshiftLoading) {
      let shiftType = outshiftData.shift && outshiftData.shift.ShiftType && outshiftData.shift.ShiftType 
      setShiftType(shiftType? shiftType : '')
      if(shiftType === "Daily"){
        temptabledata = temptabledata.concat(outshiftData.shift && outshiftData.shift.shifts.length > 0 && outshiftData.shift.shifts.map((val, index) => {
          let DST1 = moment().format(`YYYY-MM-DDT` + val.startDate) + 'Z'
          if (moment(DST1).isDST()) { // Checking for Day-light Saving
            DST1 = moment(DST1).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm`)
          }  
          let st = new Date(DST1);
          let st1 = st.toLocaleTimeString('en-GB');
          let st2 = st1.split(":")

          let DST2 = moment().format(`YYYY-MM-DDT` + val.endDate) + 'Z'
          if (moment(DST2).isDST()) {
            DST2 = moment(DST2).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm`)
          }
          let et = new Date(DST2);
          let et1 = et.toLocaleTimeString('en-GB')
          let et2 = et1.split(":")
          let start = st2[0] + ":" + st2[1];
          let end = et2[0] + ":" + et2[1];
        return [val.name, start, end]
      })
      )
    }else{
      if(outshiftData.shift && outshiftData.shift.shifts){
       const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];
       const mergedShifts = [];
       for (const key in outshiftData.shift.shifts) {
           if (outshiftData.shift.shifts.hasOwnProperty(key)) {
               const dayIndex = parseInt(key);
               const dayName = daysOfWeek[dayIndex];
               const shifts = outshiftData.shift.shifts[key].map(shift => ({ ...shift, day: dayName }));
               mergedShifts.push(...shifts);
           }
       }
               temptabledata = temptabledata.concat(mergedShifts && mergedShifts.length > 0 && mergedShifts.filter(k=>k.name !== "-" && k.name !== "").map((val, index) => {
                 let DST1 = moment().format(`YYYY-MM-DDT` + val.startDate) + 'Z'
                 if (moment(DST1).isDST()) { // Checking for Day-light Saving
                   DST1 = moment(DST1).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm`)
                 }  
                 let st = new Date(DST1);
                 let st1 = st.toLocaleTimeString('en-GB');
                 let st2 = st1.split(":")
       
                 let DST2 = moment().format(`YYYY-MM-DDT` + val.endDate) + 'Z'
                 if (moment(DST2).isDST()) {
                   DST2 = moment(DST2).subtract(60, 'minutes').format(`YYYY-MM-DDTHH:mm`)
                 }
                 let et = new Date(DST2);
                 let et1 = et.toLocaleTimeString('en-GB')
                 let et2 = et1.split(":")
                 let start = st2[0] + ":" + st2[1];
                 let end = et2[0] + ":" + et2[1];
               return [val.name,val.day, start, end]
             })
             )
      }
      }
 
      }
     
    setTableData(temptabledata)
  }

  const handleShiftEdit = (id, data) => {
    AddShiftCalendarRef.current.handleShiftEdit(data);
  }

  if (isLoading ) {
    return (<LoadingScreen />);
  }
  return (
    <React.Fragment>
       {
                 contractLoader && <LoadingScreen /> 
       }
      <Toast type={type} message={message} toastBar={openSnack}  handleSnackClose={() => setOpenSnack(false)} ></Toast>
      <div  style={{display: 'flex',justifyContent: 'end',columnGap: '8px'}}>
      <div className="h-10">
       <Button
          type="ghost"
          style={{ float: "right",width:"100px" }}
          value={t('Edit')} onClick={(data) => {handleShiftEdit(data) }}
        //  icon={Edit}
        />
      </div>
    </div>
      <ShiftCalendarModal
        shiftData={shiftData}
        ref={AddShiftCalendarRef}
        headPlant={headPlant}
        getShiftList={() => getshifts(headPlant.id)}
        getupdateshiftwithoutID = {getupdateshiftwithoutID}
      />

      <div style={{ paddingTop: 10, backgroundColor: curTheme === 'dark' ? "#000000" : "#ffff" }}>
        {
          ShiftType === "Daily" ? 

          <EnhancedTable
          headCells={headCells.filter(x=>x.id !== 'Day')}
          data={tabledata}
          style={{ backgroundColor: curTheme === 'dark' ? "#000000" : "#ffff" }}
          rawdata={outshiftData && !outshiftError && !outshiftLoading ? outshiftData : []}
          hidePagination
        />

          :
          <EnhancedTable
          headCells={headCells}
          data={tabledata}
          style={{ backgroundColor: curTheme === 'dark' ? "#000000" : "#ffff" }}
          rawdata={outshiftData && !outshiftError && !outshiftLoading ? outshiftData : []}
          hidePagination
        />
        }
       
      </div>
    </React.Fragment>
  );
}
