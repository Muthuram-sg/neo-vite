/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import useTheme from "TailwindTheme";
import Grid from "components/Core/GridNDL";
import { useTranslation } from "react-i18next";
import configParam from "config";
import moment from "moment";
import gqlQueries from "components/layouts/Queries";
import { useRecoilState } from "recoil";
import { showOEEAsset,selectedPlant, customdates, ProgressLoad,dashBtnGrp} from "recoilStore/atoms";
import { useAuth } from "components/Context";
import KpiCards from "components/Core/KPICards/KpiCardsNDL"
import HorizontalLine from "components/Core/HorizontalLine/HorizontalLineNDL";
import TypographyNDL from "components/Core/Typography/TypographyNDL";

function Timer(props) {
  let [secondsPassed, setSeconds] = useState(props.seconds);
  useEffect(() => {
    const timeout = setTimeout(() => {
      ++secondsPassed;
      setSeconds(parseInt(secondsPassed));
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [secondsPassed]);
  let diff = moment.duration(moment(new Date()).diff(new Date(props.lastactive)))
  let year = diff.years() > 0 ? diff.years() + " year " : "" 
  let month = diff.months() > 0 ? diff.months() + " month " : "" 
  let day = diff.days() > 0 ? diff.days() + " day " : ""
  let hour = diff.hours() > 0  ? diff.hours() + " hour " : ""
  let minute = diff.minutes() > 0  ? diff.minutes() + " minute " : ""
  let second = diff.seconds() > 0  ? diff.seconds() + " second " : ""
  
  let countdown = year+month+day+hour+minute+second
 
  return (
      <span style={{ cursor: "pointer" }}>
        {countdown}
      </span>
  );
}

function Status(prop) {
  const { t } = useTranslation();
  if (prop.lastactive === "--") {
    return <span>{t("No Data")}</span>;
  } else if (prop.status === "IDLE" || prop.status === "STOPPED") {
    return <span>{(prop.today === 1 ? t("LastActiveAt") : t("LastActiveOn")) + prop.lastactive}</span>;
  } else if (prop.status === "ACTIVE") {
    return <span>{t("ActiveSinceLast") + prop.lastactive}</span>;
  } else {
    return null;
  }
}

export default function DowntimeDashboard(props) {
  const { HF } = useAuth();
  const { t } = useTranslation();
  const [, setProgressBar] = useRecoilState(ProgressLoad);
  const [OEEList, setOEEList] = useState([]);
  const [headPlant] = useRecoilState(selectedPlant);
  const [, setBTNValue] = useRecoilState(dashBtnGrp);
  const [, setSelectedAssetID] = useRecoilState(showOEEAsset);
  const maintheme = useTheme();
  const [customdatesval,] = useRecoilState(customdates); 
  
  useEffect(()=>{ 
    setTimeout(()=>{
      setBTNValue(6);
    },1000)
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  useEffect(() => {
    setOEEList([]);
    getAssetOEEConfigs();
    setProgressBar(true) 
  }, [headPlant, customdatesval]); // eslint-disable-line react-hooks/exhaustive-deps

 
  
  function getAssetOEEConfigs() {
    setSelectedAssetID({ show: false, id: 0 }) 
    configParam
      .RUN_GQL_API(gqlQueries.getAssetOEEConfigs, {
        line_id: headPlant.id,
        start_dt: props.date,
        end_dt: new Date(),
      })

      .then((oeeData) => {
        if (
          oeeData !== undefined &&
          oeeData.neo_skeleton_prod_asset_oee_config &&
          oeeData.neo_skeleton_prod_asset_oee_config.length > 0
        ) {
          DowntimeCalc(oeeData.neo_skeleton_prod_asset_oee_config);
        } else {
          console.log("returndata undefined getAssetOEEConfigs");
          setProgressBar(false)
        }
      });
  }
  function DowntimeCalc(dataArray) {
    Promise.all(
      dataArray.map((val) => {
        val.status = "STOPPED";
        val.lastactive = "--";
        val.seconds = 0
        val.lastdt = "--:--:--"
      
        let startrange = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss");
        let endrange = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss");
          
        return (
        configParam
          .RUN_GQL_API(gqlQueries.GetDowntimeAndQualitydefects, {
            entity_id: val.entity.id,
            start_dt:startrange, //TO BE REVERTED BACK val.entity.prod_execs[0].start_dt ,
            end_dt:endrange  //TO BE REVERTED BACK moment(Math.min.apply(null, dateA)).format()
          })
          .then(async(DowntimeData) => {
            let outage;
            val.today = 1;
            if (DowntimeData.neo_skeleton_prod_outage.length > 0) {
              let downtime = 0;
              let dif = 0;
              val.dtTimeDiff = "00";
              val.status = "ACTIVE";
              val.seconds = 0;
              val.unit = "secs";


              outage = DowntimeData.neo_skeleton_prod_outage;
              outage.forEach(function (dt) {
                downtime =
                  downtime +
                  moment
                    .duration(moment(dt.end_dt).diff(moment(dt.start_dt)))
                    .asMilliseconds();

              });

              dif = moment.duration(downtime);

              const totalSeconds = dif.asMilliseconds() / 1000;
              let mins =  totalSeconds >= 60 ? " mins" : " secs"
              val.unit = totalSeconds >= 3600 ? " hrs" : mins;
              
              if (dif.hours() < 1) {
                if (dif.minutes() < 15 && dif.minutes() > 10) {
                  val.status = "IDLE";
                } else if (dif.minutes() < 10) {
                  val.status = "ACTIVE";
                } else {
                  val.status = "STOPPED";
                }
              } else {
                val.status = "STOPPED";
              }
              
              const hours = dif.hours() < 10 ? "0" + dif.hours() : dif.hours();
              const minutes = dif.minutes() < 10 ? "0" + dif.minutes() : dif.minutes();
              const seconds = dif.seconds() < 10 ? "0" + dif.seconds() : dif.seconds();
              val.dtTimeDiff = [hours, minutes, seconds].join(":");

            }
            return  DowntimeCalc1(val)
          })

          /*the json that contains the asset details*/
          .catch((error) => {
            console.log("Machine Status error", error);
          })
        )
      })
    ).then((data) => {
     
      
      setOEEList(data);
      setProgressBar(false)
      
    });
  }

  async function DowntimeCalc1 (val) {
    let Value;
    let  index;
        let lastactive = "00:00"
        val.seconds = 0
        let activeday;
        val.lastdt = "--:--:--"
        
        let startrange = moment(customdatesval.StartDate).format("YYYY-MM-DDTHH:mm:ss");
        let endrange = moment(customdatesval.EndDate).format("YYYY-MM-DDTHH:mm:ss");
           
        const body = {
          schema: headPlant.schema,
          instrument_id: val.instrumentByMachineStatusSignalInstrument.id,
          metric_name: val.metricByMachineStatusSignal.name,
          start_date: startrange, //TO BE REVERTED BACK val.entity.prod_execs[0].start_dt  ,
          end_date: endrange, //TO BE REVERTED BACK  moment(Math.min.apply(null, dateA)).format(),
          mic_stop: val.mic_stop_duration,
          active_signal: val.is_status_signal_available,
          downfall: val.is_part_count_downfall
        };
        
          return configParam
            .RUN_REST_API("/dashboards/machinestatussignal", body)
            .then((mssData) => {
              if (mssData) {

                Value = mssData.data.map(({ value }) => value);
                index = Value.lastIndexOf('ACTIVE');
                if (index > 0) {
                  lastactive = mssData.data[index].next // time to next (end of the active cycle duration)
                }
                val.lastdt = lastactive
                
                try {
                  val.seconds = (new Date() - new Date(lastactive)) / 1000;
                }
                catch {
                  val.seconds = 0
                }

                if (lastactive !== "00:00") {
                  if (val.status === "STOPPED" || val.status === "IDLE") {

                    activeday = moment(new Date(lastactive)).format(
                      "MMMM D,YYYY"
                    );
                    if (activeday !== moment(new Date()).format("MMMM D,YYYY")) {
                      val.lastactive = moment(new Date(lastactive)).format(
                        "MMMM D, YYYY "+HF.HM
                      );
                      val.today = 0;
                    }
                    else {
                      val.lastactive = moment(new Date(lastactive), "HH:MM").format(
                        "HH:mm"
                      );
                    }
                  } else {
                    val.lastactive = moment
                      .duration(
                        moment(new Date()).diff(moment(new Date(lastactive)))
                      )
                      .humanize(true);
                  }
                }

              }

              return val;
            })
            /*the json that contains the asset details*/
            .catch((error) =>{ 
        console.log("Machine Status error", error)
          return null 
        })
        
      
     
  }

const renderColor = (value)=>{
  if(value.status && value.status === "IDLE"){
    return '#FFCC00'
  }else{
    if(value.status === "STOPPED"){
      return '#FF2F23'
    }
  }
}

const renderValue=(dat)=>{
 if(dat.lastactive === "--"){
   return  "-- : -- : --"
 }else if(dat.status === "ACTIVE"){
  return  dat.dtTimeDiff + dat.unit
}else{
  return( 
  <Timer
    seconds={dat.seconds }
    lastactive={dat.lastdt }
  />
  )
}
 }


  return (
    <div>
      <Grid container spacing={0} style={{ paddingLeft: 4, paddingTop: 4 }}>
        {OEEList.length > 0 && OEEList.map((val) => (
          val && <Grid item xs={3} style={{ padding: 4 }}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <KpiCards
                  style={{
                    backgroundColor: val.status ? renderColor(val) : maintheme.colorPalette.cards,
                  }}
                >
                  <TypographyNDL
                      variant="heading-02-xs"
                      style={{
                        color: val.status === "ACTIVE" ? maintheme.colorPalette.primary : "#FFFFFF",
                      }}
                      value={val.entity.name}
                    />
                     
                   
                    <HorizontalLine
                      style={{
                        backgroundColor:
                          val.status === "ACTIVE" ? maintheme.colorPalette.divider : "#FFFFFF",
                        marginTop: 8,
                        marginBottom: 8,
                      }}
                    />
                      <br></br>

                    <div
                      style={{
                        maxHeight:210,
                        height: 204,
                        overflow: "auto",
                        padding: 0,
                        msOverflowStyle: "none",
                        scrollbarWidth: "none",
                        "& ::-webkit-scrollbar": {
                          display: "none",
                          width: "0em",
                        },
                      }}
                    >
                      <div style={{textAlign: "center"}}>
                      <TypographyNDL
                        variant="display-m"
                        color={val.status === "ACTIVE" ? "tertiary" : "#FFFFFF" }
                      value={val.lastactive !== "--" && val.status === "IDLE" || val.status === "STOPPED"
                        ? t("DownFor")
                        : t("TotalDowntime")
                      }
                      />
                        
                      <br></br>
                      <TypographyNDL
                        variant={val.status === "ACTIVE" ? "5xl-heading" : "Body1xl"}
                        color={val.status === "ACTIVE" ? "" : "#FFFFFF"}
                        value= {renderValue(val)}
                        

                      />
                        <br></br>
                      
                      <TypographyNDL
                        variant="heading-01-m"
                        color={val.status === "ACTIVE" ? "" : "#FFFFFF"}
                        value={Status({status:val.status,lastactive:val.lastactive,today:val.today})}
                      />
                        
                      
                      </div>
                  </div>
                </KpiCards>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
