import React from "react";
import Grid from 'components/Core/GridNDL'
import Button from "components/Core/ButtonNDL";
import InputFieldNDL from "components/Core/InputFieldNDL";
import NewDatepicker from "components/Core/DatePicker/DatepickerNew"
import moment from 'moment';
import Delete from 'assets/neo_icons/Menu/Close_new.svg?react';
import { useTranslation } from 'react-i18next';
import { useAuth } from "components/Context";

export default function Dailyshifts(props) {
  const { HF } = useAuth();
  const { t } = useTranslation();
  
  return (
    <React.Fragment>
      {props.addFields.map(val => {
        let selectedTimeStart;

        if (props.selectedtimestart[0] !== undefined) {
          if (
            props.selectedtimestart[0][val.field] === undefined ||
            props.selectedtimestart[0][val.field] === null
          ) {
            selectedTimeStart = null;
          } else if (props.selectedtimestart[0][val.field].getHours !== undefined) {
            selectedTimeStart = new Date(props.selectedtimestart[0][val.field]);
          } else {
            selectedTimeStart = moment().format(`YYYY-MM-DDT` + props.selectedtimestart[0][val.field] + `:ssZ`);
          }
        }
        let selectedTimeEnd;

          if (props.selectedtimeend[0] !== undefined) {
            if (
              props.selectedtimeend[0][val.field] === undefined ||
              props.selectedtimeend[0][val.field] === null
            ) {
              selectedTimeEnd = null;
            } else if (props.selectedtimeend[0][val.field].getHours !== undefined) {
              selectedTimeEnd = new Date(props.selectedtimeend[0][val.field]);
            } else {
              selectedTimeEnd = moment().format(`YYYY-MM-DDT` + props.selectedtimeend[0][val.field] + `:ssZ`);
            }
          }
        return <Grid container key={val.field}>
          <Grid item xs={6}>
            <InputFieldNDL id="line-plant" defaultValue={props.shiftnameday[0] ? props.shiftnameday[0][val.field] : ''} value={props.shiftnameday[0] ? props.shiftnameday[0][val.field] : ""} style={{ width: '98%', marginTop: 8 }} onChange={(e) => props.handleshiftChange(e, val.field)} size="small"  />
          </Grid>
          <Grid item xs={3}>
            <NewDatepicker 
                setAmPm={false} 
                minDate={new Date()} 
                maxdate={new Date()} 
                type={"OnlyTime"} 
                formats={HF.HM} 
                selectedstarttime={(e) => props.handletimefromChange(e, val.field)} 
                selectedtimestart={selectedTimeStart} 
                Dropdowndefine={"FromDate"} />
          </Grid>
          <Grid item xs={3}>
            <NewDatepicker 
            setAmPm={false} 
            minDate={new Date()} 
            maxdate={new Date()} 
            labelSt={"Starting Time"} 
            type={"OnlyTime"} 
            formats={HF.HM} 
            selectedstarttime={selectedTimeEnd} 
            Dropdowndefine={"EndDate"} />
          </Grid>
          <Grid style={{ marginLeft: -95, marginTop: 17, cursor: "pointer" }}>
            {val.field !== 1 ? (
              <Delete onClick={() => { props.removeChannel(val.field) }} />
            ) : ''}
          </Grid>
        </Grid>
      })
      }
      <div style={{ width: "100%", display: "flex", justifyContent: "end", marginRight: "111px" }}>
        <Button type="ghost" onClick={() => { props.addnewlineitem(props.addFields.field) }} value={t('AddField')} />
      </div>
    </React.Fragment>
  )
}