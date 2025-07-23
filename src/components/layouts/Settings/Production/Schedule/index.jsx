import React, { useEffect } from 'react'; 
import moment from 'moment';
import UseShifts from '../ShiftCalender/hooks/useShifts';
import { useRecoilState } from "recoil";
import { selectedPlant } from "recoilStore/atoms";
import "./index.css";

export default function Index() {
  const { outshiftLoading, outshiftData, outshiftError, getshifts } = UseShifts();
  const [headPlant] = useRecoilState(selectedPlant);

  const schedulerData = async () => {
    if (!outshiftLoading && outshiftData && !outshiftError) {
      if (outshiftData.shift && outshiftData.shift.shifts) {
        var currentDate = moment();
        var weekStart = currentDate.clone().startOf('week');
        let weekdata = []
        for (let i = 0; i <= 6; i++) {
          const day = moment(weekStart).add(i, 'days');
          let shiftData = []
          if (outshiftData.shift.ShiftType === "Daily" && outshiftData.shift.shifts.length > 0) {
            shiftData = await outshiftData.shift.shifts.map((x) => {
              let DST1 = moment().format(`YYYY-MM-DDT` + x.startDate) + 'Z'
              if (moment(DST1).isDST()) { // Checking for Day-light Saving
                DST1 = moment(DST1).subtract(60, 'minutes').format('YYYY-MM-DDTHH:mm:ssZ')
              }
              const starttime = new Date(DST1);
              let st1 = starttime.toLocaleTimeString('en-GB');
              let st2 = st1.split(":");

              let DST2 = moment().format(`YYYY-MM-DDT` + x.endDate) + 'Z'
              if (moment(DST2).isDST()) {
                DST2 = moment(DST2).subtract(60, 'minutes').format('YYYY-MM-DDTHH:mm:ssZ')
              }
              const endtime = new Date(DST2)
              let et1 = endtime.toLocaleTimeString('en-GB');
              let et2 = et1.split(":");
              let start_Date = new Date(Number(day.format('YYYY')), Number(day.format('MM')) - 1, Number(day.format('DD')), st2[0], st2[1]);
              let end_Date = new Date(Number(day.format('YYYY')), Number(day.format('MM')) - 1, Number(day.format('DD')), et2[0], et2[1]);
              if (end_Date.getTime() < start_Date.getTime()) {
                end_Date = end_Date.setDate(end_Date.getDate() + 1);

              }
              return {
                id: i,
                title: x.name,
                startDate: start_Date,
                endDate: end_Date,
            };
            
            })
          } else {
            shiftData = outshiftData.shift.shifts[i].map(s => {
              if (s.name && s.name !== '-') {
                const starttime = new Date(weekStart.format(`YYYY-MM-DDT` + s.startDate) + 'Z');
               
                
                let st1;
                if (starttime.getDay() === new Date(weekStart).getDay()) {
                  st1 = moment(starttime).add(i + 1, 'days').format('YYYY-MM-DDTHH:mm:ssZ')
                } else {
                  st1 = moment(starttime).add(i + 1, 'days').subtract(1, 'days').format('YYYY-MM-DDTHH:mm:ssZ')
                }

                const endtime = new Date(weekStart.format(`YYYY-MM-DDT` + s.endDate) + 'Z');
                
                let et1;
                
                if (endtime.getDay() === new Date(weekStart).getDay()) {
                  et1 = moment(endtime).add(i + 1, 'days').format('YYYY-MM-DDTHH:mm:ssZ')
                } else {
                  et1 = moment(endtime).add(i + 1, 'days').subtract(1, 'days').format('YYYY-MM-DDTHH:mm:ssZ')
                }

             
                if (new Date(et1).getTime() < new Date(st1).getTime()) {
                  et1 = moment(et1).add(1, 'days').format('YYYY-MM-DDTHH:mm:ssZ')
                }

                if (i === 6) {
                  et1 = moment(et1).subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss')
                  st1 = moment(st1).subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss')
                }
                return {
                  id: i,
                  title: s.name,
                  startDate: new Date(st1),
                  endDate: new Date(et1),
              };
              
              } else {
                return {
                  id: i,
                  title: '',
                  startDate: null,
                  endDate: null,
              };
              
              }

            })

          }
          weekdata = [...weekdata, ...shiftData]

        }
        
      }
    }
  }

  useEffect(() => {
    getshifts(headPlant.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant])

  useEffect(() => {
    schedulerData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outshiftData])
  return (
    <div style={{backgroundColor:'#ffff'}}>

      {/* <Scheduler
        data={shiftDatas}
      // onChange={handleChange} 
      >
        <ViewState
          currentDate={currentDate}

        />

        <WeekView startDayHour={0} endDayHour={24} />

        <Appointments />

      </Scheduler> */}


    </div>
  );
}


