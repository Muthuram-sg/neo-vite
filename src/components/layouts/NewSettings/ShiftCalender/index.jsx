import React, { useState, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { useTranslation } from 'react-i18next';
import EnhancedTable from "components/Table/Table";
import moment from "moment";

import { themeMode, selectedPlant } from "recoilStore/atoms";
import LoadingScreen from "LoadingScreenNDL"
import Button from 'components/Core/ButtonNDL';
import Toast from "components/Core/Toast/ToastNDL";
import useShift from "./hooks/useShifts";
import useUpdateShift from "./hooks/useUpdateShift";
import ShiftCalendarModal from "./components/ShiftCalendarModal";
import Typography from "components/Core/Typography/TypographyNDL";
import useGetTheme from 'TailwindTheme';
import BredCrumbsNDL from "components/Core/Bredcrumbs/BredCrumbsNDL";


export default function ShiftCalender(props) {
  const { t } = useTranslation();
  const theme = useGetTheme();
  const [openSnack, setOpenSnack] = useState(false);
  const [message, setSnackMessage] = useState('');//NOSONAR
  const [type, setSnackType] = useState('');//NOSONAR
  const AddShiftCalendarRef = useRef();
  const [curTheme] = useRecoilState(themeMode);
  const [tabledata, setTableData] = useState([])//NOSONAR
  const [headPlant,] = useRecoilState(selectedPlant);
  const [shiftData, setShiftData] = useState({})
  const [, setcontractLoader] = useState(false)//NOSONAR
  const { outshiftLoading, outshiftData, outshiftError, getshifts } = useShift();
  const [ShiftType, setShiftType] = useState('')
  const { updateshiftwithoutIDLoading, updateshiftwithoutIDData, updateshiftwithoutIDError, getupdateshiftwithoutID } = useUpdateShift()
  const [page, setPage] = useState('Shift Calendar')
  const [, setbuttonLoader] = useState(false)//NOSONAR


  const headCells = [
    {
      id: 'S.NO',
      numeric: false,
      disablePadding: true,
      label: t('S.NO'),
    },
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
          setcontractLoader(false)
          setSnackMessage(t("Shift Updated"));
          setSnackType("success");
          setOpenSnack(true);
          handleActiveIndex(0)
       

      }
    }
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateshiftwithoutIDLoading, updateshiftwithoutIDError, updateshiftwithoutIDData])
// NOSONAR - This function requires Arrow function
  const processedrows = () => {//NOSONAR
    let temptabledata = []
    setShiftData(outshiftData)
    if (outshiftData && !outshiftError && !outshiftLoading) {
      let shiftType = outshiftData.shift && outshiftData.shift.ShiftType && outshiftData.shift.ShiftType
      setShiftType(shiftType ? shiftType : '')//NOSONAR
      if (shiftType === "Daily") {
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
      } else {
        if (outshiftData.shift && outshiftData.shift.shifts) {//NOSONAR
          const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
          const mergedShifts = [];
          for (const key in outshiftData.shift.shifts) {
            if (outshiftData.shift.shifts.hasOwnProperty(key)) {
              const dayIndex = parseInt(key);
              const dayName = daysOfWeek[dayIndex];
              const shifts = outshiftData.shift.shifts[key].map(shift => ({ ...shift, day: dayName }));
              mergedShifts.push(...shifts);
            }
          }
          temptabledata = temptabledata.concat(mergedShifts && mergedShifts.length > 0 && mergedShifts.filter(k => k.name !== "-" && k.name !== "").map((val, index) => {
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
            return [val.name, val.day, start, end]
          })
          )
        }
      }

    }

    setTableData(temptabledata.map((item, index) => [index + 1, ...item]))
  }

  const breadcrump = [{ id: 0, name: 'Settings' }, { id: 1, name: 'Edit Shift' }]
  const handleActiveIndex = (index) => {
    if (index === 0) {
      setPage('Shift Calendar')
      props.handleHide(false)//NOSONAR
    }

  }

  const handleShiftEdit = (id, data) => {
    setPage('form')
    props.handleHide(true)//NOSONAR
    AddShiftCalendarRef.current.handleShiftEdit(data);
  }

  const handleSaveShiftCalendar = () => {
    setbuttonLoader(true)
    AddShiftCalendarRef.current.handleSaveShift();
  }

 
  return (
    <React.Fragment>
      {
                 outshiftLoading && <LoadingScreen /> 
       }
      <Toast type={type} message={message} toastBar={openSnack} handleSnackClose={() => setOpenSnack(false)} ></Toast>
      <div className='bg-Background-bg-primary dark:bg-Background-bg-primary-dark h-[48px] px-4 py-2 flex justify-between items-center ' style={{ borderBottom: '1px solid ' + theme.colorPalette.divider, zIndex: '20', width: `calc(100% -"253px"})` }}>
        {
          page === 'Shift Calendar' ?
            <React.Fragment>
              <Typography value='Shift Calendar' variant='heading-02-xs' />
              <Button
                type="ghost"
                value={t('Edit')} onClick={(data) => { handleShiftEdit(data) }}
              />
            </React.Fragment>

            :
            <React.Fragment>
              <BredCrumbsNDL breadcrump={breadcrump} onActive={handleActiveIndex} />
              <div className="flex gap-2">
                <Button type="secondary" value={t('Cancel')} onClick={() => {setPage('Shift Calendar');props.handleHide(false)}} />
                <Button type="primary" value={t('Update')} loading={updateshiftwithoutIDLoading} onClick={() => handleSaveShiftCalendar()} />
              </div>
            </React.Fragment>
        }
      </div>
    
      <div className="p-4 bg-Background-bg-secondary dark:bg-Background-bg-secondary-dark h-[93vh]">
        {
          page === 'Shift Calendar' ?
            <React.Fragment>
              {
                ShiftType === "Daily" ?
                  <EnhancedTable
                    headCells={headCells.filter(x => x.id !== 'Day')}
                    data={tabledata}
                    style={{ backgroundColor: curTheme === 'dark' ? "#000000" : "#ffff" }}
                    rawdata={tabledata}
                    hidePagination
                  />

                  :
                  <EnhancedTable
                    headCells={headCells}
                    data={tabledata}
                    style={{ backgroundColor: curTheme === 'dark' ? "#000000" : "#ffff" }}
                    rawdata={tabledata}
                    hidePagination
                  />
              }
            </React.Fragment>
            :
            <ShiftCalendarModal
              shiftData={shiftData}
              ref={AddShiftCalendarRef}
              handleActiveIndex={handleActiveIndex}
              headPlant={headPlant}
              getShiftList={() => getshifts(headPlant.id)}
              getupdateshiftwithoutID={getupdateshiftwithoutID}
              buttonLoader={(e)=>setbuttonLoader(e)}
            />
        }
      </div>
    </React.Fragment>
  );
}
