import React, { useState, useEffect } from "react";
import Typography from "components/Core/Typography/TypographyNDL";
import Card from "components/Core/KPICards/KpiCardsNDL";
import Grid from 'components/Core/GridNDL'
import { useRecoilState } from "recoil";
import {  selectedPlant, themeMode,instrumentsArry,customdates } from "recoilStore/atoms";
import moment from 'moment';  
import useAlertList from "components/layouts/Dashboards/Content/EditSettings/hooks/useAlertList";
import usePaginationAlerts from "components/layouts/Line/hooks/usePaginationAlerts";
import { useTranslation } from 'react-i18next';
import Chart from "react-apexcharts"; 

export default function Alarms(props) {
  const { t } = useTranslation();
  const [curTheme] = useRecoilState(themeMode);
  const [instrumentsList] = useRecoilState(instrumentsArry);
  const [headPlant] = useRecoilState(selectedPlant);  
  const [customdatesval,] = useRecoilState(customdates);
  const [totAlarmTrig, setCount] = useState(0);
  const [alarmRangebar,setalarmRangebar] = useState([]); 
  const [paretoLabel,setparetoLabel] =useState([]);
  const [Colpareto,setColpareto] =useState([]);
  const [Linepareto,setLinepareto] =useState([]);
  const [totAlarmConfig,setAlarmsList] = useState(0);
  const [uniqueAlarm,setuniqueAlarm] = useState(0);
  
  const { AlertListLoading, AlertListData, AlertListError, getAlertList } = useAlertList()
  const { PaginationAlertsLoading, PaginationAlertsData, PaginationAlertsError, getPaginationAlerts } = usePaginationAlerts() 

  const classes={
    heading: {
      fontSize: 24,
      lineHeight: '28px',
      fontWeight: 500,
    },
    card: {
      backgroundColor: "#F8F8F8",
      width: "30%",
      margin: '0 10px',
      padding: 12
    },
    cardHeading: {
      fontSize: 16,
      lineHeight: '24px',
      fontWeight: 500
    },
    cardValue: {
      fontSize: 34,
      lineHeight: '48px',
      fontWeight: 600,
      float: 'right'
    },
    alarmHeading: {
      borderBottom: "1px solid",
      borderBottomColor:"#E5E5E5",
      fontSize: 16,
      lineHeight: '24px',
      fontWeight: 500,
    },
    alarmCard: {
      boxShadow: "none",
      border: "1px solid",
      borderColor:"#E5E5E5",
      borderRadius: 4
    }
  }

  

  useEffect(() => { 
      getAlertNotifications(0, ""); 
      getAlertList(headPlant.id) 
      props.progress(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headPlant,customdatesval,props.refresh]);
   
  useEffect(() => {
    if (!AlertListLoading && !AlertListError && AlertListData) {
      const alertsList = AlertListData.neo_skeleton_alerts_v2.length > 0 ? AlertListData.neo_skeleton_alerts_v2 : [];
      const alertsListconnectivity = AlertListData.neo_skeleton_connectivity.length > 0 ? AlertListData.neo_skeleton_connectivity : [];
      setAlarmsList(alertsList.length + alertsListconnectivity.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AlertListLoading, AlertListData, AlertListLoading])

  useEffect(() => {
    if (!PaginationAlertsLoading && !PaginationAlertsError && PaginationAlertsData) {
      let res = PaginationAlertsData.Data
      if (Number(res.count) > 0) {
        setCount(res.count);
        if (res.data && res.data.length > 0) { 
          var filtered=[];
          var filInstru=[];
          var timeLine = [{
                name: 'Critical',
                data: []
            },
            {
                name: 'Warning',
                data: []
            }]
          // eslint-disable-next-line array-callback-return
          res.data.map(val=>{
            if(val.alert_level === "warn"){
              timeLine[1].data.push({  
                        x: t("Alarms"),
                        y: [new Date(val.time).getTime(), new Date(val.time).setSeconds(new Date(val.time).getSeconds() + 10)],
                        fillColor: '#FFA500'
                       
                        })
            }else{
              timeLine[0].data.push({
                        x: t("Alarms"),
                        y: [new Date(val.time).getTime(), new Date(val.time).setSeconds(new Date(val.time).getSeconds() + 10)],
                        fillColor: '#FF0000'
                      })
            }
            
            filtered.push(val.alert_level)
            filInstru.push(val.iid)
          })
          let filarr = filtered.filter((item, index) => filtered.indexOf(item) !== index);//Duplicate
          let filarruniq = [...new Set(filarr.map(item => item))];
          // eslint-disable-next-line array-callback-return
          filarruniq.forEach(val => {
            let uniqarr = res.data.filter(x => x.alert_level !== val);
            setuniqueAlarm(uniqarr.length);
          });
          
          setalarmRangebar(timeLine)
          
          // Alarms Pareto
          let filInstruUniq = [...new Set(filInstru.map(item => item))]; 
          let Labelname =[]
          // eslint-disable-next-line array-callback-return
          filInstruUniq.forEach(val=>{
            Labelname.push(instrumentsList.filter(ins=> ins.id === val)[0].name)
          })
          setparetoLabel(Labelname) 
          var col =[]
          // eslint-disable-next-line array-callback-return
          filInstruUniq.forEach(val=>{ 
            col.push(res.data.filter(x=> x.iid === val).length)
          })
          setColpareto(col)
          var Line=[]
          // eslint-disable-next-line array-callback-return
          col.forEach(val=>{
              Line.push((val/res.count * 100).toFixed(2))
          })
          setLinepareto(Line)  
        } 
        props.refreshOff(true)
        props.progress(false)
      } else {
        setCount(0);
        props.refreshOff(true) 
        props.progress(false)
      }
    }else{
      props.progress(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PaginationAlertsLoading, PaginationAlertsData, PaginationAlertsLoading])
  
  const getAlertNotifications = (currpage, searchStatus) => {  
    var frmDate = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ssZ");
    var toDate = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ssZ"); 

    let queryData = {
      schema: headPlant.schema,
      currpage: currpage,
      perRow: 'All',
      searchBy: searchStatus, 
      from:frmDate,
      to:toDate
    }
    getPaginationAlerts(queryData)
    
  } 

  return (
    <React.Fragment>
       
      {totAlarmTrig === 0 && 
        <Grid container spacing={0} style={{ padding: 4,marginTop: '50px' }}>
            <Grid item xs={12} style={{ padding: 4}}>
                <Card elevation={0} style={{ height: "100%", backgroundColor: curTheme === 'light' ? "#FFFFFF" : "#1D1D1D" }} >
                    <div style={{ padding: 10, textAlign: "center" }}>
                        <Typography variant="label-02-s" value={t("No Alarms for the selected Range")} />
                    </div>
                </Card>
            </Grid>
        </Grid>}
        {totAlarmTrig !== 0 &&
      
        <Grid container spacing={3} style={{ padding: 10,width: '100%',margin: '0',marginTop: '50px' }}>

          <Grid item xs={12}>
            <Typography style={classes.heading}
              value= {t("Key Performance Indicators")} />
          </Grid>
          <Grid item xs={12} style={{ display: 'flex' }}>
            <div style={classes.card}>
              <Typography style={classes.cardHeading}
            value=  {t("Total Alarms Triggered")}/>

              <Typography style={classes.cardValue}
              value= {totAlarmTrig} />
            </div>
            <div style={classes.card}>
              <Typography style={classes.cardHeading}
              value={t("Unique Alarms Triggered")}/>
              <Typography style={classes.cardValue}
              value= {uniqueAlarm} />
            </div>
            <div style={classes.card}>
              <Typography style={classes.cardHeading}
             value= {t("Total Alarm Configured")}/>
              <Typography style={classes.cardValue}
              value= {totAlarmConfig} />
            </div>
          </Grid>

          <Grid item xs={12}>
            <Card style={classes.alarmCard}>
              <Typography style={classes.alarmHeading}
              value= {t("Alarm Timeline")} />
              <Chart
                height={85}
                width={'100%'}
                options={{
                  chart: {
                    type: 'rangeBar',
                    toolbar: {
                      show: false
                    },
                  },
                  plotOptions: {
                    bar: {
                      horizontal: true,
                      barHeight: '100%',
                      rangeBarGroupRows: true
                    }
                  },
                  colors: ['#FF0000', '#FFA500'],
                  fill: {
                    type: ['solid', 'solid'],
                    pattern: {
                      style: 'slantedLines',
                      width: 6,
                      height: 6,
                      strokeWidth: 2,
                    },
                  },
                  xaxis: {
                    type: 'datetime',
                    labels: {
                      rotate: 0,
                      datetimeUTC: false,
                      format: 'hh:mm tt',
                      style: {
                        colors: "#242424"
                      },
                    }
                  },
                  legend: {
                    show: false
                  },
                  tooltip: {
                    enabled: true,
                    x: {
                      show: true,
                      format: 'hh:mm tt',
                      formatter: undefined,
                    },
                    // y: {
                    //     formatter: undefined,
                    //     title: {
                    //         formatter: (seriesName) => seriesName + OEEData.dtReasonArray.filter(x => x.id === value.reason).length > 0 ? OEEData.dtReasonArray.filter(x => x.id === value.reason)[0].name : "",
                    //     },
                    // },
                  }
                }}
                series={alarmRangebar}
                type="rangeBar"
              />
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Typography style={classes.heading} 
            value={{ borderBottom: "1px solid #E8E8E8" }} Alarms pareto />
            <Chart series={[{
                            name: t('Count'),
                            type: 'column',
                            data: Colpareto
                          }, {
                            name: t('Percentage'),
                            type: 'line',
                            data: Linepareto
                          }]} 
                          height={350}
                          width={'100%'}
            options={{
              
              stroke: {
                width: [0, 4]
              },
              dataLabels: {
                enabled: true,
                enabledOnSeries: [1]
              },
              labels: paretoLabel,
              xaxis: {
                type: 'text'
              },
              yaxis: [{
                title: {
                  text: t('Alarm Count'),
                },

              },
              {
                opposite: true,
                title: {
                  text: t('Alarm Percentage')
                }
              }]
            }} />
          </Grid>

        </Grid>
      }
    </React.Fragment>
  );
}